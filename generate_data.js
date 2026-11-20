// generate_data.js
// Erzeugt data/reisen.json mit echten Unsplash-Bildern pro Ziel.
// Unsplash Source API: https://source.unsplash.com/800x500/?suchbegriff
// Kostenlos, keine Registrierung nötig, benötigt Internetverbindung beim Laden.

const fs = require('fs');
const path = require('path');

// Unsplash-Bild pro Ziel (800x500, passender Suchbegriff)
const bildUrls = {
  // Städtereisen
  'Paris':            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop',
  'Rom':              'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=500&fit=crop',
  'Barcelona':        'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=500&fit=crop',
  'Lissabon':         'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=500&fit=crop',
  'Wien':             'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=500&fit=crop',
  'Prag':             'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=500&fit=crop',
  'Amsterdam':        'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=500&fit=crop',
  'London':           'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop',
  'Budapest':         'https://images.unsplash.com/photo-1549109926-58b8731cedf4?w=800&h=500&fit=crop',
  'New York':         'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&h=500&fit=crop',
  'Istanbul':         'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=500&fit=crop',
  'Kopenhagen':       'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=500&fit=crop',
  'Dubai':            'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop',
  'Singapur':         'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=500&fit=crop',
  'Tokio':            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop',

  // Strandreisen
  'Mallorca':         'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=800&h=500&fit=crop',
  'Kreta':            'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&h=500&fit=crop',
  'Sansibar':         'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&h=500&fit=crop',
  'Malediven':        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=500&fit=crop',
  'Phuket':           'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=500&fit=crop',
  'Bali':             'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop',
  'Punta Cana':       'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=500&fit=crop',
  'Algarve':          'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=500&fit=crop',
  'Fuerteventura':    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=500&fit=crop',
  'Antalya':          'https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?w=800&h=500&fit=crop',
  'Seychellen':       'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=500&fit=crop',
  'Cancún':           'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&h=500&fit=crop',
  'Korfu':            'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=800&h=500&fit=crop',
  'Sardinien':        'https://images.unsplash.com/photo-1589812307756-5f5dbc809f0e?w=800&h=500&fit=crop',

  // Abenteuerreisen
  'Patagonien':            'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop',
  'Kilimandscharo':        'https://images.unsplash.com/photo-1621414050946-1f5a40eaaf48?w=800&h=500&fit=crop',
  'Costa Rica Dschungel':  'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=800&h=500&fit=crop',
  'Annapurna Trek':        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
  'Island Vulkantour':     'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&h=500&fit=crop',
  'Westkanada Rocky Mountains': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
  'Borneo Regenwald':      'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=800&h=500&fit=crop',
  'Namibia Wüstensafari':  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=500&fit=crop',
  'Neuseeland Südinsel':   'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
  'Amazonas Dschungeltour':'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=500&fit=crop',
  'Yukon Wildnis':         'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop',
  'Atlasgebirge':          'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=500&fit=crop',

  // Kulturreisen
  'Kyoto Tempelreise':        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=500&fit=crop',
  'Athen Antike':             'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=500&fit=crop',
  'Kairo und die Pyramiden':  'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=500&fit=crop',
  'Petra Felsenstadt':        'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800&h=500&fit=crop',
  'Machu Picchu':             'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=500&fit=crop',
  'Marrakesch':               'https://images.unsplash.com/photo-1597211684565-dca64d72bdfe?w=800&h=500&fit=crop',
  'Angkor Wat':               'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=500&fit=crop',
  'Florenz Kunststädte':      'https://images.unsplash.com/photo-1541343672885-9be56236302a?w=800&h=500&fit=crop',
  'Sevilla Andalusien':       'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&h=500&fit=crop',
  'Varanasi Indien':          'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&h=500&fit=crop',
  'Samarkand Seidenstraße':   'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=500&fit=crop',
  'Jerusalem':                'https://images.unsplash.com/photo-1552423314-cf29ab68ad73?w=800&h=500&fit=crop',

  // Kreuzfahrten
  'Mittelmeer Kreuzfahrt':    'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&h=500&fit=crop',
  'Karibik Kreuzfahrt':       'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop',
  'Norwegen Fjorde':          'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&h=500&fit=crop',
  'Nordsee Kreuzfahrt':       'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=500&fit=crop',
  'Transatlantik Kreuzfahrt': 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&h=500&fit=crop',
  'Alaska Kreuzfahrt':        'https://images.unsplash.com/photo-1531176175280-3c44753ab63d?w=800&h=500&fit=crop',
  'Donau Flusskreuzfahrt':    'https://images.unsplash.com/photo-1549109926-58b8731cedf4?w=800&h=500&fit=crop',
  'Adria Kreuzfahrt':         'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=500&fit=crop',
  'Asien Kreuzfahrt':         'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=500&fit=crop',
  'Kanaren Kreuzfahrt':       'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=500&fit=crop',
};

