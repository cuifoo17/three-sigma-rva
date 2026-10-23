"use client";

import { useEffect } from "react";
import { PIXEL_ID } from "@/lib/pixel";

// Owner opt-out: open the site once per browser with ?me=1 and that browser
// never loads the pixel again (?me=0 turns it back on). The flag lives in
// localStorage, so it has to be set separately in Safari, Chrome and the
// Facebook / Instagram in-app browsers, and Safari drops it after seven days
// without a tap on the site. Everyone else is untouched.
const KEY = "ts_owner";

/** True when this browser is the owner's. Handles ?me=1 / ?me=0 and strips the param from the URL. */
function ownerBrowser(): boolean {
  try {
    const q = new URLSearchParams(location.search);
    const me = q.get("me");
    if (me === "1") localStorage.setItem(KEY, "1");
    else if (me === "0") localStorage.removeItem(KEY);
    if (me !== null) {
      q.delete("me");
      const search = q.toString();
      history.replaceState(history.state, "", location.pathname + (search ? `?${search}` : "") + location.hash);
    }
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** Meta's base code: defines the fbq queue, loads fbevents.js, inits the pixel and fires PageView. */
function loadPixel() {
  const w = window as Window & { fbq?: unknown; _fbq?: unknown };
  if (w.fbq) return; // already loaded (React dev runs effects twice)
  type Queue = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push: unknown; loaded: boolean; version: string };
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Queue;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  w.fbq = n;
  w._fbq = n;
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(t);
  n("init", PIXEL_ID);
  n("track", "PageView");
}

// Meta Pixel. The script is injected from the client only after the owner
// check has run, so an opted-out browser sends Meta nothing at all. The
// noscript fallback is inert with JS on, so it stays in the static HTML.
export default function MetaPixel() {
  useEffect(() => {
    if (!ownerBrowser()) loadPixel();
  }, []);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt=""
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
