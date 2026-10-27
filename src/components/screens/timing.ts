import type { Easing } from "motion/react";

// Shared timing for the screens' entrance sequences.
export const SLOW = 1;
// Global speed factor: every delay and duration on the page (entrances, word
// streams, carousel, reveals, the cube twist) is multiplied by this at the
// point it's handed to the animator. 0.7 = 30% faster. The hero video is
// a file and is not affected.
export const SPEED = 0.7;
export const easeOut: Easing = [0.22, 1, 0.36, 1];
// Nearly linear: an even glide, not a dart and settle.
export const glide: Easing = [0.3, 0.3, 0.7, 0.7];

// STATIC_ENTRANCES (2026-10-27): every screen renders fully laid out on first
// paint, no entrance sequences, word streams, carousel slide-ins or reveals.
// The cube twist on the book screen is not an entrance and is unaffected.
// Flip to false to bring the entrances back.
export const STATIC_ENTRANCES = true;
