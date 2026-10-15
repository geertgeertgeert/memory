// Test de pure spellogica uit index.html. Draai: node tests/logic.test.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const src = html.match(/<script id="logic">([\s\S]*?)<\/script>/)[1];
const ctx = { module: { exports: {} } };
vm.runInNewContext(src, ctx);
const R = ctx.module.exports;
const plain = (v) => JSON.parse(JSON.stringify(v));
const L = Object.fromEntries(Object.entries(R).map(([k, f]) => [k, typeof f === "function" ? (...a) => plain(f(...a)) : f]));

let n = 0;
function test(name, fn) { fn(); n++; console.log("ok  " + name); }
const empty = () => new Array(9).fill(null);
function seq(vals) { let i = 0; return () => vals[i++ % vals.length]; }
function fill(idxs) { let m = empty(); idxs.forEach(i => { m = L.markSquare(m, i, "K" + i).marks; }); return m; }

test("rij: vakjes 3,4,5 geven één lijn", () => {
  const lines = L.findLines(fill([3, 4, 5]));
  assert.deepStrictEqual(lines.map(l => l.join("")), ["345"]);
});
test("kolom: vakjes 1,4,7", () => {
  assert.deepStrictEqual(L.findLines(fill([1, 4, 7])).map(l => l.join("")), ["147"]);
});
test("diagonaal: 0,4,8 en 2,4,6", () => {
  assert.deepStrictEqual(L.findLines(fill([0, 4, 8])).map(l => l.join("")), ["048"]);
  assert.deepStrictEqual(L.findLines(fill([2, 4, 6])).map(l => l.join("")), ["246"]);
});
test("geen lijn bij twee op een rij of een L-vorm", () => {
  assert.strictEqual(L.findLines(fill([0, 1])).length, 0);
  assert.strictEqual(L.findLines(fill([0, 1, 3, 5, 7])).length, 0);
});
test("kerndoel kan niet aan twee boeken hangen", () => {
  const m = L.markSquare(empty(), 0, "A").marks;
  const r = L.markSquare(m, 1, "A");
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.conflict, 0);
  assert.strictEqual(r.marks[1], null);
});
test("boek kan niet twee kerndoelen krijgen", () => {
  const m = L.markSquare(empty(), 0, "A").marks;
  const r = L.markSquare(m, 0, "B");
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.marks[0], "A");
});
test("terugdraaien maakt boek en kerndoel weer vrij", () => {
  let m = L.markSquare(empty(), 0, "A").marks;
  m = L.unmarkSquare(m, 0);
  assert.strictEqual(L.markSquare(m, 1, "A").ok, true);
  assert.strictEqual(L.markSquare(m, 0, "B").ok, true);
});
test("markSquare muteert de invoer niet", () => {
  const m = empty(); L.markSquare(m, 4, "A");
  assert.strictEqual(m[4], null);
});
test("volle kaart: 9 vakjes, 8 lijnen", () => {
  const m = fill([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  assert.strictEqual(L.isFullCard(m), true);
  assert.strictEqual(L.findLines(m).length, 8);
  assert.strictEqual(L.isFullCard(fill([0, 1, 2, 3, 4, 5, 6, 7])), false);
});
test("drawBall trekt nooit dubbel en stopt bij lege pool", () => {
  let s = { pool: ["a", "b", "c"], drawn: [], current: null };
  const seen = [];
  for (let i = 0; i < 3; i++) { const r = L.drawBall(s, Math.random); seen.push(r.ball); s = r.state; }
  assert.deepStrictEqual(seen.slice().sort(), ["a", "b", "c"]);
  const last = L.drawBall(s);
  assert.strictEqual(last.ball, null);
  assert.strictEqual(last.state.drawn.length, 3);
});
test("buildPool: juiste grootte, ~helft Nederlands, alleen gekozen domeinen", () => {
  const all = [];
  for (let i = 0; i < 30; i++) all.push({ code: "N" + i, domein: "Nederlands – lezen" });
  for (let i = 0; i < 30; i++) all.push({ code: "W" + i, domein: i % 2 ? "Natuur & techniek" : "Burgerschap" });
  const pool = L.buildPool(all, ["Nederlands – lezen", "Natuur & techniek", "Burgerschap"], 24, Math.random);
  assert.strictEqual(pool.length, 24);
  assert.strictEqual(new Set(pool).size, 24);
  assert.strictEqual(pool.filter(c => c[0] === "N").length, 12);
  const noBurg = L.buildPool(all, ["Nederlands – lezen", "Natuur & techniek"], 24, Math.random);
  assert.ok(noBurg.every(c => all.find(k => k.code === c).domein !== "Burgerschap"));
});
test("buildPool: te weinig kerndoelen geeft kleinere pool, geen fout", () => {
  const all = [{ code: "A", domein: "Burgerschap" }, { code: "B", domein: "Nederlands – lezen" }];
  assert.strictEqual(L.buildPool(all, ["Burgerschap", "Nederlands – lezen"], 24).length, 2);
});

console.log(`\n${n} tests geslaagd`);
