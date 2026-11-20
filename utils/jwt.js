require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_ABLAUF = process.env.JWT_ABLAUF || '2h';

function erzeugeToken(user) {
  return jwt.sign({ id: user.id, rolle: user.rolle, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: JWT_ABLAUF });
}

function pruefeToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

module.exports = { erzeugeToken, pruefeToken };
