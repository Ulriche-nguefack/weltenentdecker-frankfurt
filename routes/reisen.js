const express = require('express');
const router = express.Router();
const { lese, schreibe, naechsteId } = require('../utils/jsonStore');
const { mitarbeiterErforderlich } = require('../middleware/auth');
const { validiereReise } = require('../middleware/validierung');

router.get('/', (req, res) => {
  let reisen = lese('reisen');
  const { ziel, themenwelt, preisVon, preisBis, dauerVon, dauerBis, flug, verpflegung, suche, topAngebote } = req.query;
  if (ziel) { const z = ziel.toLowerCase(); reisen = reisen.filter(r => r.ziel.toLowerCase().includes(z) || r.land.toLowerCase().includes(z)); }
  if (themenwelt) reisen = reisen.filter(r => r.themenwelt === themenwelt);
  if (preisVon) reisen = reisen.filter(r => r.preisProPerson >= parseFloat(preisVon));
  if (preisBis) reisen = reisen.filter(r => r.preisProPerson <= parseFloat(preisBis));
  if (dauerVon) reisen = reisen.filter(r => r.dauerTage >= parseInt(dauerVon));
  if (dauerBis) reisen = reisen.filter(r => r.dauerTage <= parseInt(dauerBis));
  if (flug) reisen = reisen.filter(r => r.flug === flug);
  if (verpflegung) reisen = reisen.filter(r => r.verpflegung === verpflegung);
  if (suche) { const s = suche.toLowerCase(); reisen = reisen.filter(r => r.titel.toLowerCase().includes(s) || r.ziel.toLowerCase().includes(s) || r.land.toLowerCase().includes(s) || r.beschreibung.toLowerCase().includes(s)); }
  if (topAngebote === 'true') reisen = reisen.filter(r => r.topAngebot === true);
  res.json({ anzahl: reisen.length, reisen });
});

router.get('/themenwelten', (req, res) => {
  const reisen = lese('reisen');
  const liste = ['Staedtereisen','Strandreisen','Abenteuerreisen','Kulturreisen','Kreuzfahrten'];
  res.json(liste.map(t => ({ name: t, anzahl: reisen.filter(r => r.themenwelt === t).length })));
});

router.get('/:id', (req, res) => {
  const reisen = lese('reisen');
  const reise = reisen.find(r => r.id === parseInt(req.params.id));
  if (!reise) return res.status(404).json({ fehler: 'Reise nicht gefunden.' });
  res.json(reise);
});

router.post('/', mitarbeiterErforderlich, validiereReise, (req, res) => {
  const reisen = lese('reisen');
  const neu = { id: naechsteId(reisen), ...req.validiert, waehrung: 'EUR', startTermine: [], inklusivleistungen: [], extras: [], erstelltAm: new Date().toISOString().split('T')[0], aktualisiertAm: new Date().toISOString().split('T')[0] };
  reisen.push(neu);
  schreibe('reisen', reisen);
  res.status(201).json(neu);
});

router.put('/:id', mitarbeiterErforderlich, validiereReise, (req, res) => {
  const reisen = lese('reisen');
  const idx = reisen.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ fehler: 'Reise nicht gefunden.' });
  reisen[idx] = { ...reisen[idx], ...req.validiert, aktualisiertAm: new Date().toISOString().split('T')[0] };
  schreibe('reisen', reisen);
  res.json(reisen[idx]);
});

router.delete('/:id', mitarbeiterErforderlich, (req, res) => {
  const reisen = lese('reisen');
  const idx = reisen.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ fehler: 'Reise nicht gefunden.' });
  const [gel] = reisen.splice(idx, 1);
  schreibe('reisen', reisen);
  res.json({ erfolg: true, geloescht: gel });
});

module.exports = router;
