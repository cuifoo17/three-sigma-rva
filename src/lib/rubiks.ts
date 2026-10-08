// The cube behind the book screen's thank-you twist: a plain 3 x 3 x 3 cube,
// the form on the front, the thank-you on the back. Pure data, no three.js: the renderer places every cubie
// straight from this state after each move, so the animation can only land
// where the maths lands.
//
// Coordinates are three.js's (x right, y up, z toward the viewer), doubled
// and centred so every cubie sits on whole numbers: x, y and z in -2..2.
// Rotations are exact integer matrices; nothing drifts.

export const COLS = 3;
export const ROWS = 3;
export const DEPTH = 3;

export type Vec = [number, number, number];
export type Mat = number[]; // 3 x 3, row-major
// home: where the cubie started, as [column, row, layer] (row 0 = top,
// layer 0 = back). p/m: where it is now and how it's turned.
export type Cubie = { home: Vec; p: Vec; m: Mat };
export type Cube = Cubie[];

// Rows turn about Y, columns about X, a quarter or a half. turns: quarter
// turns, signed like a three.js rotation (counterclockwise looking down the
// axis toward the origin).
export type Move = { axis: "row" | "col"; index: number; turns: 1 | -1 | 2 | -2 };

const I: Mat = [1, 0, 0, 0, 1, 0, 0, 0, 1];

const mul = (a: Mat, b: Mat): Mat =>
  Array.from({ length: 9 }, (_, i) => {
    const r = Math.floor(i / 3);
    const c = i % 3;
    return a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
  });

const apply3 = (m: Mat, v: Vec): Vec => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];

const COS = [1, 0, -1, 0];
const SIN = [0, 1, 0, -1];

export function rotation(move: Move): Mat {
  const q = ((move.turns % 4) + 4) % 4;
  const c = COS[q];
  const s = SIN[q];
  return move.axis === "row"
    ? [c, 0, s, 0, 1, 0, -s, 0, c]
    : [1, 0, 0, 0, c, -s, 0, s, c];
}

export const rowY = (r: number) => ROWS - 1 - 2 * r;
export const colX = (c: number) => 2 * c - (COLS - 1);

export const inLayer = (cubie: Cubie, move: Move) =>
  move.axis === "row" ? cubie.p[1] === rowY(move.index) : cubie.p[0] === colX(move.index);

// Only the outer shell: the one cubie hidden in the middle never shows.
export function solved(): Cube {
  const cube: Cube = [];
  for (let k = 0; k < DEPTH; k++)
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const outer =
          c === 0 || c === COLS - 1 || r === 0 || r === ROWS - 1 || k === 0 || k === DEPTH - 1;
        if (outer) cube.push({ home: [c, r, k], p: [colX(c), rowY(r), 2 * k - (DEPTH - 1)], m: I });
      }
  return cube;
}

export function apply(cube: Cube, move: Move): Cube {
  const R = rotation(move);
  return cube.map((q) => (inLayer(q, move) ? { home: q.home, p: apply3(R, q.p), m: mul(R, q.m) } : q));
}

export const simulate = (moves: Move[], from: Cube = solved()): Cube => moves.reduce(apply, from);

// W: every row half-turns, i.e. the whole cuboid spins 180 about Y. The back
// (thank-you) comes round to the front, upright and unmirrored.
export const wave = (dir: 1 | -1 = 1): Move[] =>
  Array.from({ length: ROWS }, (_, r) => ({ axis: "row" as const, index: r, turns: (2 * dir) as 2 | -2 }));

// A move as it looks after that whole-cube spin: a row turns about the same
// axis, so it keeps its index and direction; a column lands at 2 - c and
// turns the other way (the x axis now points the other way). The
// simulator, not this comment, is the proof: see the check script's controls.
export const relabel = (m: Move): Move =>
  m.axis === "col" ? { ...m, index: COLS - 1 - m.index, turns: -m.turns as Move["turns"] } : m;

export const invert = (moves: Move[]): Move[] =>
  moves
    .slice()
    .reverse()
    .map((m) => ({ ...m, turns: -m.turns }) as Move);

// The scramble: row, column, row, quarter turns, the two rows different.
// Quarters only here (the wave is all half turns) so the whole run holds ~5s. Played as scramble, wave, then the relabelled scramble
// undone; since W A = A' W, A'^-1 W A = W, so it always lands on the wave.
export type Choreography = { scramble: Move[]; wave: Move[]; unscramble: Move[] };

export function choreograph(rand: () => number = Math.random): Choreography {
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
  const rows = [0, 1, 2];
  const first = pick(rows);
  const a: Move[] = [
    { axis: "row", index: first, turns: pick([1, -1] as const) },
    { axis: "col", index: pick([0, 1, 2]), turns: pick([1, -1] as const) },
    { axis: "row", index: pick(rows.filter((r) => r !== first)), turns: pick([1, -1] as const) },
  ];
  return { scramble: a, wave: wave(pick([1, -1] as const)), unscramble: invert(a.map(relabel)) };
}

export const flatten = (ch: Choreography): Move[] => [...ch.scramble, ...ch.wave, ...ch.unscramble];

const same = (a: Cube, b: Cube) => JSON.stringify(a) === JSON.stringify(b);

// Landed = exactly the wave's state, every cubie.
export const landed = (cube: Cube) => same(cube, simulate(wave()));

// The wave itself reads right: every back cubie is now on the front, at the
// mirrored column, same row, turned exactly 180 about Y (what the renderer's
// back stickers are built for).
export function thanksUpright(cube: Cube): boolean {
  const y2 = rotation({ axis: "row", index: 0, turns: 2 });
  return cube
    .filter((q) => q.home[2] === 0)
    .every(
      (q) =>
        q.p[2] === DEPTH - 1 &&
        q.p[0] === colX(COLS - 1 - q.home[0]) &&
        q.p[1] === rowY(q.home[1]) &&
        same([{ home: q.home, p: q.p, m: q.m }], [{ home: q.home, p: q.p, m: y2 }]),
    );
}

export function selfCheck(n = 200, rand: () => number = Math.random) {
  let ok = 0;
  let upright = 0;
  for (let i = 0; i < n; i++) {
    const end = simulate(flatten(choreograph(rand)));
    if (landed(end)) ok++;
    if (thanksUpright(end)) upright++;
  }
  return { runs: n, landed: ok, upright };
}

if (process.env.NODE_ENV === "development") {
  const r = selfCheck(50);
  if (r.landed !== r.runs) console.error("rubiks: choreography misses the landing", r);
}
