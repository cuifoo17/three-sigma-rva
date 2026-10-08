"use client";

import { type Easing, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { ScreenTitle } from "@/components/screens/Screen";
import { SLOW, easeOut, glide } from "@/components/screens/timing";
import { deckTeacher } from "@/content/deck";
import headshot from "@/app/headshot.png";

// Timed sequence, started once when the screen scrolls into view:
//   0.0s  title falls in from the top over 1s (as on the fit screen)
//   0.3s  photo glides in from the left over 1s (as the fit art does)
//   1.5s  0.2s after the photo lands, bullets slide in fast from the right,
//         each 0.1s after the one before it lands (the fit rows minus the check)
// Reduced motion renders everything static.
const TITLE_AT = 0;
const PHOTO_AT = 0.3;
const POINTS_AT = PHOTO_AT + SLOW + 0.2;
const POINT_DUR = 0.6;
const POINT_GAP = 0.1;
const POINT_PERIOD = POINT_DUR + POINT_GAP;

export default function TeacherScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const on = reduce || inView;
  const t = (delay: number, duration: number, ease: Easing = easeOut) =>
    reduce ? { duration: 0 } : { delay, duration, ease };

  return (
    <div ref={ref} className="overflow-x-clip">
      <motion.div
        className="whitespace-nowrap"
        initial={{ opacity: 0, y: -40 }}
        animate={on ? { opacity: 1, y: 0 } : undefined}
        transition={t(TITLE_AT, SLOW, glide)}
      >
        <ScreenTitle>{deckTeacher.header}</ScreenTitle>
      </motion.div>
      {/* Floated after the title and pulled up into its row: the title keeps
          one line, the cut-out's transparent corner sits beside it, and the
          copy starts below it. The float lives on the fading wrapper. */}
      <motion.div
        className="float-right -mt-2 -mr-2 mb-2 ml-4 md:mr-0 md:-mt-8"
        initial={{ opacity: 0, x: -80 }}
        animate={on ? { opacity: 1, x: 0 } : undefined}
        transition={t(PHOTO_AT, SLOW, glide)}
      >
        <Image
          src={headshot}
          alt="Braulio, the instructor"
          sizes="(min-width: 768px) 18rem, 14rem"
          className="size-[15.5rem] md:size-80"
        />
      </motion.div>
      <ul className="clear-both space-y-3 pt-5 text-base md:text-lg">
        {deckTeacher.points.map((point, i) => (
          <motion.li
            key={point}
            className="flex gap-3"
            initial={{ opacity: 0 }}
            animate={on ? { opacity: 1 } : undefined}
            transition={t(POINTS_AT + i * POINT_PERIOD, POINT_DUR)}
          >
            <span
              aria-hidden="true"
              className="mt-2.5 size-2 shrink-0 rounded-full bg-primary"
            />
            <motion.span
              className="block"
              initial={{ opacity: 0, x: 48 }}
              animate={on ? { opacity: 1, x: 0 } : undefined}
              transition={t(POINTS_AT + i * POINT_PERIOD, POINT_DUR)}
            >
              {point}
            </motion.span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
