"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import Button from "@/components/Button";
import { nav } from "@/content/site";

// Wordmark and the ask only. No menu or section links: the page is a funnel
// and visitors should scroll it top to bottom.
//
// The ask scrolls to the form without putting #book in the address bar. A
// plain anchor would leave the hash behind, and the next refresh would land
// on the form instead of the top. The href stays as the no-JS fallback.
// Instant, not smooth: iOS Safari's smooth scroll gets caught by the
// mandatory snap and stops on the next card instead of the target.
export default function Header() {
  const goToForm = (e: MouseEvent<HTMLElement>) => {
    const id = nav.cta.href.replace(/^#/, "");
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "auto", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 select-none border-b border-primary/10 bg-background pt-safe-top">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          {nav.wordmark}
        </Link>
        <Button href={nav.cta.href} size="sm" onClick={goToForm}>
          {nav.cta.label}
        </Button>
      </div>
    </header>
  );
}
