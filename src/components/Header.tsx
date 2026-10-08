"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { nav } from "@/content/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 select-none border-b border-primary/10 bg-background pt-safe-top">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
          onClick={() => setOpen(false)}
        >
          {nav.wordmark}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-base font-bold text-primary/80 hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button href={nav.cta.href} size="sm" onClick={() => setOpen(false)}>
            {nav.cta.label}
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex min-h-touch min-w-touch items-center justify-center rounded-lg text-primary hover:bg-accent/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-accent/60 md:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col overflow-y-auto bg-background px-4 pt-6 pb-safe-bottom md:hidden">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-touch items-center border-b border-primary/10 py-4 text-2xl font-bold tracking-tight text-primary active:opacity-60"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-8">
            <Button
              href={nav.cta.href}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {nav.cta.label}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