// Fallback-Bild nach Themenwelt
const themenweltFallback = {
  Staedtereisen:   'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop',
  Strandreisen:    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
  Abenteuerreisen: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=500&fit=crop',
  Kulturreisen:    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=500&fit=crop',
  Kreuzfahrten:    'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&h=500&fit=crop',
};

const themenwelten = ['Staedtereisen', 'Strandreisen', 'Abenteuerreisen', 'Kulturreisen', 'Kreuzfahrten'];

const ziele = {
  Staedtereisen: [
    ['Paris','Frankreich'],['Rom','Italien'],['Barcelona','Spanien'],['Lissabon','Portugal'],
    ['Wien','Österreich'],['Prag','Tschechien'],['Amsterdam','Niederlande'],['London','Vereinigtes Königreich'],
    ['Budapest','Ungarn'],['New York','USA'],['Istanbul','Türkei'],['Kopenhagen','Dänemark'],
    ['Dubai','Vereinigte Arabische Emirate'],['Singapur','Singapur'],['Tokio','Japan']
  ],
  Strandreisen: [
    ['Mallorca','Spanien'],['Kreta','Griechenland'],['Sansibar','Tansania'],['Malediven','Malediven'],
    ['Phuket','Thailand'],['Bali','Indonesien'],['Punta Cana','Dominikanische Republik'],
    ['Algarve','Portugal'],['Fuerteventura','Spanien'],['Antalya','Türkei'],
    ['Seychellen','Seychellen'],['Cancún','Mexiko'],['Korfu','Griechenland'],['Sardinien','Italien']
  ],
  Abenteuerreisen: [
    ['Patagonien','Argentinien'],['Kilimandscharo','Tansania'],['Costa Rica Dschungel','Costa Rica'],
    ['Annapurna Trek','Nepal'],['Island Vulkantour','Island'],['Westkanada Rocky Mountains','Kanada'],
    ['Borneo Regenwald','Malaysia'],['Namibia Wüstensafari','Namibia'],['Neuseeland Südinsel','Neuseeland'],
    ['Amazonas Dschungeltour','Brasilien'],['Yukon Wildnis','Kanada'],['Atlasgebirge','Marokko']
  ],
  Kulturreisen: [
    ['Kyoto Tempelreise','Japan'],['Athen Antike','Griechenland'],['Kairo und die Pyramiden','Ägypten'],
    ['Petra Felsenstadt','Jordanien'],['Machu Picchu','Peru'],['Marrakesch','Marokko'],
    ['Angkor Wat','Kambodscha'],['Florenz Kunststädte','Italien'],['Sevilla Andalusien','Spanien'],
    ['Varanasi Indien','Indien'],['Samarkand Seidenstraße','Usbekistan'],['Jerusalem','Israel']
  ],
  Kreuzfahrten: [
    ['Mittelmeer Kreuzfahrt','Mittelmeer'],['Karibik Kreuzfahrt','Karibik'],['Norwegen Fjorde','Norwegen'],
    ['Nordsee Kreuzfahrt','Nordsee'],['Transatlantik Kreuzfahrt','Atlantik'],['Alaska Kreuzfahrt','Alaska'],
    ['Donau Flusskreuzfahrt','Mitteleuropa'],['Adria Kreuzfahrt','Adria'],['Asien Kreuzfahrt','Südostasien'],
    ['Kanaren Kreuzfahrt','Kanarische Inseln']
  ]
};

const flugOptionen = ['inklusive','optional','ohne Flug'];
const verpflegungOptionen = ['Frühstück','Halbpension','Vollpension','All Inclusive','ohne Verpflegung'];
const dauerOptionen = [3,4,5,7,8,10,12,14];

