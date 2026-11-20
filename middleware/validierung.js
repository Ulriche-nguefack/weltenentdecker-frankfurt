const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function saeubereText(wert) {
  if (typeof wert !== 'string') return wert;
  return wert.replace(/<[^>]*>/g, '').trim().slice(0, 2000);
}

function validiereBuchungsAnfrage(req, res, next) {
  const body = req.body || {};
  const fehler = [];
  const name = saeubereText(body.name);
  const email = saeubereText(body.email);
  const telefonnummer = saeubereText(body.telefonnummer || '');
  const personenanzahl = parseInt(body.personenanzahl, 10);
  const reiseId = parseInt(body.reiseId, 10);
  if (!name || name.length < 2) fehler.push('Bitte geben Sie Ihren vollständigen Namen an.');
  if (!email || !EMAIL_REGEX.test(email)) fehler.push('Bitte geben Sie eine gültige E-Mail-Adresse an.');
  if (telefonnummer && !/^[0-9+\s()/-]{4,20}$/.test(telefonnummer)) fehler.push('Die Telefonnummer enthält ungültige Zeichen.');
  if (!reiseId || Number.isNaN(reiseId)) fehler.push('Es wurde keine gültige Reise ausgewählt.');
  if (!personenanzahl || personenanzahl < 1 || personenanzahl > 20) fehler.push('Bitte geben Sie eine gültige Personenanzahl an (1–20).');
  if (fehler.length > 0) return res.status(400).json({ fehler });
  req.validiert = {
    name, email, telefonnummer,
    personenanzahl, reiseId,
    sonderwuensche: saeubereText(body.sonderwuensche || ''),
    typ: body.typ === 'anfrage' ? 'anfrage' : 'buchung',
    gewuenschterTermin: saeubereText(body.gewuenschterTermin || ''),
    extras: Array.isArray(body.extras) ? body.extras.map(saeubereText) : []
  };
  next();
}

function validiereRegistrierung(req, res, next) {
  const body = req.body || {};
  const fehler = [];
  const name = saeubereText(body.name);
  const email = saeubereText(body.email);
  const passwort = body.passwort || '';
  if (!name || name.length < 2) fehler.push('Bitte geben Sie Ihren Namen an.');
  if (!email || !EMAIL_REGEX.test(email)) fehler.push('Bitte geben Sie eine gültige E-Mail-Adresse an.');
  if (!passwort || passwort.length < 8) fehler.push('Das Passwort muss mindestens 8 Zeichen lang sein.');
  if (fehler.length > 0) return res.status(400).json({ fehler });
  req.validiert = { name, email, passwort };
  next();
}

function validiereLogin(req, res, next) {
  const body = req.body || {};
  const fehler = [];
  const email = saeubereText(body.email);
  const passwort = body.passwort || '';
  if (!email || !EMAIL_REGEX.test(email)) fehler.push('Bitte geben Sie eine gültige E-Mail-Adresse an.');
  if (!passwort) fehler.push('Bitte geben Sie Ihr Passwort an.');
  if (fehler.length > 0) return res.status(400).json({ fehler });
  req.validiert = { email, passwort };
  next();
}

function validiereReise(req, res, next) {
  const body = req.body || {};
  const fehler = [];
  const titel = saeubereText(body.titel);
  const ziel = saeubereText(body.ziel);
  const land = saeubereText(body.land);
  const beschreibung = saeubereText(body.beschreibung);
  const themenwelt = saeubereText(body.themenwelt);
  const preisProPerson = parseFloat(body.preisProPerson);
  const dauerTage = parseInt(body.dauerTage, 10);
  const maxPersonen = parseInt(body.maxPersonen, 10);
  const freiePlaetze = parseInt(body.freiePlaetze, 10);
  const erlaubt = ['Staedtereisen','Strandreisen','Abenteuerreisen','Kulturreisen','Kreuzfahrten'];
  if (!titel || titel.length < 3) fehler.push('Bitte einen gültigen Titel angeben.');
  if (!ziel) fehler.push('Bitte ein Reiseziel angeben.');
  if (!land) fehler.push('Bitte ein Land angeben.');
  if (!beschreibung || beschreibung.length < 10) fehler.push('Bitte eine Beschreibung mit mindestens 10 Zeichen angeben.');
  if (!erlaubt.includes(themenwelt)) fehler.push('Bitte eine gültige Themenwelt wählen.');
  if (Number.isNaN(preisProPerson) || preisProPerson < 0) fehler.push('Bitte einen gültigen Preis angeben.');
  if (Number.isNaN(dauerTage) || dauerTage < 1) fehler.push('Bitte eine gültige Dauer angeben.');
  if (Number.isNaN(maxPersonen) || maxPersonen < 1) fehler.push('Bitte eine gültige maximale Personenzahl angeben.');
  if (!Number.isNaN(freiePlaetze) && !Number.isNaN(maxPersonen) && freiePlaetze > maxPersonen) fehler.push('Freie Plätze dürfen die maximale Personenzahl nicht überschreiten.');
  if (fehler.length > 0) return res.status(400).json({ fehler });
  req.validiert = { titel, ziel, land, beschreibung, themenwelt, preisProPerson, dauerTage, maxPersonen,
    freiePlaetze: Number.isNaN(freiePlaetze) ? 0 : freiePlaetze,
    flug: saeubereText(body.flug || 'inklusive'),
    verpflegung: saeubereText(body.verpflegung || 'Frühstück'),
    bild: saeubereText(body.bild || ''),
    topAngebot: body.topAngebot === true || body.topAngebot === 'true' };
  next();
}

module.exports = { saeubereText, validiereBuchungsAnfrage, validiereRegistrierung, validiereLogin, validiereReise };
