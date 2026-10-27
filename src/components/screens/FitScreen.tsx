"use client";

import { type Easing, motion, useInView, useReducedMotion } from "motion/react";
import { easeOut, glide, SLOW, SPEED, STATIC_ENTRANCES } from "@/components/screens/timing";
import Image from "next/image";
import { useRef } from "react";
import { ScreenTitle } from "@/components/screens/Screen";
import StreamWords from "@/components/screens/StreamWords";
import { deckFit } from "@/content/deck";
import fitArt from "@/app/fit.jpg";

// Timed sequence, started once when the screen scrolls into view:
//   0.0s   title falls in from the top over 1s
//   0.3s   hero art slides in from the left over 1s
//   1.2s   intro streams in one word at a time over 3s, 0.1s before the art lands
//   4.4s   row 1 text comes in fast from the right; when it lands the check
//         bounces in; 0.1s after that, row 2, and so on
// Reduced motion renders everything static, as does STATIC_ENTRANCES.
const TITLE_AT = 0;
const HERO_AT = 0.3;
const INTRO_AT = HERO_AT + SLOW - 0.1;
const INTRO_DUR = 3;
const ROWS_AT = INTRO_AT + INTRO_DUR + 0.2;
const ROW_TEXT_DUR = 0.3;
const CHECK_DUR = 0.4;
const ROW_GAP = 0.1;
const ROW_PERIOD = ROW_TEXT_DUR + CHECK_DUR + ROW_GAP;

export default function FitScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion() || STATIC_ENTRANCES;
  const on = reduce || inView;
  // With reduced motion, every transition collapses to instant.
  const t = (delay: number, duration: number, ease: Easing = easeOut) =>
    reduce ? { duration: 0 } : { delay: delay * SPEED, duration: duration * SPEED, ease };

  return (
    <>
      {/* overflow-x-clip: the slide-ins start outside the column and must not
          widen the page. */}
      {/* Pushed down so the title sits level with the teacher screen's: each
          screen centres its own content. 10px more on phones; from md the
          floated block is shorter than the teacher's, so it's pulled up 37px
          (both measured 2026-10-27). */}
      <div ref={ref} className="translate-y-[22px] overflow-x-clip md:-translate-y-[37px]">
        <motion.div
          initial={STATIC_ENTRANCES ? false : { opacity: 0, y: -40 }}
          animate={on ? { opacity: 1, y: 0 } : undefined}
          transition={t(TITLE_AT, SLOW, glide)}
        >
          <ScreenTitle>{deckFit.header}</ScreenTitle>
        </motion.div>

        {/* From md the art floats right and is pulled up into the title's
            row (the title is one 40px line); the intro wraps beside it and
            the list clears below, as on the teacher screen. Phones keep the
            stacked layout. Art is 15% smaller from md (19.8rem to 16.83rem)
            so the last row clears the screen on laptop heights. */}
        <motion.div
          className="md:float-right md:-mt-10 md:mb-2 md:ml-6"
          initial={STATIC_ENTRANCES ? false : { opacity: 0, x: -80 }}
          animate={on ? { opacity: 1, x: 0 } : undefined}
          transition={t(HERO_AT, SLOW, glide)}
        >
          <Image
            src={fitArt}
            alt="A kid telling a parent about something they won"
            sizes="(min-width: 768px) 17rem, 16rem"
            className="ml-auto mt-4 w-[14.4rem] object-contain md:mt-0 md:w-[16.83rem]"
          />
        </motion.div>

        <p className="mt-[34px] text-base text-primary/70 md:mt-6 md:text-lg">
          <StreamWords
            text={deckFit.intro}
            on={on}
            at={INTRO_AT}
            dur={INTRO_DUR}
            reduce={reduce}
          />
        </p>

        <ul className="mt-3 divide-y divide-primary/10 md:mt-4 md:clear-both">
          {deckFit.rows.map((r, i) => {
            const textAt = ROWS_AT + i * ROW_PERIOD;
            const checkAt = textAt + ROW_TEXT_DUR;
            return (
              <motion.li
                key={r.title}
                className="flex items-center gap-3 py-3.5 text-lg font-bold tracking-tight md:py-4 md:text-xl"
                initial={STATIC_ENTRANCES ? false : { opacity: 0 }}
                animate={on ? { opacity: 1 } : undefined}
                transition={t(textAt, ROW_TEXT_DUR)}
              >
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-6 shrink-0 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={STATIC_ENTRANCES ? false : { scale: 0 }}
                  animate={on ? { scale: reduce ? 1 : [0, 1.3, 1] } : undefined}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          delay: checkAt * SPEED,
                          duration: CHECK_DUR * SPEED,
                          times: [0, 0.6, 1],
                          ease: "easeOut",
                        }
                  }
                >
                  <path d="M5 12l5 5L19 7" />
                </motion.svg>
                <motion.span
                  className="block"
                  initial={STATIC_ENTRANCES ? false : { opacity: 0, x: 48 }}
                  animate={on ? { opacity: 1, x: 0 } : undefined}
                  transition={t(textAt, ROW_TEXT_DUR)}
                >
                  {r.title}
                </motion.span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
