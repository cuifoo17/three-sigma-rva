"use client";

import { useEffect } from "react";
import { PIXEL_ID } from "@/lib/pixel";
import { ownerBrowser } from "@/lib/owner";

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
