// Test de pure spellogica uit index.html. Draai: node test.js
const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const html = fs.readFileSync(__dirname + "/index.html", "utf8");
const code = html.split("// LOGIC-START")[1].split("// LOGIC-END")[0];
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code + "\nthis.api = { KERNDOELEN, DOMEINEN, STANDAARD_POOL, drawBall, emptyCard, markSquare, unmarkSquare, findLines, isFullCard, domainsInLine };", ctx);
const L = ctx.api;
const R = "Een kind leert hiermee hoe een verhaal is opgebouwd.";
let n = 0;
function t(name, fn) { fn(); n++; console.log("ok  " + name); }

t("standaardpool: 3 per domein, alleen Nederlands", () => {
  L.DOMEINEN.forEach(d => assert.strictEqual(L.STANDAARD_POOL.filter(c => L.KERNDOELEN.find(k => k.code === c).domein === d).length, 3));
  assert.strictEqual(L.STANDAARD_POOL.length, 9);
});

t("drawBall trekt elke bal precies één keer", () => {
  let drawn = [];
  for (let i = 0; i < 9; i++) drawn = L.drawBall(L.STANDAARD_POOL, drawn, Math.random).drawn;
  assert.strictEqual(new Set(drawn).size, 9);
  assert.strictEqual(L.drawBall(L.STANDAARD_POOL, drawn, Math.random), null);
});

function fill(idx) {
  let card = L.emptyCard();
  idx.forEach((i, j) => { const r = L.markSquare(card, i, L.STANDAARD_POOL[j], R); assert.ok(r.ok, r.error); card = r.card; });
  return card;
}

t("rij", () => assert.strictEqual(JSON.stringify(L.findLines(fill([3, 4, 5]))), JSON.stringify([[3, 4, 5]])));
t("kolom", () => assert.strictEqual(JSON.stringify(L.findLines(fill([1, 4, 7]))), JSON.stringify([[1, 4, 7]])));
t("diagonaal", () => assert.strictEqual(JSON.stringify(L.findLines(fill([2, 4, 6]))), JSON.stringify([[2, 4, 6]])));
t("geen lijn bij twee vakjes", () => assert.strictEqual(L.findLines(fill([0, 1])).length, 0));

t("kerndoel niet dubbel", () => {
  const c = fill([0]);
  const r = L.markSquare(c, 1, L.STANDAARD_POOL[0], R);
  assert.strictEqual(r.ok, false);
});
t("boek niet dubbel", () => {
  const c = fill([0]);
  assert.strictEqual(L.markSquare(c, 0, L.STANDAARD_POOL[1], R).ok, false);
});
t("onderbouwing verplicht", () => {
  assert.strictEqual(L.markSquare(L.emptyCard(), 0, "2A", "Een kind leert hiermee ").ok, false);
  assert.strictEqual(L.markSquare(L.emptyCard(), 0, "2A", "").ok, false);
});
t("terugdraaien maakt vakje vrij", () => {
  const c = L.unmarkSquare(fill([0, 1, 2]), 1);
  assert.strictEqual(L.findLines(c).length, 0);
});
t("volle kaart", () => {
  const c = fill([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.ok(L.isFullCard(c));
  assert.strictEqual(L.findLines(c).length, 8);
  assert.ok(!L.isFullCard(L.unmarkSquare(c, 4)));
});
t("samenhang: domeinen in een lijn", () => {
  let c = L.emptyCard();
  ["2A", "6A", "9A"].forEach((code, i) => { c = L.markSquare(c, i, code, R).card; });
  assert.strictEqual(L.domainsInLine(c, [0, 1, 2]).length, 3);
});

console.log(`\n${n} tests geslaagd`);
