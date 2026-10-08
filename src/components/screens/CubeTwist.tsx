"use client";

import { useEffect, useRef } from "react";
import type { Choreography } from "@/lib/rubiks";

// The book screen's thank-you twist: a WebGL canvas laid exactly over the
// section, a yellow backdrop that turns sky with the wave. three.js (cube3d)
// arrives as its own chunk, fetched while the section is being pictured, so
// the page's normal bundle never carries it.
export default function CubeTwist({
  width,
  height,
  focus,
  images,
  choreography,
  onReady,
  onDone,
  onError,
}: {
  width: number;
  height: number;
  focus: { top: number; bottom: number };
  images: { form: HTMLImageElement; thanks: HTMLImageElement };
  choreography: Choreography;
  onReady: () => void;
  onDone: () => void;
  onError: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const handlers = useRef({ onReady, onDone, onError });
  useEffect(() => {
    handlers.current = { onReady, onDone, onError };
  });

  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import("@/components/screens/cube3d")
      .then(({ playCube }) => {
        if (cancelled || !canvas.current || !backdrop.current) return;
        const run = playCube({
          canvas: canvas.current,
          backdrop: backdrop.current,
          width,
          height,
          focus,
          ...images,
          choreography,
        });
        dispose = run.dispose;
        run.ready.then(() => !cancelled && handlers.current.onReady());
        run.done.then(() => !cancelled && handlers.current.onDone());
      })
      .catch(() => !cancelled && handlers.current.onError());
    return () => {
      cancelled = true;
      dispose?.();
    };
    // focus is read once, at the start; a new object each render must not
    // restart the run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, images, choreography]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-yellow">
      <div ref={backdrop} className="absolute inset-0 bg-accent opacity-0" />
      <canvas ref={canvas} className="absolute inset-0 size-full" />
    </div>
  );
}
