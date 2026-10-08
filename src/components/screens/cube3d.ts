import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Euler,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  COLS,
  ROWS,
  apply,
  flatten,
  inLayer,
  landed,
  solved,
  type Choreography,
  type Move,
} from "@/lib/rubiks";

// The book screen's cube, in three.js. Loaded only once the form is sent.
// A plain 3 x 3 x 3 cube on the page: the front face is yellow with the form
// in the middle, the back sky with the thank-you, the sides the site palette.
//
// The handoff is the cube's own front face. At the start the cube is scaled
// up until the form on its face covers the section pixel for pixel (the
// yellow beyond it falls off the canvas), so taking over from the page is
// invisible; it then shrinks and tilts into a cube on the page. The return
// runs the same thing backwards on the thank-you face.
//
// One clock drives everything. Cubies are placed straight from the cube
// model (src/lib/rubiks.ts) every frame, plus the turn in progress, so the
// picture can't drift from the maths.

const RECEDE = 700; // page -> cube, and cube -> page at the end
const QUARTER = 450;
const HALF = 600;
const GAP = 80; // between turns
const STAGGER = 80; // between rows of the wave
const OVERLAP = 200; // first turn starts before the recede settles, last one before the return
const TILT_X = (18 * Math.PI) / 180; // top toward the viewer
const TILT_Y = (-28 * Math.PI) / 180; // right side toward the viewer

// Site palette: yellow face under the form, sky under the thank-you, cream
// top and bottom, sky left, navy right. The body is near-black navy so the
// grooves still show round the navy stickers.
const YELLOW = "#ffc845";
const BODY = "#050c18";
const NAVY = "#0b1f3a";
const SKY = "#8ecae6";
const CREAM = "#f7f5f0";

export function webglAvailable() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
// The turn overshoots a hair and settles, like plastic clicking into place.
const easeTurn = (t: number) =>
  easeInOut(t) + (t > 0.75 ? 0.025 * Math.sin(Math.PI * ((t - 0.75) / 0.25)) : 0);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Timed = { move: Move; start: number; end: number };

function timeline(ch: Choreography) {
  const timed: Timed[] = [];
  let t = RECEDE - OVERLAP;
  const one = (move: Move, start: number) => {
    const end = start + (Math.abs(move.turns) === 2 ? HALF : QUARTER);
    timed.push({ move, start, end });
    return end;
  };
  for (const m of ch.scramble) t = one(m, t) + GAP;
  const waveStart = t;
  ch.wave.forEach((m, i) => (t = Math.max(t, one(m, waveStart + i * STAGGER))));
  const waveEnd = t;
  t += GAP;
  ch.unscramble.forEach((m, i) => (t = one(m, t) + (i < ch.unscramble.length - 1 ? GAP : 0)));
  const outStart = t - OVERLAP;
  return { timed, waveStart, waveEnd, outStart, total: outStart + RECEDE };
}

