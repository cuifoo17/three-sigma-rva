// Runs the book screen's cube choreography through the simulator.
// node --experimental-strip-types scripts/check-rubiks.mjs
import { choreograph, flatten, invert, landed, selfCheck, simulate, solved, wave } from "../src/lib/rubiks.ts";

const fmt = (m) => `${m.axis}${m.index}${m.turns > 0 ? "+" : ""}${m.turns * 90}`;
const ch = choreograph();
console.log("sample:", flatten(ch).map(fmt).join(" "));
console.log("cubies:", solved().length);

const r = selfCheck(2000);
console.log(`self-check: ${r.landed}/${r.runs} landed exactly on the wave, ${r.upright}/${r.runs} thank-you upright`);


// Controls: wrong ways to undo the scramble. Each should miss.
const controls = {
  "no relabel": (a) => invert(a),
  "rows flip direction": (a) => invert(a.map((m) => (m.axis === "row" ? { ...m, turns: -m.turns } : { ...m, index: 2 - m.index, turns: -m.turns }))),
  "columns keep direction": (a) => invert(a.map((m) => (m.axis === "col" ? { ...m, index: 2 - m.index } : m))),
};
for (const [name, undo] of Object.entries(controls)) {
  let misses = 0;
  for (let i = 0; i < 2000; i++) {
    const c = choreograph();
    if (!landed(simulate([...c.scramble, ...wave(), ...undo(c.scramble)]))) misses++;
  }
  console.log(`control (${name}): ${misses}/2000 miss`);
}
if (r.landed !== r.runs || r.upright !== r.runs) process.exit(1);
