const express = require('express');
const router = express.Router();
const { lese, schreibe, naechsteId } = require('../utils/jsonStore');
const { mitarbeiterErforderlich } = require('../middleware/auth');
const { validiereBuchungsAnfrage } = require('../middleware/validierung');

router.post('/', validiereBuchungsAnfrage, (req, res) => {
  const reisen = lese('reisen');
  const reise = reisen.find(r => r.id === req.validiert.reiseId);
  if (!reise) return res.status(404).json({ fehler: 'Reise nicht gefunden.' });
  if (req.validiert.typ === 'buchung' && reise.freiePlaetze < req.validiert.personenanzahl) {
    return res.status(400).json({ fehler: [`Nur noch ${reise.freiePlaetze} Plätze verfügbar. Bitte senden Sie eine Anfrage.`] });
  }
  const buchungen = lese('buchungen');
  const eintrag = {
    id: naechsteId(buchungen), typ: req.validiert.typ,
    status: req.validiert.typ === 'buchung' ? 'bestaetigt' : 'offen',
    reiseId: req.validiert.reiseId, reiseTitel: reise.titel,
    reiseBild: reise.bild, reisePreis: reise.preisProPerson,
    reiseDauer: reise.dauerTage, reiseLand: reise.land,
    name: req.validiert.name, email: req.validiert.email,
    telefonnummer: req.validiert.telefonnummer || null,
    personenanzahl: req.validiert.personenanzahl,
    gewuenschterTermin: req.validiert.gewuenschterTermin || null,
    sonderwuensche: req.validiert.sonderwuensche || null,
    extras: req.validiert.extras || [],
    userId: req.user ? req.user.id : null,
    erstelltAm: new Date().toISOString()
  };
  buchungen.push(eintrag);
  schreibe('buchungen', buchungen);
  if (req.validiert.typ === 'buchung') {
    const ri = reisen.findIndex(r => r.id === reise.id);
    reisen[ri].freiePlaetze -= req.validiert.personenanzahl;
    schreibe('reisen', reisen);
  }
  res.status(201).json({ erfolg: true, nachricht: req.validiert.typ === 'buchung' ? 'Buchung erfolgreich aufgenommen.' : 'Anfrage erfolgreich gesendet. Wir melden uns zeitnah.', eintrag });
});

router.get('/meine', (req, res) => {
  if (!req.user) return res.status(401).json({ fehler: 'Login erforderlich.' });
  const buchungen = lese('buchungen');
  const eigene = buchungen.filter(b => b.userId === req.user.id);
  // Status: vergangen oder kommend
  const heute = new Date();
  const angereichert = eigene.map(b => ({
    ...b,
    zeitstatus: b.gewuenschterTermin && new Date(b.gewuenschterTermin) < heute ? 'vergangen' : 'kommend'
  }));
  angereichert.sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm));
  res.json({ anzahl: angereichert.length, eintraege: angereichert });
});

router.get('/', mitarbeiterErforderlich, (req, res) => {
  const buchungen = lese('buchungen');
  const { status } = req.query;
  const gefiltert = status ? buchungen.filter(b => b.status === status) : buchungen;
  res.json({ anzahl: gefiltert.length, eintraege: [...gefiltert].sort((a, b) => new Date(b.erstelltAm) - new Date(a.erstelltAm)) });
});

router.put('/:id/status', mitarbeiterErforderlich, (req, res) => {
  const erlaubt = ['offen','bestaetigt','abgelehnt','storniert'];
  if (!erlaubt.includes(req.body.status)) return res.status(400).json({ fehler: 'Ungültiger Status.' });
  const buchungen = lese('buchungen');
  const idx = buchungen.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ fehler: 'Nicht gefunden.' });
  buchungen[idx].status = req.body.status;
  schreibe('buchungen', buchungen);
  res.json({ erfolg: true, eintrag: buchungen[idx] });
});

router.delete('/:id', mitarbeiterErforderlich, (req, res) => {
  const buchungen = lese('buchungen');
  const idx = buchungen.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ fehler: 'Nicht gefunden.' });
  buchungen.splice(idx, 1);
  schreibe('buchungen', buchungen);
  res.json({ erfolg: true });
});

module.exports = router;
