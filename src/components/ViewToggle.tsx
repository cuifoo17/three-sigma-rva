"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Bottom-right switch between the live site and the pages that document its
// system, so the two are always seen side by side and can't drift apart.
// Must stay narrower than a phone: a fixed element wider than the screen makes
// mobile browsers widen the layout viewport, and vertical swipes start drifting sideways.
const views = [
  { label: "Screens", href: "/" },
  { label: "Website", href: "/website" },
  { label: "Deck", href: "/deck" },
  { label: "System", href: "/system" },
  { label: "Graphics", href: "/graphics" },
];

export default function ViewToggle() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="View"
      className="fixed right-4 bottom-4 z-30 mb-safe-bottom flex select-none gap-1 rounded-full border border-primary/10 bg-surface p-1 shadow-lg"
    >
      {views.map((v) => {
        const active = pathname === v.href;
        return (
          <Link
            key={v.href}
            href={v.href}
            className={`flex min-h-10 items-center rounded-full px-2 text-[0.6875rem] font-bold uppercase tracking-wide transition active:scale-[0.97] md:px-4 md:text-xs md:tracking-widest ${
              active
                ? "bg-primary text-background"
                : "text-primary/70 hover:bg-background"
            }`}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
