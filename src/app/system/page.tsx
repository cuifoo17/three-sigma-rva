import type { Metadata } from "next";
import Button from "@/components/Button";
import Section, { SectionTitle } from "@/components/Section";
import {
  buttonRules,
  colors,
  motionRules,
  sectionRules,
  shapeRules,
  spacingRules,
  typeRules,
  typeScale,
} from "@/content/system";

export const metadata: Metadata = { title: "System · Three Sigma Coaching" };

function Rules({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 max-w-2xl space-y-2 text-base">
      {items.map((r) => (
        <li key={r} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
          <span>{r}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SystemPage() {
  return (
    <>
      <Section className="pt-10 md:pt-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">The system</h1>
        <p className="mt-5 max-w-xl text-lg">
          Every token and rule the website is built from, rendered with the
          same code the website uses.
        </p>
      </Section>

      <Section tone="white">
        <SectionTitle>Colour</SectionTitle>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {colors.map((c) => (
            <div key={c.hex} className="overflow-hidden rounded-2xl border border-primary/10">
              <div className={`${c.className} aspect-square`} />
              <div className="p-4">
                <p className="font-bold">{c.name}</p>
                <p className="text-sm text-primary/70">{c.role}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary/50">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle>Type</SectionTitle>
        <Rules items={typeRules} />
        <div className="mt-10 divide-y divide-primary/10">
          {typeScale.map((t) => (
            <div key={t.role} className="grid gap-2 py-6 md:grid-cols-[10rem_1fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/50">{t.role}</p>
                <p className="mt-1 text-sm text-primary/70">{t.note}</p>
              </div>
              <p className={`${t.className} text-balance`}>
                Equip your child with top 1% AI fluency.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionTitle>Spacing and shape</SectionTitle>
        <Rules items={spacingRules} />
        <Rules items={shapeRules} />
        <div className="mt-8 flex flex-wrap items-end gap-4">
          <div className="size-24 rounded-2xl bg-accent" />
          <div className="size-24 rounded-3xl bg-accent" />
          <div className="h-12 w-40 rounded-xl border border-primary/15 bg-surface" />
          <div className="h-12 w-40 rounded-full bg-yellow" />
        </div>
      </Section>

      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <Rules items={buttonRules} />
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="#">Book a free call</Button>
          <Button href="#" variant="secondary">Submit</Button>
          <Button href="#" size="sm">Book a free call</Button>
        </div>
      </Section>

      <Section tone="white">
        <SectionTitle>Sections and motion</SectionTitle>
        <Rules items={sectionRules} />
        <Rules items={motionRules} />
      </Section>
    </>
  );
}
