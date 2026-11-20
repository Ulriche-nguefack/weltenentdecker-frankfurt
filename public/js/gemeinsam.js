// gemeinsam.js - wird auf jeder Seite eingebunden
const API = {
  async get(url) { const r = await fetch(url, {credentials:'include'}); return {ok:r.ok,status:r.status,data:await r.json()}; },
  async post(url,body) { const r = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(body)}); return {ok:r.ok,status:r.status,data:await r.json()}; },
  async put(url,body) { const r = await fetch(url,{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(body)}); return {ok:r.ok,status:r.status,data:await r.json()}; },
  async delete(url) { const r = await fetch(url,{method:'DELETE',credentials:'include'}); return {ok:r.ok,status:r.status,data:await r.json()}; }
};

function formatPreis(n) { return new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n); }
function formatDatum(d) { if(!d) return '–'; return new Date(d).toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'}); }
function themenweltLabel(k) { return {Staedtereisen:'Städtereisen',Strandreisen:'Strandreisen',Abenteuerreisen:'Abenteuerreisen',Kulturreisen:'Kulturreisen',Kreuzfahrten:'Kreuzfahrten'}[k]||k; }
function themenweltIcon(k) { return {Staedtereisen:'🏙️',Strandreisen:'🏖️',Abenteuerreisen:'🧭',Kulturreisen:'🏛️',Kreuzfahrten:'🚢'}[k]||'🌍'; }
function escapeHtml(t) { const d=document.createElement('div'); d.textContent=t==null?'':String(t); return d.innerHTML; }

// Farbverlauf passend zur Themenwelt (für Platzhalterbild)
function themenweltFarben(k) { return {Staedtereisen:['#4f46e5','#7c3aed'],Strandreisen:['#0ea5e9','#06b6d4'],Abenteuerreisen:['#ea580c','#dc2626'],Kulturreisen:['#b45309','#92400e'],Kreuzfahrten:['#0891b2','#155e75']}[k] || ['#475569','#1e293b']; }

// Erzeugt ein passendes Platzhalterbild (SVG als Data-URI), falls kein Foto vorhanden/ladbar ist
function platzhalterBild(name, themenwelt) {
  const [c1,c2] = themenweltFarben(themenwelt);
  const icon = themenweltIcon(themenwelt);
  const t = escapeHtml(name || 'Reiseziel');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>`+
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>`+
    `<stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs>`+
    `<rect width='800' height='500' fill='url(#g)'/>`+
    `<text x='400' y='250' font-size='140' text-anchor='middle' dominant-baseline='central'>${icon}</text>`+
    `<text x='400' y='360' font-size='40' fill='#ffffff' font-family='Arial,Helvetica,sans-serif' font-weight='700' text-anchor='middle'>${t}</text>`+
    `</svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// onerror-Handler: ersetzt ein defektes/fehlendes Foto durch das Platzhalterbild
function bildFehler(img) {
  img.onerror = null;
  img.src = platzhalterBild(img.dataset.name, img.dataset.themenwelt);
  img.style.display = '';
}

function reiseKarteHtml(r) {
  return `<a href="/reise-detail.html?id=${r.id}" class="reise-karte" style="text-decoration:none;color:inherit;">
    <div class="reise-bild">
      <img src="${escapeHtml(r.bild)}" alt="${escapeHtml(r.titel)}" loading="lazy" data-name="${escapeHtml(r.ziel)}" data-themenwelt="${escapeHtml(r.themenwelt)}" onerror="bildFehler(this)">
      <span class="tag">${themenweltLabel(r.themenwelt)}</span>
      ${r.topAngebot?'<span class="top-badge">Top-Angebot</span>':''}
    </div>
    <div class="reise-inhalt">
      <h3>${escapeHtml(r.titel)}</h3>
      <div class="reise-land">📍 ${escapeHtml(r.land)}</div>
      <div class="reise-meta">
        <span>${r.dauerTage} Tage</span>
        <span>${escapeHtml(r.verpflegung)}</span>
        <span>${r.freiePlaetze>0?r.freiePlaetze+' frei':'ausgebucht'}</span>
      </div>
      <div class="reise-footer">
        <div class="reise-preis"><span class="ab">ab Person</span><span class="wert">${formatPreis(r.preisProPerson)}</span></div>
        <span class="btn btn-outline btn-sm">Ansehen</span>
      </div>
    </div>
  </a>`;
}

async function baueKopfzeile(aktiv) {
  const nav = document.querySelector('.kopfzeile');
  if(!nav) return;

  // Logo und Favicon aus Admin-Einstellungen laden
  let logoName = 'Die Weltenentdecker';
  try {
    const {data} = await API.get('/api/admin/seiteninhalt');
    if(data.logoName) logoName = data.logoName;
    // Favicon dynamisch setzen
    if(data.faviconUrl) {
      let favicon = document.querySelector("link[rel~='icon']");
      if(!favicon) { favicon = document.createElement('link'); favicon.rel = 'icon'; document.head.appendChild(favicon); }
      favicon.href = data.faviconUrl;
    }
  } catch(e) {}

  const links = [
    {href:'/index.html',label:'Start'},
    {href:'/reisen.html',label:'Reisen'},
    {href:'/kontakt.html',label:'Kontakt'},
    {href:'/faq.html',label:'FAQ'}
  ];
  nav.innerHTML = `<div class="nav">
    <a href="/index.html" class="logo">${escapeHtml(logoName)} <span>Frankfurt</span></a>
    <button class="nav-burger" id="burger">☰</button>
    <ul class="nav-links" id="navLinks">
      ${links.map(l=>`<a href="${l.href}"${aktiv===l.href?' class="aktiv"':''}>${l.label}</a>`).join('')}
    </ul>
    <div class="nav-rechts" id="navRechts"></div>
  </div>`;
  document.getElementById('burger').addEventListener('click',()=>document.getElementById('navLinks').classList.toggle('offen'));
  // Login-Status
  try {
    const {data} = await API.get('/api/auth/me');
    const z = document.getElementById('navRechts');
    if(data.user) {
      if(data.user.rolle==='mitarbeiter') {
        z.innerHTML=`<a href="/mitarbeiter/dashboard.html" class="btn btn-outline btn-sm">Dashboard</a><button class="btn btn-primary btn-sm" id="logoutBtn">Abmelden</button>`;
      } else {
        z.innerHTML=`<a href="/meine-buchungen.html" class="btn btn-outline btn-sm">Meine Buchungen</a><button class="btn btn-primary btn-sm" id="logoutBtn">Abmelden</button>`;
      }
      document.getElementById('logoutBtn').addEventListener('click',async()=>{await API.post('/api/auth/logout',{}); window.location.href='/index.html';});
    } else {
      z.innerHTML=`<a href="/login.html" class="btn btn-outline btn-sm">Anmelden</a><a href="/registrieren.html" class="btn btn-primary btn-sm">Konto erstellen</a>`;
    }
  } catch(e) {}
}

function baueFooter() {
  const f = document.querySelector('.footer');
  if(!f) return;
  f.innerHTML=`<div class="container">
    <div class="footer-grid">
      <div>
        <div style="font-family:Georgia,serif;font-size:1.1rem;color:#fff;margin-bottom:8px;">Die Weltenentdecker Frankfurt</div>
        <p>Ihr Reisebüro in Frankfurt — persönlich beraten, jederzeit online buchbar.</p>
      </div>
      <div><h4>Reisewelten</h4><ul class="footer-links">
        <li><a href="/reisen.html?themenwelt=Staedtereisen">Städtereisen</a></li>
        <li><a href="/reisen.html?themenwelt=Strandreisen">Strandreisen</a></li>
        <li><a href="/reisen.html?themenwelt=Abenteuerreisen">Abenteuerreisen</a></li>
        <li><a href="/reisen.html?themenwelt=Kulturreisen">Kulturreisen</a></li>
        <li><a href="/reisen.html?themenwelt=Kreuzfahrten">Kreuzfahrten</a></li>
      </ul></div>
      <div><h4>Service</h4><ul class="footer-links">
        <li><a href="/kontakt.html">Kontakt</a></li>
        <li><a href="/faq.html">FAQ</a></li>
        <li><a href="/login.html">Kundenlogin</a></li>
        <li><a href="/mitarbeiter/login.html">Mitarbeiter</a></li>
      </ul></div>
      <div><h4>Rechtliches</h4><ul class="footer-links">
        <li><a href="/impressum.html">Impressum</a></li>
        <li><a href="/datenschutz.html">Datenschutz</a></li>
        <li><a href="/agb.html">AGB</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom"><span>© 2026 Die Weltenentdecker Frankfurt</span></div>
  </div>`;
}

document.addEventListener('DOMContentLoaded',()=>{ baueKopfzeile(window.location.pathname); baueFooter(); });