const beschreibungen = {
  Staedtereisen: [
    'Erleben Sie die Highlights von {ort} bei einem unvergesslichen Städtetrip.',
    'Entdecken Sie {ort} zu Fuß, mit dem Rad oder bei einer Stadtrundfahrt.',
    'Genießen Sie Kultur, Architektur und Kulinarik in {ort}.',
    'Ein perfekter Kurztrip für alle, die {ort} authentisch erleben möchten.'
  ],
  Strandreisen: [
    'Entspannen Sie an den schönsten Stränden von {ort} bei Sonne und Meer.',
    'Traumhafte Strände, kristallklares Wasser und pure Erholung in {ort}.',
    'Ihr Urlaub am Meer: {ort} bietet Sonne, Strand und Entspannung pur.',
    'Genießen Sie Ruhe und Erholung an der Küste von {ort}.'
  ],
  Abenteuerreisen: [
    'Erleben Sie {ort} hautnah – für alle, die Abenteuer und Natur lieben.',
    'Eine Reise für aktive Entdecker: {ort} wartet mit spektakulärer Landschaft.',
    'Wandern, Staunen, Entdecken – {ort} ist Abenteuer pur.',
    'Tauchen Sie ein in die Wildnis von {ort} und erleben Sie unvergessliche Momente.'
  ],
  Kulturreisen: [
    'Tauchen Sie ein in die reiche Geschichte und Kultur von {ort}.',
    'Entdecken Sie jahrtausendealte Traditionen und beeindruckende Bauwerke in {ort}.',
    'Eine Reise zu den kulturellen Schätzen von {ort}.',
    'Geschichte zum Anfassen: erleben Sie {ort} mit erfahrener Reiseleitung.'
  ],
  Kreuzfahrten: [
    'Genießen Sie Komfort und Entspannung bei einer Kreuzfahrt durch {ort}.',
    'Entdecken Sie mehrere Häfen bequem vom Schiff aus: {ort}.',
    'Ihre Reise übers Wasser: {ort} mit erstklassigem Service an Bord.',
    'Erleben Sie {ort} aus einer ganz neuen Perspektive – vom Kreuzfahrtschiff aus.'
  ]
};

function zufall(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function zufallZahl(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function erzeugeStartdaten(anzahl) {
  const termine = [];
  const heute = new Date(2026, 5, 20);
  for (let i = 0; i < anzahl; i++) {
    const d = new Date(heute);
    d.setDate(d.getDate() + zufallZahl(14, 365));
    termine.push(d.toISOString().split('T')[0]);
  }
  return termine.sort();
}

let reisen = [];
let id = 1;

themenwelten.forEach(thema => {
  ziele[thema].forEach(([ort, land]) => {
    const varianten = zufallZahl(2, 3);
    for (let v = 0; v < varianten; v++) {
      const dauer = zufall(dauerOptionen);
      const preis = thema === 'Kreuzfahrten' ? zufallZahl(799,2499)
        : thema === 'Abenteuerreisen' ? zufallZahl(999,2999)
        : thema === 'Strandreisen' ? zufallZahl(449,1799)
        : thema === 'Kulturreisen' ? zufallZahl(699,2199)
        : zufallZahl(299,1299);

      const maxPersonen = zufallZahl(2,8);
      const freiePlaetze = zufallZahl(0, maxPersonen);

      const inklusiv = ['Hin- und Rückreise','Unterkunft laut Beschreibung',
        thema === 'Kreuzfahrten' ? 'Vollverpflegung an Bord' : zufall(verpflegungOptionen),
        'Reiseleitung vor Ort'];
      if (thema === 'Abenteuerreisen' || thema === 'Kulturreisen') inklusiv.push('Ausflüge laut Programm');
      if (thema === 'Kreuzfahrten') inklusiv.push('Landausflüge optional buchbar');

      const extras = [
        {name:'Reiseversicherung',preis:39},
        {name:'Zusatzgepäck',preis:25},
        {name:'Privater Transfer',preis:49},
        {name:'Kinderbett',preis:0,beschreibung:'Kostenlos auf Anfrage'}
      ];
      if (thema === 'Strandreisen' || thema === 'Kreuzfahrten') extras.push({name:'Premium-Zimmer mit Meerblick',preis:119});
      if (thema === 'Abenteuerreisen') extras.push({name:'Ausrüstungsverleih',preis:59});

      // Echtes Unsplash-Bild pro Ziel
      const bild = bildUrls[ort] || themenweltFallback[thema];

      reisen.push({
        id: id++,
        titel: `${ort} ${dauer} Tage`,
        themenwelt: thema,
        ziel: ort,
        land: land,
        beschreibung: zufall(beschreibungen[thema]).replace(/{ort}/g, ort),
        preisProPerson: preis,
        waehrung: 'EUR',
        dauerTage: dauer,
        reiseart: thema,
        flug: zufall(flugOptionen),
        verpflegung: thema === 'Kreuzfahrten' ? 'Vollpension' : zufall(verpflegungOptionen),
        maxPersonen,
        freiePlaetze,
        startTermine: erzeugeStartdaten(zufallZahl(2,5)),
        inklusivleistungen: inklusiv,
        extras,
        bild,   // ← jetzt eine echte Unsplash-URL
        topAngebot: Math.random() < 0.15,
        erstelltAm: '2026-01-10',
        aktualisiertAm: '2026-06-15'
      });
    }
  });
});

const out = path.join(__dirname, 'data', 'reisen.json');
fs.writeFileSync(out, JSON.stringify(reisen, null, 2), 'utf-8');
console.log(`${reisen.length} Reisen mit Unsplash-Bildern gespeichert.`);
themenwelten.forEach(t => {
  console.log(`  ${t}: ${reisen.filter(r => r.themenwelt === t).length}`);
});
