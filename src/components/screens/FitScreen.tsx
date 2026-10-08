"use client";

import { type Easing, motion, useInView, useReducedMotion } from "motion/react";
import { SLOW, easeOut, glide } from "@/components/screens/timing";
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
// Reduced motion renders everything static.
const TITLE_AT = 0;
const HERO_AT = 0.3;
const INTRO_AT = HERO_AT + SLOW - 0.1;
const INTRO_DUR = 3;
const ROWS_AT = INTRO_AT + INTRO_DUR + 0.2;
const ROW_TEXT_DUR = 0.3;
const CHECK_DUR = 0.4;
const ROW_GAP = 0.1;
const ROW_PERIOD = ROW_TEXT_DUR + CHECK_DUR + ROW_GAP;
const CLOSING_AT = ROWS_AT + deckFit.rows.length * ROW_PERIOD;

export default function FitScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const on = reduce || inView;
  // With reduced motion, every transition collapses to instant.
  const t = (delay: number, duration: number, ease: Easing = easeOut) =>
    reduce ? { duration: 0 } : { delay, duration, ease };

  return (
    <>
      {/* overflow-x-clip: the slide-ins start outside the column and must not
          widen the page. */}
      <div ref={ref} className="translate-y-3 overflow-x-clip">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={on ? { opacity: 1, y: 0 } : undefined}
          transition={t(TITLE_AT, SLOW, glide)}
        >
          <ScreenTitle>{deckFit.header}</ScreenTitle>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={on ? { opacity: 1, x: 0 } : undefined}
          transition={t(HERO_AT, SLOW, glide)}
        >
          <Image
            src={fitArt}
            alt="A kid telling a parent about something they won"
            sizes="(min-width: 768px) 22rem, 16rem"
            className="ml-auto mt-4 w-[14.4rem] object-contain md:mt-6 md:w-[19.8rem]"
          />
        </motion.div>

        <p className="mt-[34px] text-base text-primary/70 md:text-lg">
          <StreamWords
            text={deckFit.intro}
            on={on}
            at={INTRO_AT}
            dur={INTRO_DUR}
            reduce={reduce}
          />
        </p>

        <ul className="mt-3 divide-y divide-primary/10 md:mt-4">
          {deckFit.rows.map((r, i) => {
            const textAt = ROWS_AT + i * ROW_PERIOD;
            const checkAt = textAt + ROW_TEXT_DUR;
            return (
              <motion.li
                key={r.title}
                className="flex items-center gap-3 py-3.5 text-lg font-bold tracking-tight md:py-4 md:text-xl"
                initial={{ opacity: 0 }}
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
                  initial={{ scale: 0 }}
                  animate={on ? { scale: reduce ? 1 : [0, 1.3, 1] } : undefined}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          delay: checkAt,
                          duration: CHECK_DUR,
                          times: [0, 0.6, 1],
                          ease: "easeOut",
                        }
                  }
                >
                  <path d="M5 12l5 5L19 7" />
                </motion.svg>
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: 48 }}
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

      {/* Pinned to the section's bottom edge; a sibling of the content so no
          transformed ancestor becomes its containing block. */}
      <motion.p
        className="absolute inset-x-4 bottom-[10px] mx-auto max-w-xl text-sm md:inset-x-8 md:max-w-2xl"
        initial={{ opacity: 0 }}
        animate={on ? { opacity: 1 } : undefined}
        transition={t(CLOSING_AT, 1)}
      >
        {deckFit.closing}
      </motion.p>
    </>
  );
}
