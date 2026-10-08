"use client";

import { motion, useReducedMotion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { easeOut } from "@/components/screens/timing";
import { createPortal } from "react-dom";
import { ArtSlot, PendingText } from "@/components/Placeholder";

// Headspace-style rows: the title is the row, the rest lives in a full-colour
// pop-up so the section stays one thought. Colours cycle through the palette.
// `sub` is an optional second line under the title, regular weight.
// `glyph` is the small cut-out art on the row; rows without one show the slot.
// The pop-up shows the same glyph, expanded.
type Row = {
  title: string;
  sub?: string;
  body: string;
  pending?: boolean;
  glyph?: StaticImageData;
};

// Optional entrance for the screens page: each row slides in from the left,
// starting `at` seconds after `on` turns true, `dur` long, `gap` between rows.
type Enter = { on: boolean; at: number; dur: number; gap: number };

const tones = [
  { panel: "bg-accent text-primary", art: "bg-surface/50" },
  { panel: "bg-yellow text-primary", art: "bg-surface/50" },
  {
    panel: "bg-primary text-background",
    art: "bg-background/15 border-background/40",
  },
];

export default function Rows({
  rows,
  columns = 1,
  compact = false,
  enter,
}: {
  rows: Row[];
  columns?: 1 | 2;
  // Tighter rows for the card deck, where four must fit one phone screen.
  compact?: boolean;
  enter?: Enter;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const entrance = (i: number) =>
    !enter || reduce
      ? {}
      : {
          initial: { opacity: 0, x: -48 },
          animate: enter.on ? { opacity: 1, x: 0 } : undefined,
          transition: {
            delay: enter.at + i * (enter.dur + enter.gap),
            duration: enter.dur,
            ease: easeOut,
          },
        };
  const row = openIndex === null ? null : rows[openIndex];
  const tone = openIndex === null ? tones[0] : tones[openIndex % tones.length];

  useEffect(() => {
    if (openIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpenIndex(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex]);

  return (
    <>
      <ul
        className={`grid ${compact ? "gap-2" : "gap-3"} ${columns === 2 ? "md:grid-cols-2" : ""}`}
      >
        {rows.map((r, i) => (
          <motion.li key={r.title} {...entrance(i)}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className={`flex min-h-touch w-full items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-surface text-left text-primary ${compact ? "px-4 py-1.5" : "px-5 py-4"} transition hover:border-primary/30 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
            >
              <span className="text-balance">
                <span
                  className={`block font-bold tracking-tight ${compact ? "text-base" : "text-lg"}`}
                >
                  {r.title}
                </span>
                {r.sub && (
                  <span
                    className={`block text-primary/70 ${compact ? "text-sm" : "text-base"}`}
                  >
                    {r.sub}
                  </span>
                )}
              </span>
              <span
                className={`flex shrink-0 items-center ${compact ? "gap-2" : "gap-3"}`}
              >
                {/* ArtSlot is w-full; the wrapper sets the glyph's size. */}
                <span className={`block shrink-0 ${compact ? "w-14" : "w-10"}`}>
                  {r.glyph ? (
                    <Image
                      src={r.glyph}
                      alt=""
                      sizes="56px"
                      className="size-full"
                      loading={enter ? "eager" : "lazy"}
                      decoding="async"
                    />
                  ) : (
                    <ArtSlot
                      label="glyph"
                      ratio="square"
                      className="rounded-lg"
                    />
                  )}
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5 text-primary/60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      {/* Portalled to <body>: a transformed ancestor (Reveal, a translate
          nudge) would otherwise become the fixed overlay's containing block
          and clip the dim to the content column. */}
      {row &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4"
            onClick={() => setOpenIndex(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="row-dialog-title"
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md overflow-y-auto overscroll-y-contain rounded-3xl p-6 shadow-xl max-h-[85dvh] md:p-8 ${tone.panel}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h3
                  id="row-dialog-title"
                  className="text-2xl font-bold tracking-tight text-balance"
                >
                  {row.title}
                </h3>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpenIndex(null)}
                  className="-mt-2 -mr-2 flex min-h-touch min-w-touch shrink-0 items-center justify-center rounded-full hover:bg-current/10 active:bg-current/20"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              {row.glyph ? (
                <Image
                  src={row.glyph}
                  alt=""
                  sizes="(min-width: 768px) 14rem, 12rem"
                  className="mx-auto mt-5 size-48 object-contain md:size-56"
                />
              ) : (
                <ArtSlot label="expanded art" className={`mt-5 ${tone.art}`} />
              )}
              <p className="mt-5 text-lg">
                {row.pending ? <PendingText text={row.body} /> : row.body}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
