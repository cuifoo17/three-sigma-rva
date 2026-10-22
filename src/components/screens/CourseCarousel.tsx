"use client";

import { motion, useReducedMotion } from "motion/react";
import { easeOut } from "@/components/screens/timing";

// The ten sessions as a horizontal, snapping carousel. No cards: each lesson
// is an invisible pill, and a 2px grey rule separates neighbours. About 1.75
// lessons show at once so the next one peeks in from the right.
// Bleeds to the screen edge on phones (-mx-4), keeps the column on desktop.
type Lesson = { title: string; body: string };
type Enter = { on: boolean; at: number; dur: number; gap: number };

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
          className="w-[57.14%] shrink-0 snap-start border-l-2 border-black/15 px-4 first:border-l-0 first:pl-0 last:pr-0"
        >
          {/* Big yellow numeral with a hard navy drop shadow, no badge. */}
          <span
            aria-hidden="true"
            className="block text-4xl leading-none font-bold text-yellow [text-shadow:3px_3px_0_var(--color-primary)]"
          >
            {i + 1}
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
