"use client";

import { motion } from "motion/react";
import { easeOut } from "@/components/screens/timing";

// Streams copy in one word at a time, evenly across `dur` seconds from `at`.
// A "\n" in the copy is a forced line break: that word gets a <br /> after it
// instead of a space. `reduce` renders every word instantly.
export default function StreamWords({
  text,
  on,
  at,
  dur,
  reduce,
}: {
  text: string;
  on: boolean;
  at: number;
  dur: number;
  reduce: boolean | null;
}) {
  const words = text
    .replace(/\n/g, "\n ")
    .split(" ")
    .map((w) => ({ text: w.replace("\n", ""), breakAfter: w.endsWith("\n") }));
  return words.map((word, i) => (
    <span key={i} className="contents">
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: 6 }}
        animate={on ? { opacity: 1, y: 0 } : undefined}
        transition={
          reduce
            ? { duration: 0 }
            : {
                delay: at + (i / words.length) * dur,
                duration: 0.7,
                ease: easeOut,
              }
        }
      >
        {word.text}
        {i < words.length - 1 && !word.breakAfter && " "}
      </motion.span>
      {word.breakAfter && <br />}
    </span>
  ));
}
