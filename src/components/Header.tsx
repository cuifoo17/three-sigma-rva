"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import Button from "@/components/Button";
import { track } from "@/lib/analytics";
import { nav } from "@/content/site";

// Wordmark and the ask only. No menu or section links: the page is a funnel
// and visitors should scroll it top to bottom.
//
// Phones: wordmark at the left gutter, ask at the right. From md the row is a
// three-column grid (1fr auto 1fr) so the wordmark sits in the true centre of
// the header while the ask keeps the right edge.
//
// The ask scrolls to the form without putting #book in the address bar. A
// plain anchor would leave the hash behind, and the next refresh would land
// on the form instead of the top. The href stays as the no-JS fallback.
// Instant, not smooth: iOS Safari's smooth scroll gets caught by the
// mandatory snap and stops on the next card instead of the target.
// Copy with "\n" stacks on phones and runs as one line from md.
function Lines({ text }: { text: string }) {
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={line} className="block md:inline">
      {line}
      {i < lines.length - 1 && <span className="hidden md:inline"> </span>}
    </span>
  ));
}

export default function Header() {
  const goToForm = (e: MouseEvent<HTMLElement>) => {
    const id = nav.cta.href.replace(/^#/, "");
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    track("cta");
    target.scrollIntoView({ behavior: "auto", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 select-none border-b border-primary/10 bg-background pt-safe-top">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:px-8">
        <span aria-hidden="true" className="hidden md:block" />
        <Link
          href="/"
          className="text-xl leading-tight font-bold tracking-tight text-primary md:text-center"
        >
          <Lines text={nav.wordmark} />
        </Link>
        <Button href={nav.cta.href} size="sm" onClick={goToForm} className="text-center leading-tight md:justify-self-end">
          <span>
            <Lines text={nav.cta.label} />
          </span>
        </Button>
      </div>
    </header>
  );
}
