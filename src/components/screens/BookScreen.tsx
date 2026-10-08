"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import BookForm from "@/components/BookForm";
import { PendingText } from "@/components/Placeholder";
import CubeTwist from "@/components/screens/CubeTwist";
import Screen, { ScreenTitle } from "@/components/screens/Screen";
import { book, deckBook, footer, nav } from "@/content/deck";
import { choreograph, type Choreography } from "@/lib/rubiks";

// The last screen: the booking form, and once it's sent, the thank-you.
// Sending turns the whole yellow section into a solid 3D cube (three.js) that
// tilts into view, twists, spins its thank-you face round and settles flat
// again, ~5s. Both faces are pictures of real DOM taken at the moment of
// sending, so the typed answers ride along and the landing matches the live
// thank-you underneath pixel for pixel. Reduced motion, no WebGL, or a
// capture that fails gets a plain crossfade instead.
type Phase = "form" | "settling" | "capturing" | "twisting" | "fading" | "done";
// focus: the part of the section on screen when sent, below the sticky
// header; the cube centres there.
type Size = { w: number; h: number; focus: { top: number; bottom: number } };
type Twist = {
  images: { form: HTMLImageElement; thanks: HTMLImageElement };
  urls: string[];
  choreography: Choreography;
};

// live: only the real one announces; the fade and the offscreen picture are
// decoration.
function Thanks({ live = false }: { live?: boolean }) {
  return (
    <p role={live ? "status" : undefined} className="text-3xl font-bold tracking-tight text-balance md:text-5xl">
      {deckBook.thanks}
    </p>
  );
}

// Section height is locked from the moment of sending so nothing below jumps
// when the form swaps for tiles and then for the much shorter thank-you.
const lockStyle = (size: Size | null, exact: boolean) =>
  size ? { minHeight: size.h, height: exact ? size.h : undefined } : undefined;

// The no-tiles path: the thank-you fades in over the form. Plain WAAPI, not
// motion: motion skips animations outright under reduced motion, and an
// opacity fade is exactly what reduced motion still allows.
function FadeIn({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const anim = ref.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 300,
      easing: "ease-out",
      fill: "both",
    });
    if (!anim) return;
    let live = true;
    anim.finished.then(() => live && onDone(), () => {});
    return () => {
      live = false;
      anim.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-accent px-4 pt-18 pb-20 opacity-0 md:px-8"
    >
      <div className="w-full max-w-xl md:max-w-2xl">
        <Thanks />
      </div>
    </div>
  );
}

