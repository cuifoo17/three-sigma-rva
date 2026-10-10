import Link from "next/link";
import Button from "@/components/Button";
import { nav } from "@/content/site";

// Wordmark and the ask only. No menu or section links: the page is a funnel
// and visitors should scroll it top to bottom.
export default function Header() {
  return (
    <header className="sticky top-0 z-40 select-none border-b border-primary/10 bg-background pt-safe-top">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary"
        >
          {nav.wordmark}
        </Link>
        <Button href={nav.cta.href} size="sm">
          {nav.cta.label}
        </Button>
      </div>
    </header>
  );
}
