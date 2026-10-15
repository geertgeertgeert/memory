# Kerndoelenbingo

1. **Trainerscherm:** open `index.html` in Chrome of Edge (dubbelklik) en kies *Trainer*, of voeg `#trainer` toe aan het adres. Zet het scherm op de beamer.
2. **Teamlink:** zet `index.html` online, bijvoorbeeld via GitHub Pages of Netlify Drop, en deel het adres met `#team` erachter als QR-code. Teams kunnen het bestand ook via AirDrop of mail op hun telefoon openen.
3. **Offline:** na één keer laden werkt alles zonder wifi. Alleen het lettertype valt dan terug op het systeemfont.
4. **Pool:** standaard 9 ballen, drie kerndoelen per domein (Communicatie 2A 2B 3B, Taal 6A 7A 7B, Literatuur 8B 9A 9B). Wijzigen via *Instellingen*, alleen vóór de eerste trekking.
5. **Bron:** SLO, *Kerndoelen primair onderwijs* (juli 2026), leergebied Nederlands, letterlijk overgenomen. Kerndoel 1 (Overkoepelend) is een opdracht aan de school en zit er daarom niet in.
6. **Reset trainer:** *Instellingen → Nieuw spel*, en bevestig.
7. **Reset team:** knop *Nieuw spel* onder de kaart, en bevestig.
8. **Ververs je per ongeluk?** De stand staat in `localStorage` en blijft bewaard.
9. **Tests:** `node test.js` (uitvoer staat in `test-uitvoer.txt`).
10. **Toegankelijkheid:** volledig met het toetsenbord te bedienen, schermlezer-meldingen bij elke bal en bij bingo, contrast AA, `prefers-reduced-motion`, aanraakvlakken ≥ 48 px.
