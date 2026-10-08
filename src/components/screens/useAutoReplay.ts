import { useEffect, type RefObject } from "react";

// Shared behaviour for the deck's inline videos: start the moment the page is
// up (even if autoplay was blocked before hydration), hold the last frame when
// done (no loop), and replay from the top each time the card is swiped back
// into view. The first intersection is the initial load, where autoplay
// already has it going, so only a return after leaving triggers a restart.
export default function useAutoReplay(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (v.paused && !v.ended) v.play().catch(() => {});

    let away = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (away) {
            v.currentTime = 0;
            v.play().catch(() => {});
          }
          away = false;
        } else {
          away = true;
          v.pause();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [ref]);
}