// Stickers: plain quads with a shader mask. Grooves closed (0), each sticker
// covers its whole slot plus a sliver of bleed, so the face reads as one
// seamless picture; open (1), it shrinks to a rounded tile with the body
// showing round it. Face UVs are planar, so overlapping bleed shows the same
// pixels. Unlit, with a fixed shade by facing, so a front-facing sticker is
// exactly its texture. Tops never brighten (cream would blow out to white);
// sides and undersides dim.
function stickerMaterial(
  opts: { map?: CanvasTexture; color?: string },
  shared: { groove: { value: number }; half: number; inset: number; radius: number },
) {
  const mat = new MeshBasicMaterial(opts.map ? { map: opts.map } : { color: new Color(opts.color) });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uGroove = shared.groove;
    shader.uniforms.uHalf = { value: new Vector2(shared.half, shared.half) };
    shader.uniforms.uInset = { value: shared.inset };
    shader.uniforms.uRadius = { value: shared.radius };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute vec2 aLocal;\nvarying vec2 vLocal;\nvarying vec3 vNormalW;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvLocal = aLocal;\nvNormalW = normalize(mat3(modelMatrix) * normal);",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uGroove;
uniform vec2 uHalf;
uniform float uInset;
uniform float uRadius;
varying vec2 vLocal;
varying vec3 vNormalW;`,
      )
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
vec2 halfSize = uHalf + 0.5 * (1.0 - uGroove) - uInset * uGroove;
float rad = uRadius * uGroove;
vec2 q = abs(vLocal) - (halfSize - rad);
if (length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - rad > 0.0) discard;`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
vec3 n = normalize(vNormalW);
diffuseColor.rgb *= 1.0 - 0.04 * max(-n.y, 0.0) - (n.x > 0.0 ? 0.2 : 0.1) * abs(n.x) - 0.3 * max(-n.z, 0.0);`,
      );
  };
  return mat;
}

export type CubeRun = { ready: Promise<void>; done: Promise<void>; dispose: () => void };

export function playCube(opts: {
  canvas: HTMLCanvasElement;
  backdrop: HTMLElement; // the sky layer behind the cube; fades in with the wave
  width: number;
  height: number;
  // The slice of the section actually on screen (below the sticky header,
  // above the fold), in section pixels. The cube centres and fits in it; the
  // section is often taller than the phone.
  focus: { top: number; bottom: number };
  form: HTMLImageElement;
  thanks: HTMLImageElement;
  choreography: Choreography;
}): CubeRun {
  const { canvas, width: W, height: H } = opts;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0);

  // Camera: the plane z = 0 fills the canvas exactly, one unit per CSS pixel.
  const fov = 32;
  const tanHalf = Math.tan(((fov / 2) * Math.PI) / 180);
  const dist = H / 2 / tanHalf;
  const camera = new PerspectiveCamera(fov, W / H, dist * 0.1, dist + 6 * Math.max(W, H));
  camera.position.set(0, 0, dist);

  const scene = new Scene();
  scene.add(new AmbientLight(0xffffff, 1.4));
  const key = new DirectionalLight(0xffffff, 2.6);
  key.position.set(-1, 1.4, 1.6);
  const fill = new DirectionalLight(0xffffff, 0.6);
  fill.position.set(1.2, -0.6, 0.8);
  scene.add(key, fill);

  // Where the cube sits once it's a cube: centred in the on-screen slice,
  // front face on z = 0 before the tilt, and as big as fits with the tilt
  // plus any layer's swing (the whole cube swept a half turn about Y and X
  // bounds anything one row or column can do).
  const focusMid = 1 - (opts.focus.top + opts.focus.bottom) / H; // NDC
  const focusHalf = (opts.focus.bottom - opts.focus.top) / H; // NDC
  const restY = focusMid * (H / 2);
  const tilt = new Matrix4().makeRotationFromEuler(new Euler(TILT_X, TILT_Y, 0));
  const sweeps: Matrix4[] = [];
  for (let a = 0; a <= 180; a += 10) {
    const r = (a * Math.PI) / 180;
    sweeps.push(tilt.clone().multiply(new Matrix4().makeRotationY(r)));
    sweeps.push(tilt.clone().multiply(new Matrix4().makeRotationX(r)));
  }
  const fits = (e: number) =>
    sweeps.every((m) =>
      [-1, 1].every((x) =>
        [-1, 1].every((y) =>
          [-1, 1].every((z) => {
            const v = new Vector3((x * e) / 2, (y * e) / 2, (z * e) / 2).applyMatrix4(m);
            const depth = dist - (v.z - e / 2);
            return (
              Math.abs(v.x / depth / tanHalf / (W / H)) <= 0.94 &&
              Math.abs((v.y + restY) / depth / tanHalf - focusMid) <= 0.94 * focusHalf
            );
          }),
        ),
      ),
    );
  let E = 1;
  {
    let lo = 1;
    let hi = Math.min(0.78 * W, 0.62 * (opts.focus.bottom - opts.focus.top));
    if (fits(hi)) lo = hi;
    else
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        if (fits(mid)) lo = mid;
        else hi = mid;
      }
    E = lo;
  }
  const s = E / 3; // one cubie
  const proud = s * 0.01;

  // A face picture: the capture contain-fitted on a square of its own colour,
  // one texel per device pixel of the capture, at whole-texel offsets so the
  // starting frame lands on the page exactly.
  const dpr = opts.form.naturalWidth / W;
  const F = Math.ceil(Math.max(opts.form.naturalWidth, opts.form.naturalHeight));
  const faceTexture = (img: HTMLImageElement, color: string) => {
    const c = document.createElement("canvas");
    c.width = c.height = F;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, F, F);
    ctx.drawImage(img, Math.floor((F - img.naturalWidth) / 2), Math.floor((F - img.naturalHeight) / 2));
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  };
  const formTex = faceTexture(opts.form, YELLOW);
  const thanksTex = faceTexture(opts.thanks, SKY);
  // Blown-up scale and offset at which the picture on the face covers the
  // section exactly: face = F texels = F / dpr CSS px.
  const big = F / dpr / E;
  const ox = Math.floor((F - opts.form.naturalWidth) / 2);
  const oy = Math.floor((F - opts.form.naturalHeight) / 2);
  // Centre of the picture on the face, in face units (y up), at scale 1.
  const picX = ((ox + opts.form.naturalWidth / 2) / F - 0.5) * E;
  const picY = (0.5 - (oy + opts.form.naturalHeight / 2) / F) * E;

  const groove = { value: 0 };
  const shared = { groove, half: s / 2, inset: s * 0.07, radius: s * 0.12 };
  const mats = {
    form: stickerMaterial({ map: formTex }, shared),
    thanks: stickerMaterial({ map: thanksTex }, shared),
    left: stickerMaterial({ color: SKY }, shared),
    right: stickerMaterial({ color: NAVY }, shared),
    cap: stickerMaterial({ color: CREAM }, shared),
  };
  const body = new MeshStandardMaterial({ color: BODY, roughness: 0.6, metalness: 0 });
  const bodyGeo = new RoundedBoxGeometry(s, s, s, 3, s * 0.07);

  // A sticker quad: one slot plus a sliver of bleed, local coords kept for
  // the mask, then turned to face outward and lifted just proud of the body.
  const geometries: BufferGeometry[] = [bodyGeo];
  const quad = (place: (g: BufferGeometry) => void, uvAt?: (x: number, y: number) => [number, number]) => {
    const g = new PlaneGeometry(s + 1, s + 1);
    const pos = g.attributes.position;
    const local = new Float32Array(pos.count * 2);
    const uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      local[i * 2] = pos.getX(i);
      local[i * 2 + 1] = pos.getY(i);
      if (uvAt) uv.setXY(i, ...uvAt(pos.getX(i), pos.getY(i)));
    }
    g.setAttribute("aLocal", new BufferAttribute(local, 2));
    place(g);
    geometries.push(g);
    return g;
  };
  const out = s / 2 + proud;
  const side = {
    right: quad((g) => g.rotateY(Math.PI / 2).translate(out, 0, 0)),
    left: quad((g) => g.rotateY(-Math.PI / 2).translate(-out, 0, 0)),
    top: quad((g) => g.rotateX(-Math.PI / 2).translate(0, out, 0)),
    bottom: quad((g) => g.rotateX(Math.PI / 2).translate(0, -out, 0)),
  };
  // Slot (c, r) of a face picture, as UVs (textures load bottom-up).
  const slot = (c: number, r: number) => (x: number, y: number): [number, number] => [
    (c * s + s / 2 + x) / E,
    1 - (r * s + s / 2 - y) / E,
  ];

  const cube = new Group();
  scene.add(cube);
  let state = solved();
  const cubies = state.map(({ home: [c, r, k] }) => {
    const mesh = new Mesh(bodyGeo, body);
    mesh.matrixAutoUpdate = false;
    const add = (g: BufferGeometry, m: Material) => mesh.add(new Mesh(g, m));
    if (k === 2) add(quad((g) => g.translate(0, 0, out), slot(c, r)), mats.form);
    // The back faces away, so its picture is the mirrored column: after the
    // wave's half turn it reads upright at the front.
    if (k === 0)
      add(quad((g) => g.rotateY(Math.PI).translate(0, 0, -out), slot(COLS - 1 - c, r)), mats.thanks);
    if (c === COLS - 1) add(side.right, mats.right);
    if (c === 0) add(side.left, mats.left);
    if (r === 0) add(side.top, mats.cap);
    if (r === ROWS - 1) add(side.bottom, mats.cap);
    cube.add(mesh);
    return mesh;
  });

  const plan = timeline(opts.choreography);
  const done = new Set<number>();
  const base = new Matrix4();
  const turn = new Matrix4();

  function frame(e: number) {
    // k: 0 = blown up flat over the page, 1 = a tilted cube on the page.
    const k = easeInOut(clamp01(e / RECEDE)) - easeInOut(clamp01((e - plan.outStart) / RECEDE));
    const scale = lerp(big, 1, k);
    cube.scale.setScalar(scale);
    cube.rotation.set(TILT_X * k, TILT_Y * k, 0);
    // Front stickers stay on z = 0 until the tilt takes them off it.
    cube.position.set(lerp(-picX * big, 0, k), lerp(-picY * big, restY, k), -(E / 2 + proud) * scale);
    groove.value = k;
    opts.backdrop.style.opacity = String(
      easeInOut(clamp01((e - plan.waveStart) / (plan.waveEnd - plan.waveStart))),
    );

    // Commit finished turns to the model, in order (wave rows are disjoint
    // and commute, so their overlap is safe).
    plan.timed.forEach((t, i) => {
      if (!done.has(i) && t.end <= e) {
        state = apply(state, t.move);
        done.add(i);
      }
    });
    const active = plan.timed.filter((t, i) => !done.has(i) && t.start <= e);

    state.forEach((q, i) => {
      const m = q.m;
      base.set(
        m[0], m[1], m[2], (q.p[0] * s) / 2,
        m[3], m[4], m[5], (q.p[1] * s) / 2,
        m[6], m[7], m[8], (q.p[2] * s) / 2,
        0, 0, 0, 1,
      );
      const t = active.find((a) => inLayer(q, a.move));
      if (t) {
        const angle = easeTurn(clamp01((e - t.start) / (t.end - t.start))) * t.move.turns * (Math.PI / 2);
        if (t.move.axis === "row") turn.makeRotationY(angle);
        else turn.makeRotationX(angle);
        base.premultiply(turn);
      }
      cubies[i].matrix.copy(base);
      cubies[i].matrixWorldNeedsUpdate = true;
    });
    renderer.render(scene, camera);
  }

  let raf = 0;
  let disposed = false;
  let resolveReady!: () => void;
  let resolveDone!: () => void;
  const ready = new Promise<void>((r) => (resolveReady = r));
  const finished = new Promise<void>((r) => (resolveDone = r));

  // Upload both pictures and draw the flat first frame before the page
  // hands over, so there's no blank or half-loaded frame.
  renderer.initTexture(formTex);
  renderer.initTexture(thanksTex);
  renderer.compile(scene, camera);
  frame(0);
  requestAnimationFrame(() => {
    if (disposed) return;
    resolveReady();
    const t0 = performance.now();
    // Run clock origin, for frame-exact screenshots in tests.
    canvas.dataset.t0 = String(t0);
    const tick = () => {
      if (disposed) return;
      const e = performance.now() - t0;
      frame(Math.min(e, plan.total));
      if (e >= plan.total) resolveDone();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });

  // Sanity: the run must end exactly on the wave.
  if (process.env.NODE_ENV === "development" && !landed(flatten(opts.choreography).reduce(apply, solved())))
    console.error("cube3d: run misses the landing");

  return {
    ready,
    done: finished,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      geometries.forEach((g) => g.dispose());
      [...Object.values(mats), body].forEach((m) => m.dispose());
      formTex.dispose();
      thanksTex.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
