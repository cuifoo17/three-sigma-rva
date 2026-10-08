import type { ReactNode } from "react";

type Tone = "cream" | "white" | "navy" | "yellow";

const tones: Record<Tone, string> = {
  cream: "bg-background text-primary",
  white: "bg-surface text-primary",
  navy: "bg-primary text-background",
  yellow: "bg-yellow text-primary",
};

type Props = {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export default function Section({
  id,
  tone = "cream",
  className = "",
  children,
}: Props) {
  return (
    <section
      id={id}
      className={`snap-start overflow-x-clip px-4 py-16 md:px-8 md:py-24 ${tones[tone]} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-balance md:text-5xl">
      {children}
    </h2>
  );
}
