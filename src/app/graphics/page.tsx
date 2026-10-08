import type { Metadata } from "next";
import Image from "next/image";
import Section, { SectionTitle } from "@/components/Section";
import {
  direction,
  motionNotes,
  referenceSubject,
  slots,
  styleBlock,
} from "@/content/graphics";
import reference from "./reference.png";

export const metadata: Metadata = { title: "Graphics · Three Sigma Coaching" };

export default function GraphicsPage() {
  return (
    <>
      <Section className="pt-10 md:pt-16">
        <p className="text-xs font-bold uppercase tracking-widest text-primary/50">
          Direction
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-6xl">
          {direction.name}
        </h1>
        <p className="mt-5 max-w-xl text-lg">{direction.summary}</p>
        <Image
          src={reference}
          alt="Reference illustration: three teenagers along a thread that unwinds from a tangle into a straight line, ending at a kid with a laptop and a glowing phone"
          sizes="(min-width: 1152px) 72rem, 100vw"
          preload
          className="mt-10 h-auto w-full rounded-2xl"
        />
      </Section>

      <Section tone="white">
        <SectionTitle>Model sheet</SectionTitle>
        <p className="mt-5 max-w-xl text-lg">
          The exact text given to the image model. Only the subject paragraph
          changes between sections.
        </p>
        <pre className="mt-8 max-w-3xl whitespace-pre-wrap rounded-2xl bg-background p-6 font-sans text-base leading-relaxed md:p-8">
          {styleBlock}
        </pre>
        <pre className="mt-4 max-w-3xl whitespace-pre-wrap rounded-2xl border border-dashed border-accent bg-accent/20 p-6 font-sans text-base leading-relaxed md:p-8">
          {referenceSubject}
        </pre>
      </Section>

      <Section>
        <SectionTitle>Slots</SectionTitle>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {slots.map((s) => (
            <div key={s.name} className="rounded-2xl border border-primary/10 bg-surface p-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xl font-bold tracking-tight">{s.name}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/50">
                  ×{s.count}
                </p>
              </div>
              <p className="mt-1 text-sm text-primary/70">{s.ratio}</p>
              <p className="mt-3 text-base">{s.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionTitle>From still to motion</SectionTitle>
        <ol className="mt-6 max-w-2xl list-decimal space-y-2 pl-5 text-base">
          {motionNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ol>
      </Section>
    </>
  );
}
