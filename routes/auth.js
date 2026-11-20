const express = require('express');
const router = express.Router();
const { lese, schreibe, naechsteId } = require('../utils/jsonStore');
const { hashPassword, verifyPassword } = require('../utils/password');
const { erzeugeToken } = require('../utils/jwt');
const { validiereRegistrierung, validiereLogin } = require('../middleware/validierung');

const COOKIE = { httpOnly: true, sameSite: 'lax', maxAge: 2 * 60 * 60 * 1000 };

router.post('/registrieren', validiereRegistrierung, (req, res) => {
  const users = lese('users');
  if (users.some(u => u.email.toLowerCase() === req.validiert.email.toLowerCase())) {
    return res.status(400).json({ fehler: ['Diese E-Mail ist bereits registriert.'] });
  }
  const neu = { id: naechsteId(users), rolle: 'kunde', name: req.validiert.name, email: req.validiert.email, passwortHash: hashPassword(req.validiert.passwort), erstelltAm: new Date().toISOString().split('T')[0] };
  users.push(neu);
  schreibe('users', users);
  res.cookie('token', erzeugeToken(neu), COOKIE);
  res.status(201).json({ erfolg: true, user: { id: neu.id, name: neu.name, email: neu.email, rolle: neu.rolle } });
});

router.post('/login', validiereLogin, (req, res) => {
  const users = lese('users');
  const user = users.find(u => u.email.toLowerCase() === req.validiert.email.toLowerCase());
  if (!user || !verifyPassword(req.validiert.passwort, user.passwortHash)) {
    return res.status(401).json({ fehler: ['E-Mail oder Passwort falsch.'] });
  }
  res.cookie('token', erzeugeToken(user), COOKIE);
  res.json({ erfolg: true, user: { id: user.id, name: user.name, email: user.email, rolle: user.rolle } });
});

router.post('/logout', (req, res) => { res.clearCookie('token'); res.json({ erfolg: true }); });

router.get('/me', (req, res) => res.json({ user: req.user || null }));

module.exports = router;
