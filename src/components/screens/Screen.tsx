import type { CSSProperties, ReactNode, Ref } from "react";

// The in-between: the website's flat colour sections, but each one is exactly
// one phone screen tall and snaps into place like a deck card. Content sits
// between the sticky header and the bottom toggle. fill={false} lets a
// section grow past one screen (the form), snapping at its top instead.
// ref/style/overlay exist for the book screen, which locks its height and lays
// the cube tiles over the whole section while it twists.
type Tone = "cream" | "white" | "navy" | "yellow" | "sky";

const tones: Record<Tone, string> = {
  cream: "bg-background text-primary",
  white: "bg-surface text-primary",
  navy: "bg-primary text-background",
  yellow: "bg-yellow text-primary",
  sky: "bg-accent text-primary",
};

export default function Screen({
  id,
  tone = "cream",
  fill = true,
  ref,
  style,
  overlay,
  children,
}: {
  id?: string;
  tone?: Tone;
  fill?: boolean;
  ref?: Ref<HTMLElement>;
  style?: CSSProperties;
  overlay?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      ref={ref}
      style={style}
      className={`relative flex snap-always px-4 pt-18 pb-20 md:px-8 ${tones[tone]} ${
        fill ? "h-dvh snap-center" : "min-h-dvh snap-start"
      } items-center justify-center`}
    >
      <div className="w-full max-w-xl md:max-w-2xl">{children}</div>
      {overlay}
    </section>
  );
}

export function ScreenTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl font-bold tracking-tight text-balance md:text-4xl">
      {children}
    </h2>
  );
}
