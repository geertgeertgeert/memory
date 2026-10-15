// Test de pure spellogica uit index.html. Draai: node test.js
const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const html = fs.readFileSync(__dirname + "/index.html", "utf8");
const code = html.split("// LOGIC-START")[1].split("// LOGIC-END")[0];
const ctx = {};
vm.createContext(ctx);
vm.runInContext(code + "\nthis.api = { KERNDOELEN, DOMEINEN, OVERKOEPELEND, STANDAARD_POOL, drawBall, eligible, rackRows, rackFull, poolValid, kd, placeBall, rackGrid };", ctx);
const L = ctx.api;
let n = 0;
function t(name, fn) { fn(); n++; console.log("ok  " + name); }
function play(rnd) { let d = []; let r; while ((r = L.drawBall(L.STANDAARD_POOL, d, rnd))) d = r.drawn; return d; }

t("alle 19 doelen Nederlands zitten standaard in de molen", () => {
  assert.strictEqual(L.KERNDOELEN.length, 19);
  assert.strictEqual(L.STANDAARD_POOL.length, 19);
});
t("rijvolgorde zoals op tafel: Communicatie, Literatuur, Taal", () => assert.strictEqual(L.DOMEINEN.join(","), "Communicatie,Literatuur,Taal"));
t("1000 spellen: altijd precies 3 per tafeldomein in het rekje", () => {
  for (let g = 0; g < 1000; g++) {
    const d = play(Math.random);
    const rows = L.rackRows(d);
    L.DOMEINEN.forEach(dm => assert.strictEqual(rows[dm].length, 3));
    assert.ok(rows[L.OVERKOEPELEND].length <= 2);
    assert.strictEqual(new Set(d).size, d.length);
    assert.ok(L.rackFull(d));
  }
});
t("een volle rij doet niet meer mee", () => {
  const d = ["2A", "2B", "2C"];
  assert.ok(!L.eligible(L.STANDAARD_POOL, d).some(c => L.kd(c).domein === "Communicatie"));
  assert.ok(L.eligible(L.STANDAARD_POOL, d).includes("1A"));
});
t("rekje vol → molen stopt", () => {
  const d = ["2A", "2B", "2C", "8A", "8B", "9A", "6A", "6B", "7A"];
  assert.strictEqual(L.drawBall(L.STANDAARD_POOL, d, Math.random), null);
});
t("gespreksbal telt niet mee voor het rekje", () => {
  const rows = L.rackRows(["1A", "2A"]);
  assert.strictEqual(rows.Communicatie.length, 1);
  assert.strictEqual(rows.Overkoepelend.length, 1);
});
t("pool met maar 2 Literatuur-ballen is ongeldig", () => {
  assert.ok(!L.poolValid(L.STANDAARD_POOL.filter(c => c !== "8A" && c !== "8B")));
  assert.ok(L.poolValid(L.STANDAARD_POOL));
});

t("plek in de rij is willekeurig: elke positie komt voor", () => {
  const seen = new Set();
  for (let i = 0; i < 300; i++) seen.add(L.placeBall({}, [], "2A", 3, Math.random));
  assert.strictEqual([...seen].sort().join(","), "0,1,2");
});
t("een bezette plek wordt nooit opnieuw gekozen", () => {
  for (let i = 0; i < 300; i++) {
    const col = L.placeBall({ "2A": 0, "2B": 2 }, ["2A", "2B"], "3A", 3, Math.random);
    assert.strictEqual(col, 1);
  }
});
t("1000 spellen: rekje-raster zonder dubbele plekken", () => {
  for (let g = 0; g < 1000; g++) {
    let d = [], slots = {}, r;
    while ((r = L.drawBall(L.STANDAARD_POOL, d, Math.random))) {
      const dom = L.kd(r.ball).domein;
      slots[r.ball] = L.placeBall(slots, d, r.ball, dom === "Overkoepelend" ? 2 : 3, Math.random);
      assert.ok(slots[r.ball] >= 0);
      d = r.drawn;
    }
    const grid = L.rackGrid(d, slots, { Communicatie: 3, Literatuur: 3, Taal: 3, Overkoepelend: 2 });
    L.DOMEINEN.forEach(dm => assert.strictEqual(grid[dm].filter(Boolean).length, 3));
  }
});

console.log(`\n${n} tests geslaagd`);
