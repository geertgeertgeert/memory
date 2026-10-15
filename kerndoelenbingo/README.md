# Kerndoelenbingo

1. **Trainerscherm lokaal:** open `index.html` in Chrome/Edge en kies *Trainer* (of voeg `#trainer` aan de adresbalk toe). Werkt zonder internet.
2. **Teamlink:** telefoons kunnen geen bestand op je laptop openen; zet `index.html` op een statische host (GitHub Pages, Netlify Drop, schoolsite) en deel `<adres>/index.html#team`. Het tandwiel toont de link.
3. Teams vullen teamnaam, bouw en negen boektitels in; daarna tikken ze boek → kerndoel. Na één keer laden werkt de teampagina ook offline.
4. **Showmodus:** elke 25 s een bal; *Pauze* stopt klok en aftelling. *BINGO-check* / *Volle kaart* openen het beoordelingspaneel.
5. **Reset trainer:** tandwiel → *Nieuw spel* → *Ja*. **Reset team:** knop *Nieuw spel* onder de kaart → *Ja*.
6. Ververst er iets per ongeluk? De stand staat in `localStorage` en komt terug.
7. **Kerndoelen vervangen:** vervang de array `KERNDOELEN` in `<script id="data">` (nu 5 placeholders!).
8. Tests: `node tests/logic.test.js` (uitvoer in `tests/output.txt`).