// iPhone: tapping Submit closes the keyboard, the viewport resizes, and the
// page's mandatory snap re-snaps, flashing the card above before the cube
// starts. So from the tap until the thank-you is in, snapping is off and
// the scroll is pinned where they were. Snapping comes back once the page
// is resting inside this section (where it can't re-snap anywhere), or else
// on their next touch, so it never jumps on its own. glideTo moves the pin
// smoothly, for the rare tap made with the section only part on screen.
function holdScroll(section: () => HTMLElement | null) {
  const root = document.documentElement;
  let y = window.scrollY;
  const prev = root.style.scrollSnapType;
  root.style.scrollSnapType = "none";
  let raf = 0;
  const pin = () => {
    if (Math.abs(window.scrollY - y) > 0.5) window.scrollTo(0, y);
  };
  const loop = () => {
    pin();
    raf = requestAnimationFrame(loop);
  };
  loop();
  window.addEventListener("scroll", pin, { passive: true });
  const restore = () => {
    root.style.scrollSnapType = prev;
    ["touchstart", "wheel", "keydown"].forEach((t) => window.removeEventListener(t, restore));
  };
  const glideTo = (to: number) =>
    new Promise<void>((resolve) => {
      const from = y;
      const start = performance.now();
      const step = () => {
        const t = Math.min(1, (performance.now() - start) / 300);
        y = from + (to - from) * (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
        pin();
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  const release = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", pin);
    const r = section()?.getBoundingClientRect();
    const resting = r && r.top <= 0.5 && r.bottom >= window.innerHeight - 0.5;
    if (resting) restore();
    else ["touchstart", "wheel", "keydown"].forEach((t) => window.addEventListener(t, restore, { passive: true }));
  };
  return { release, glideTo };
}

// Waits for the viewport to stop changing (the keyboard sliding away): three
// still frames, or 600ms at most.
const viewportSettled = () =>
  new Promise<void>((resolve) => {
    const height = () => window.visualViewport?.height ?? window.innerHeight;
    const start = performance.now();
    let last = height();
    let still = 0;
    const step = () => {
      const h = height();
      still = Math.abs(h - last) < 0.5 ? still + 1 : 0;
      last = h;
      if (still >= 3 || performance.now() - start > 600) resolve();
      else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

const decoded = async (url: string) => {
  const img = new Image();
  img.src = url;
  await img.decode();
  return img;
};

export default function BookScreen() {
  const ref = useRef<HTMLElement>(null);
  const offscreen = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("form");
  const [size, setSize] = useState<Size | null>(null);
  const [twist, setTwist] = useState<Twist | null>(null);
  // The cube has drawn its flat first frame: only now hide the live form.
  const [covered, setCovered] = useState(false);

  const hold = useRef<ReturnType<typeof holdScroll> | null>(null);

  const send = async () => {
    if (!ref.current || phase !== "form") return;
    // Before anything moves: snapping off, scroll pinned, keyboard away.
    hold.current = holdScroll(() => ref.current);
    (document.activeElement as HTMLElement | null)?.blur();
    setPhase("settling");
    await viewportSettled();
    let el = ref.current;
    if (!el) return;
    // Section only part on screen: glide it to fill the screen first, so the
    // cube and the thank-you land in view.
    let r = el.getBoundingClientRect();
    const gap = r.top > 0 ? r.top : r.bottom < window.innerHeight ? r.bottom - window.innerHeight : 0;
    if (Math.abs(gap) > 0.5) await hold.current.glideTo(window.scrollY + gap);
    el = ref.current;
    if (!el) return;
    r = el.getBoundingClientRect();
    const rect = r;
    const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    const top = Math.min(Math.max(0, header - rect.top), rect.height);
    const bottom = Math.max(Math.min(rect.height, window.innerHeight - rect.top), top + 1);
    setSize({ w: rect.width, h: rect.height, focus: { top, bottom } });
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase(still ? "fading" : "capturing");
  };

  // Capturing: the button holds its pressed look, the offscreen thank-you
  // has mounted at the section's exact size; picture both.
  useEffect(() => {
    if (phase !== "capturing") return;
    let cancelled = false;
    const urls: string[] = [];
    (async () => {
      // Fetch the cube's chunk alongside the capture, not after it.
      const cube = import("@/components/screens/cube3d");
      const { domToBlob } = await import("modern-screenshot");
      if (!(await cube).webglAvailable()) throw new Error("no WebGL");
      await document.fonts.ready;
      const shot = async (node: HTMLElement) => {
        const blob = await domToBlob(node, {
          scale: Math.min(window.devicePixelRatio || 1, 2),
          type: "image/png",
        });
        const url = URL.createObjectURL(blob);
        urls.push(url);
        return decoded(url);
      };
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("capture timed out")), 3000),
      );
      const [form, thanks] = await Promise.race([
        // One at a time: modern-screenshot shares a style sandbox between
        // calls, and two at once can skew the layout of the clone.
        (async () => [await shot(ref.current!), await shot(offscreen.current!)] as const)(),
        timeout,
      ]);
      if (cancelled) return;
      setTwist({ images: { form, thanks }, urls, choreography: choreograph() });
      setPhase("twisting");
    })().catch(() => {
      // Fonts, CORS or no WebGL; never leave them on a frozen form.
      urls.forEach((u) => URL.revokeObjectURL(u));
      if (!cancelled) setPhase("fading");
    });
    return () => {
      cancelled = true;
    };
  }, [phase]);

  // Let the page scroll and snap again once the thank-you is in.
  useEffect(() => {
    if (phase !== "done") return;
    hold.current?.release();
    hold.current = null;
  }, [phase]);
  useEffect(() => () => hold.current?.release(), []);

  // Free the two pictures once the real thank-you is on screen.
  useEffect(() => {
    if (phase === "done") twist?.urls.forEach((u) => URL.revokeObjectURL(u));
  }, [phase, twist]);

  const done = phase === "done";
  const hidden = phase === "twisting" && covered;

  let overlay = null;
  if (phase === "twisting" && twist && size) {
    overlay = (
      <div className={covered ? undefined : "invisible"}>
        <CubeTwist
          width={size.w}
          height={size.h}
          focus={size.focus}
          images={twist.images}
          choreography={twist.choreography}
          onReady={() => setCovered(true)}
          onDone={() => setPhase("done")}
          onError={() => setPhase("fading")}
        />
      </div>
    );
  } else if (phase === "fading") {
    overlay = <FadeIn onDone={() => setPhase("done")} />;
  }

  return (
    <>
      <Screen
        id="book"
        ref={ref}
        tone={done ? "sky" : "yellow"}
        fill={false}
        style={lockStyle(size, !done)}
        overlay={overlay}
      >
        {done ? (
          <Thanks live />
        ) : (
          <div className={hidden ? "invisible" : undefined} inert={phase === "twisting"}>
            <ScreenTitle>{book.header}</ScreenTitle>
            <div className="mt-5">
              <BookForm onSubmit={send} busy={phase === "settling" || phase === "capturing"} />
            </div>
            <p className="mt-8 text-xs text-primary/60">
              {nav.wordmark} · <PendingText text={footer.email.text} /> ·{" "}
              <PendingText text={footer.location.text} /> · {footer.legal}
            </p>
          </div>
        )}
      </Screen>

      {/* The thank-you face of the cube: the finished section, laid out off
          screen at the form's exact size just long enough to be pictured. */}
      {phase === "capturing" && size && (
        <div
          aria-hidden="true"
          inert
          className="pointer-events-none fixed top-0 left-0"
          style={{ width: size.w, transform: "translateX(-200vw)" }}
        >
          <Screen ref={offscreen} tone="sky" fill={false} style={lockStyle(size, true)}>
            <Thanks />
          </Screen>
        </div>
      )}
    </>
  );
}
