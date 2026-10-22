"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { heroVideo } from "@/content/deck";
import useAutoReplay from "@/components/screens/useAutoReplay";
import heroEnd from "@/app/hero-end.jpg";

// The hero as a video: headline and bell curve are both in the
// frames, so the copy lives only in the screen-reader text. Reduced motion
// gets the last frame as a still instead, and so does a browser that refuses
// to autoplay (iOS Low Power Mode), rather than a blank frame.
// Plain <video> paths don't get the basePath that next/image and Link do,
// so the GitHub Pages prefix is added by hand.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);
  const onBlocked = useCallback(() => setBlocked(true), []);
  useAutoReplay(ref, onBlocked);

  return (
    // Full-bleed on phones: the video carries its own padding, so pull it
    // back over the screen's 1rem gutters. Desktop keeps the centred column.
    <div className="-mx-4 md:mx-0">
      <h1 className="sr-only">{heroVideo.headline}</h1>
      <video
        ref={ref}
        src={`${base}/hero.mp4`}
        poster={`${base}/hero-poster.png`}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        // aspect-[1260/1988] is the file's own ratio: it reserves the full
        // height from first paint, so the screens below never sit inside the
        // viewport (and fire their entrance sequences) while the video loads.
        className={`mx-auto aspect-[1260/1988] h-auto w-full object-contain md:max-h-[calc(100dvh-9.5rem)] motion-reduce:hidden ${blocked ? "hidden" : ""}`}
      />
      <Image
        src={heroEnd}
        alt=""
        aria-hidden="true"
        sizes="(min-width: 768px) 42rem, 100vw"
        className={`mx-auto h-auto w-full object-contain md:max-h-[calc(100dvh-9.5rem)] motion-reduce:block ${blocked ? "block" : "hidden"}`}
      />
    </div>
  );
}
