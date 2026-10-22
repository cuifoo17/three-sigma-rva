// Meta Pixel for the Three Sigma Coaching dataset (Events Manager, Origamies LLC).
// Base code loads from MetaPixel; the site fires one conversion, Lead, when HQ
// confirms a consultation booking. That is the event the ads optimize toward.

export const PIXEL_ID = "1129891296211212";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/** Fires the Lead standard event. Safe to call when the pixel is blocked. */
export function pixelLead() {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", "Lead");
  } catch {
    // Ad blockers can stub fbq; booking must never depend on the pixel.
  }
}
