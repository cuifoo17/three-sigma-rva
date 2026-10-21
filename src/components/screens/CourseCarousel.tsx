"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOut } from "@/components/screens/timing";

// The ten sessions as a horizontal, snapping carousel. No cards: each lesson
// is an invisible pill, and a 2px grey rule separates neighbours. About 1.75
// lessons show at once so the next one peeks in from the right.
// Bleeds to the screen edge on phones (-mx-4), keeps the column on desktop.
type Lesson = { title: string; body: string };
type Enter = { on: boolean; at: number; dur: number; gap: number };

// COMPARISON PASS (temporary): each lesson wears a different numeral
// treatment, lesson 1 = idea 1 through lesson 10 = idea 10, so the founder
// can pick one in context. Collapse to the winner afterwards.
const big = "text-4xl leading-none font-bold";
function Numeral({ i }: { i: number }) {
  const n = i + 1;
  switch (n) {
    case 1: // Navy outline on the yellow glyph.
      return (
        <span className={`${big} text-yellow [-webkit-text-stroke:1.5px_var(--color-primary)] [paint-order:stroke_fill]`}>
          {n}
        </span>
      );
    case 2: // Thin yellow square frame, navy numeral.
      return (
        <span className="inline-flex size-12 items-center justify-center border-[1.5px] border-yellow text-[1.75rem] leading-none font-bold text-primary">
          {n}
        </span>
      );
    case 3: // Yellow underline bar.
      return (
        <span className={`${big} inline-block text-yellow after:mt-1 after:block after:h-1 after:w-[0.75em] after:bg-yellow after:content-['']`}>
          {n}
        </span>
      );
    case 4: // Hard navy drop shadow, no blur.
      return (
        <span className={`${big} text-yellow [text-shadow:3px_3px_0_var(--color-primary)]`}>
          {n}
        </span>
      );
    case 5: // Outline only, blue shows through.
      return (
        <span className={`${big} text-transparent [-webkit-text-stroke:2px_var(--color-yellow)]`}>
          {n}
        </span>
      );
    case 6: // Navy numeral on a yellow highlighter swipe.
      return (
        <span className={`${big} relative z-0 inline-block px-1 text-primary before:absolute before:inset-x-0 before:inset-y-[0.08em] before:-z-10 before:-rotate-2 before:bg-yellow before:content-['']`}>
          {n}
        </span>
      );
    case 7: // Oversized ghost numeral behind, small solid one in front.
      return (
        <>
          <span className="pointer-events-none absolute left-0 top-[-0.35rem] select-none text-[5.5rem] leading-none font-bold text-yellow/30">
            {n}
          </span>
          <span className={`${big} relative text-yellow`}>{n}</span>
        </>
      );
    case 8: // Zero-padded, mono figures.
      return (
        <span className={`${big} font-mono tabular-nums text-yellow`}>
          {String(n).padStart(2, "0")}
        </span>
      );
    case 9: // Navy numeral with a small yellow dot after it.
      return (
        <span className={`${big} text-primary after:ml-0.5 after:inline-block after:size-2 after:rounded-full after:bg-yellow after:content-['']`}>
          {n}
        </span>
      );
    default: // 10: Yellow numeral with a navy left tab.
      return (
        <span className={`${big} border-l-4 border-primary pl-2 text-yellow`}>
          {n}
        </span>
      );
  }
}

export default function CourseCarousel({
  lessons,
  enter,
}: {
  lessons: Lesson[];
  enter?: Enter;
}) {
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

  return (
    <ol
      aria-label="Course contents"
      className="-mx-4 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-pl-4 pl-4 pr-4 [scrollbar-width:none] md:mx-0 md:scroll-pl-0 md:pl-0 md:pr-0 [&::-webkit-scrollbar]:hidden"
    >
      {lessons.map((l, i) => (
        <motion.li
          key={l.title}
          {...entrance(i)}
          // 1 / 1.75 of the column. Rule on the left of every item but the
          // first; the padding either side of it keeps text off the line.
          className="relative w-[57.14%] shrink-0 snap-start border-l-2 border-black/15 px-4 first:border-l-0 first:pl-0 last:pr-0"
        >
          {/* Numeral slot: fixed height so titles line up across treatments. */}
          <span aria-hidden="true" className="flex h-12 items-end">
            <Numeral i={i} />
          </span>
          {/* Title and body are 20% up from text-base / text-sm. */}
          <p className="mt-2 text-[1.2rem] font-bold leading-tight tracking-tight text-primary">
            <span className="sr-only">{i + 1}. </span>
            {l.title}
          </p>
          <p className="mt-1 text-[1.05rem] leading-tight text-black/80">{l.body}</p>
        </motion.li>
      ))}
    </ol>
  );
}
