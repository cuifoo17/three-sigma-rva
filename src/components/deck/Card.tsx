"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// One screen, one card. The section is the snap target and fills the
// viewport; the glass card inside holds only what fits. Cards snap to the
// viewport centre, not the top: iOS resizes the viewport as the address bar
// collapses and expands, and a top-aligned card drifts off-centre on the way
// back up. snap={false} lets a section grow past one screen (the form),
// snapping at its top instead.
export default function Card({
  id,
  align = "center",
  snap = true,
  tone = "glass",
  children,
}: {
  id?: string;
  align?: "center" | "end";
  snap?: boolean;
  // "yellow" paints the whole screen the colour of the ask, Headspace-style.
  tone?: "glass" | "yellow";
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const inner = (
    <div className="w-full max-w-xl rounded-3xl border border-surface/70 bg-background/75 p-5 shadow-xl shadow-primary/10 backdrop-blur-xl md:max-w-2xl md:p-10">
      {children}
    </div>
  );
  return (
    <section
      id={id}
      className={`relative flex snap-always px-4 pt-18 pb-20 md:px-8 ${tone === "yellow" ? "bg-yellow" : ""} ${snap ? "h-dvh snap-center" : "min-h-dvh snap-start"} ${
        align === "end" ? "items-end" : "items-center"
      } justify-center`}
    >
      {reduce ? (
        inner
      ) : (
        <motion.div
          className="flex w-full justify-center"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {inner}
        </motion.div>
      )}
    </section>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight text-balance md:text-4xl">
      {children}
    </h2>
  );
}
