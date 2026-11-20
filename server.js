require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { nutzerErmitteln } = require('./middleware/auth');
const reisenRoutes = require('./routes/reisen');
const buchungenRoutes = require('./routes/buchungen');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(nutzerErmitteln);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/reisen', reisenRoutes);
app.use('/api/buchungen', buchungenRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', projekt: 'Die Weltenentdecker Frankfurt', eingeloggt: req.user || null });
});

app.use('/api', (req, res) => res.status(404).json({ fehler: 'Route nicht gefunden.' }));
app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

app.listen(PORT, () => {
  console.log('========================================');
  console.log('  Die Weltenentdecker Frankfurt');
  console.log(`  http://localhost:${PORT}`);
  console.log('========================================');
});
