"use client";

import { type Easing, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import Rows from "@/components/Rows";
import { ScreenTitle } from "@/components/screens/Screen";
import StreamWords from "@/components/screens/StreamWords";
import { SLOW, easeOut, glide } from "@/components/screens/timing";
import { deckOutcomes } from "@/content/deck";
import outcomesArt from "@/app/outcomes.png";

// Timed sequence, started once when the screen scrolls into view:
//   0.0s  title falls in from the top over 1.8s
//   0.3s  art glides in from the left over 1.8s
//   2.0s  subtitle (under the art) streams in one word at a time over 1s,
//         0.1s before the art lands
//   3.2s  0.2s after the subtitle finishes, cards slide in from the left over
//         0.6s, each 0.1s after the one before it lands
// Reduced motion renders everything static.
// 0.8s longer than the other screens' entrances.
const ENTER = SLOW + 0.8;
const TITLE_AT = 0;
const ART_AT = 0.3;
const SUB_AT = ART_AT + ENTER - 0.1;
const SUB_DUR = 1;
const CARDS_AT = SUB_AT + SUB_DUR + 0.2;
const CARD_DUR = 0.6;
const CARD_GAP = 0.1;

export default function OutcomesScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const on = reduce || inView;
  const t = (delay: number, duration: number, ease: Easing = easeOut) =>
    reduce ? { duration: 0 } : { delay, duration, ease };

  return (
    // overflow-x-clip: the slide-ins start outside the column and must not
    // widen the page.
    <div ref={ref} className="-translate-y-2 overflow-x-clip">
      {/* The top margin equals the height the 10%-smaller art gave up, so the
          title drops into that gap and everything below stays put. */}
      <motion.div
        className="mt-[21px] md:mt-[27px]"
        initial={{ opacity: 0, y: -40 }}
        animate={on ? { opacity: 1, y: 0 } : undefined}
        transition={t(TITLE_AT, ENTER, glide)}
      >
        <ScreenTitle>
          {deckOutcomes.title.split("\n").map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </ScreenTitle>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={on ? { opacity: 1, x: 0 } : undefined}
        transition={t(ART_AT, ENTER, glide)}
      >
        {/* Eager + async decode: fetched and decoded while the hero is still on
            screen, so the slide-in isn't competing with a PNG decode. */}
        <Image
          src={outcomesArt}
          alt="A student at a laptop"
          loading="eager"
          decoding="async"
          sizes="(min-width: 768px) 20rem, 15.5rem"
          className="ml-auto mt-4 w-[8.8rem] object-contain md:mt-6 md:w-[11.3rem]"
        />
      </motion.div>
      <p className="mt-5 text-lg text-primary/70 md:text-xl">
        <StreamWords
          text={deckOutcomes.sub}
          on={on}
          at={SUB_AT}
          dur={SUB_DUR}
          reduce={reduce}
        />
      </p>
      <div className="mt-3 md:mt-4">
        <Rows
          compact
          rows={deckOutcomes.rows}
          enter={{ on, at: CARDS_AT, dur: CARD_DUR, gap: CARD_GAP }}
        />
      </div>
    </div>
  );
}
