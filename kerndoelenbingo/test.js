// Test de pure spellogica uit index.html. Draai: node test.js
const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const html = fs.readFileSync(__dirname + "/index.html", "utf8");
const code = html.split("// LOGIC-START")[1].split("// LOGIC-END")[0];
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code + "\nthis.api = { KERNDOELEN, DOMEINEN, STANDAARD_POOL, drawBall, slotFor, poolValid, kd };", ctx);
const L = ctx.api;
let n = 0;
function t(name, fn) { fn(); n++; console.log("ok  " + name); }

t("17 subdoelen Nederlands, kerndoel 1 niet", () => {
  assert.strictEqual(L.KERNDOELEN.length, 17);
  assert.ok(!L.KERNDOELEN.some(k => k.code.startsWith("1")));
});
t("rijvolgorde zoals op tafel: Communicatie, Literatuur, Taal", () => assert.strictEqual(L.DOMEINEN.join(","), "Communicatie,Literatuur,Taal"));
t("standaardpool: 3 per domein", () => assert.ok(L.poolValid(L.STANDAARD_POOL)));
t("pool met 4 + 2 is ongeldig", () => assert.ok(!L.poolValid(["2A","2B","2C","3A","8B","9A","6A","7A","7B"])));
t("drawBall trekt elke bal precies één keer", () => {
  let drawn = [];
  for (let i = 0; i < 9; i++) drawn = L.drawBall(L.STANDAARD_POOL, drawn, Math.random).drawn;
  assert.strictEqual(new Set(drawn).size, 9);
  assert.strictEqual(L.drawBall(L.STANDAARD_POOL, drawn, Math.random), null);
});
t("drawBall kiest alleen uit wat nog in de molen zit", () => {
  const r = L.drawBall(L.STANDAARD_POOL, L.STANDAARD_POOL.slice(0, 8), () => 0.99);
  assert.strictEqual(r.ball, L.STANDAARD_POOL[8]);
});
t("elke bal heeft een eigen plek in het 3×3-rekje", () => {
  const seen = new Set();
  L.STANDAARD_POOL.forEach(c => { const s = L.slotFor(L.STANDAARD_POOL, c); assert.ok(s.row >= 0 && s.row < 3 && s.col >= 0 && s.col < 3); seen.add(s.row + "-" + s.col); });
  assert.strictEqual(seen.size, 9);
});
t("rij in rekje = domein van de bal", () => {
  assert.strictEqual(L.slotFor(L.STANDAARD_POOL, "2A").row, 0);
  assert.strictEqual(L.slotFor(L.STANDAARD_POOL, "9A").row, 1);
  assert.strictEqual(L.slotFor(L.STANDAARD_POOL, "7B").row, 2);
});

console.log(`\n${n} tests geslaagd`);
