import type { Easing } from "motion/react";

// Shared timing for the screens' entrance sequences.
export const SLOW = 1;
export const easeOut: Easing = [0.22, 1, 0.36, 1];
// Nearly linear: an even glide, not a dart and settle.
export const glide: Easing = [0.3, 0.3, 0.7, 0.7];
