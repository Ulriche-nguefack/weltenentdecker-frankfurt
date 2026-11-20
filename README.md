#  Die Weltenentdecker Frankfurt – Reisebüro-Webanwendung

Eine Fullstack-Webanwendung für ein Reisebüro in Frankfurt am Main[cite: 3, 4]. Nutzer können verschiedene Reisekategorien durchsuchen, Verfügbarkeiten prüfen, Reisen buchen sowie sich als Kunde oder Mitarbeiter anmelden[cite: 4, 6].

---

## Funktionen

* **Reisekatalog & Kategorien:** Übersicht und Detailansichten für Städtereisen, Strandreisen, Abenteuerreisen, Kulturreisen und Kreuzfahrten[cite: 2, 4, 6].
* **Buchungssystem:** Anzeige freier Plätze, Online-Buchung und Verwaltung eigener Buchungen im Kundenbereich[cite: 4, 6].
* **Authentifizierung & Rollenverwaltung:** Registrierung und Login mit Passwort-Hashing und JWT-Authentifizierung[cite: 6].
* **Mitarbeiter-Dashboard:** Geschützter Admin-/Mitarbeiterbereich zur Verwaltung von Reisen und Buchungen[cite: 4, 6].
* **Datengenerator:** Integriertes Skript (`generate_data.js`) zur automatischen Generierung von Beispieldaten[cite: 1, 2].

---

## Tech-Stack

* **Backend:** Node.js, Express.js[cite: 1, 3]
* **Frontend:** HTML5, CSS3, Vanilla JavaScript[cite: 1, 6]
* **Authentifizierung & Datenhaltung:** JSON Web Tokens (JWT), JSON-basierter Datenspeicher[cite: 6]

---

## Projektstruktur

```text
weltenentdecker/
├── data/               # JSON-Datenspeicher[cite: 1, 6]
├── middleware/         # Authentifizierungs- & Rollen-Middleware[cite: 1]
├── public/             # Frontend (HTML, CSS, clientseitiges JS, Mitarbeiter-Dashboard)[cite: 1, 6]
├── routes/             # REST-API-Endpunkte (admin, auth, buchungen, reisen)[cite: 1, 6]
├── utils/              # Hilfsfunktionen (JWT, Passwort-Hashing, jsonStore)[cite: 1, 6]
├── generate_data.js    # Skript zum Erzeugen von Beispiel-Reisedaten[cite: 1, 2]
├── server.js           # Einstiegspunkt & Express-Server[cite: 1, 3]
└── package.json        # Projektabhängigkeiten & Skripte[cite: 1]
