"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// The hero art sits sharp behind the first card. As the deck scrolls it
// crossfades into a heavily blurred, slowly drifting copy of itself, so every
// later card floats on frosted colour drawn from the hero. It sits at z-0
// (not negative): a negative z-index here stops Chrome painting the sticky
// header once the page scrolls. Cards are positioned so they paint above it.
export default function Backdrop({ art }: { art: StaticImageData }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const sharp = useTransform(scrollY, [0, 480], [1, 0]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      <div className={`absolute inset-0 ${reduce ? "" : "deck-drift"}`}>
        <Image
          src={art}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-125 object-cover blur-3xl saturate-150"
        />
      </div>
      <motion.div style={{ opacity: sharp }} className="absolute inset-0">
        <Image src={art} alt="" fill priority sizes="100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}
