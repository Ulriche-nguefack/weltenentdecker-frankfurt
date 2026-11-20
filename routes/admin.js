const express = require('express');
const router = express.Router();
const { lese, schreibe } = require('../utils/jsonStore');
const { mitarbeiterErforderlich } = require('../middleware/auth');

// Statistiken für Dashboard-Kacheln
router.get('/statistiken', mitarbeiterErforderlich, (req, res) => {
  const buchungen = lese('buchungen');
  const reisen = lese('reisen');
  res.json({
    offeneBuchungen: buchungen.filter(b => b.status === 'offen').length,
    bestaetigteBuchungen: buchungen.filter(b => b.status === 'bestaetigt').length,
    gesamtBuchungen: buchungen.length,
    gesamtReisen: reisen.length,
    reiseMitFreienPlaetzen: reisen.filter(r => r.freiePlaetze > 0).length,
  });
});

// Seiteninhalt lesen (Hero-Text, Hero-Bild) - öffentlich lesbar
router.get('/seiteninhalt', (req, res) => {
  const inhalt = lese('seiteninhalt');
  res.json(Array.isArray(inhalt) ? {
    heroTitel: 'Die Welt wartet. Wir finden Ihre Route.',
    heroUntertitel: 'Ob Städtetrip, Strandurlaub, Abenteuer, Kulturreise oder Kreuzfahrt — wir beraten persönlich aus Frankfurt.',
    heroBild: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop'
  } : inhalt);
});

// Seiteninhalt speichern - nur Mitarbeitende
router.put('/seiteninhalt', mitarbeiterErforderlich, (req, res) => {
  const aktuell = lese('seiteninhalt');
  const basis = Array.isArray(aktuell) ? {} : aktuell;
  // Nur Felder überschreiben, die tatsächlich mitgeschickt wurden
  const neu = { ...basis };
  if (req.body.heroTitel !== undefined) neu.heroTitel = req.body.heroTitel;
  if (req.body.heroUntertitel !== undefined) neu.heroUntertitel = req.body.heroUntertitel;
  if (req.body.heroBild !== undefined) neu.heroBild = req.body.heroBild;
  if (req.body.logoName !== undefined) neu.logoName = req.body.logoName;
  if (req.body.faviconUrl !== undefined) neu.faviconUrl = req.body.faviconUrl;
  schreibe('seiteninhalt', neu);
  res.json({ erfolg: true, inhalt: neu });
});

// Themenwelten verwalten
router.get('/themenwelten', mitarbeiterErforderlich, (req, res) => {
  const reisen = lese('reisen');
  const liste = ['Staedtereisen','Strandreisen','Abenteuerreisen','Kulturreisen','Kreuzfahrten'];
  res.json(liste.map(t => ({
    name: t,
    anzahl: reisen.filter(r => r.themenwelt === t).length
  })));
});

module.exports = router;
