const { pruefeToken } = require('../utils/jwt');

function nutzerErmitteln(req, res, next) {
  const token = req.cookies && req.cookies.token;
  req.user = null;
  if (token) { const p = pruefeToken(token); if (p) req.user = p; }
  next();
}

function mitarbeiterErforderlich(req, res, next) {
  if (!req.user || req.user.rolle !== 'mitarbeiter') {
    if (req.originalUrl.startsWith('/api/')) return res.status(401).json({ fehler: 'Login als Mitarbeitender erforderlich.' });
    return res.redirect('/mitarbeiter/login.html');
  }
  next();
}

function loginErforderlich(req, res, next) {
  if (!req.user) {
    if (req.originalUrl.startsWith('/api/')) return res.status(401).json({ fehler: 'Login erforderlich.' });
    return res.redirect('/login.html');
  }
  next();
}

module.exports = { nutzerErmitteln, mitarbeiterErforderlich, loginErforderlich };
