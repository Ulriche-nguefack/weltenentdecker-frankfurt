const fs = require('fs');
const path = require('path');
const DATA_DIR = path.join(__dirname, '..', 'data');

function dateiPfad(name) { return path.join(DATA_DIR, `${name}.json`); }

function lese(name) {
  const p = dateiPfad(name);
  if (!fs.existsSync(p)) { fs.writeFileSync(p, '[]', 'utf-8'); return []; }
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch { return []; }
}

function schreibe(name, daten) {
  fs.writeFileSync(dateiPfad(name), JSON.stringify(daten, null, 2), 'utf-8');
}

function naechsteId(liste) {
  if (!liste || liste.length === 0) return 1;
  return Math.max(...liste.map(e => e.id || 0)) + 1;
}

module.exports = { lese, schreibe, naechsteId };
