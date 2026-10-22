// First-party page analytics for HQ: which screen of the deck is on screen and
// for how long, how far the booking form gets, and whether the header button
// was used to skip ahead. No cookies, no PII: one random session id in
// sessionStorage, posted to the HQ backend as a small cumulative snapshot.
//
// The snapshot is the whole session so far, re-sent on every flush; the
// backend keeps the latest. A lost beacon costs nothing but the last few
// seconds, and a repeated one changes nothing.
//
// The active screen is the section that covers the viewport's centre line
// (an IntersectionObserver with a zero-height root band). Dwell pauses while
// the tab is hidden.

const base = process.env.NEXT_PUBLIC_LEADS_URL ?? "";
const KEY = "ts_web_session";
const HEARTBEAT_MS = 20_000;
const FIRST_FLUSH_MS = 3_000;

export type FormField = "name" | "phone" | "email" | "anything";

type Session = {
  sid: string;
  startedAt: number;
  ref: string;
  utm: Record<string, string>;
  mobile: boolean;
  inApp: boolean;
  w: number;
  h: number;
  screens: Record<string, { ms: number; order: number }>;
  lastScreen: string | null;
  form: { started: boolean; touched: FormField[]; ready: boolean; submits: number; saved: boolean; failed: number };
  cta: string[];
};

let session: Session | null = null;
let active: string | null = null;
let activeSince = 0;
let dirty = false;

const now = () => Date.now();

function load(): Session | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    return typeof s.sid === "string" && typeof s.startedAt === "number" ? s : null;
  } catch {
    return null;
  }
}

function save() {
  if (!session) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {}
}

function newSid() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function readUtm(): Record<string, string> {
  const out: Record<string, string> = {};
  const q = new URLSearchParams(location.search);
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = q.get(k);
    if (v) out[k.slice(4)] = v.slice(0, 100);
  }
  if (q.has("fbclid")) out.fbclid = "1";
  return out;
}

function fresh(): Session {
  const ua = navigator.userAgent;
  return {
    sid: newSid(),
    startedAt: now(),
    ref: document.referrer.slice(0, 300),
    utm: readUtm(),
    mobile: /Mobi|Android|iPhone|iPad/i.test(ua) || matchMedia("(pointer: coarse)").matches,
    inApp: /FBAN|FBAV|FB_IAB|Instagram/i.test(ua),
    w: window.innerWidth,
    h: window.innerHeight,
    screens: {},
    lastScreen: null,
    form: { started: false, touched: [], ready: false, submits: 0, saved: false, failed: 0 },
    cta: [],
  };
}

// Folds the open dwell segment into the screen's total.
function settle() {
  if (!session || !active || !activeSince) return;
  const ms = now() - activeSince;
  activeSince = now();
  if (ms <= 0) return;
  const s = session.screens[active];
  if (s) s.ms += ms;
  dirty = true;
}

function setActive(name: string | null) {
  if (!session || name === active) return;
  settle();
  active = name;
  activeSince = document.hidden ? 0 : now();
  if (name) {
    if (!session.screens[name]) session.screens[name] = { ms: 0, order: Object.keys(session.screens).length + 1 };
    session.lastScreen = name;
    dirty = true;
  }
}

function flush(force = false) {
  if (!session || !base || (!dirty && !force)) return;
  settle();
  save();
  dirty = false;
  const body = JSON.stringify(session);
  const url = `${base}/api/analytics`;
  try {
    // text/plain: a CORS-safelisted type, so the beacon needs no preflight.
    if (navigator.sendBeacon?.(url, new Blob([body], { type: "text/plain" }))) return;
  } catch {}
  fetch(url, { method: "POST", body, headers: { "Content-Type": "text/plain" }, keepalive: true }).catch(() => {});
}

/** Records a form or header event on the current session. Safe to call before start (no-op). */
export function track(event: "formStarted" | "formReady" | "submit" | "saved" | "failed" | "cta") {
  if (!session) return;
  const f = session.form;
  if (event === "formStarted") {
    if (f.started) return;
    f.started = true;
  } else if (event === "formReady") {
    if (f.ready) return;
    f.ready = true;
  } else if (event === "submit") f.submits += 1;
  else if (event === "saved") f.saved = true;
  else if (event === "failed") f.failed += 1;
  else if (event === "cta") session.cta.push(active ?? "none");
  dirty = true;
  save();
  if (event === "saved" || event === "failed") flush(true);
}

/** A field got input. */
export function touched(field: FormField) {
  if (!session) return;
  if (!session.form.started) track("formStarted");
  if (session.form.touched.includes(field)) return;
  session.form.touched.push(field);
  dirty = true;
  save();
}

/** Mounts the tracker. Returns a cleanup that detaches the listeners; the session itself survives a remount
 *  (React dev runs effects twice), so a second start carries on where the first left off. */
export function start(): () => void {
  if (!base) return () => {};
  if (!session) {
    session = load() ?? fresh();
    dirty = true;
  }

  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-screen]"));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.screen ?? null);
    },
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
  );
  sections.forEach((s) => io.observe(s));

  const onVisibility = () => {
    if (document.hidden) {
      settle();
      activeSince = 0;
      flush(true);
    } else {
      activeSince = now();
    }
  };
  const onHide = () => flush(true);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onHide);
  const first = setTimeout(() => flush(true), FIRST_FLUSH_MS);
  // While a screen is on, time is accruing, so every beat is worth sending.
  const beat = setInterval(() => flush(Boolean(active)), HEARTBEAT_MS);

  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onHide);
    clearTimeout(first);
    clearInterval(beat);
  };
}
