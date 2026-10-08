import Image from "next/image";
import BookForm from "@/components/BookForm";
import Button from "@/components/Button";
import Rows from "@/components/Rows";
import { ArtSlot, PendingText } from "@/components/Placeholder";
import Reveal from "@/components/Reveal";
import Section, { SectionTitle } from "@/components/Section";
import {
  book,
  fit,
  footer,
  hero,
  logistics,
  nav,
  outcomes,
  teacher,
  tutoring,
} from "@/content/site";
import heroImage from "@/app/hero.jpg";

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <Section tone="cream" className="pt-10 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance md:text-6xl">
              {hero.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg md:text-xl">{hero.subheadline}</p>
            <div className="mt-8">
              <Button href={nav.cta.href}>{nav.cta.label}</Button>
            </div>
          </div>
          <div>
            <Image
              src={heroImage}
              alt="Bell curve with the far right tail highlighted"
              sizes="(min-width: 768px) 50vw, 100vw"
              preload
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </div>
      </Section>

      {/* 2. About the teacher */}
      <Section id="about" tone="white">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <Reveal>
            <ArtSlot label="Headshot" ratio="portrait" className="bg-background" />
          </Reveal>
          <Reveal delay={0.1}>
            <SectionTitle>{teacher.header}</SectionTitle>
            <div className="mt-6 space-y-4 text-lg">
              {teacher.paragraphs.map((p) => (
                <p key={p.text}>
                  {p.pending ? <PendingText text={p.text} /> : p.text}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 3. What they'll walk away with */}
      <Section id="learn" tone="cream">
        <Reveal>
          <SectionTitle>{outcomes.header}</SectionTitle>
        </Reveal>
        <Reveal className="mt-10">
          <Rows rows={outcomes.cards} />
        </Reveal>
      </Section>

      {/* 4. Logistics */}
      <Section id="logistics" tone="navy">
        <Reveal>
          <SectionTitle>{logistics.header}</SectionTitle>
        </Reveal>
        <Reveal className="mt-10">
          <ArtSlot
            label="Classroom at the library"
            className="border-accent/60 bg-accent/15 text-background"
          />
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {logistics.blocks.map((block, i) => (
            <Reveal key={block.title} delay={i * 0.05}>
              <h3 className="text-xl font-bold tracking-tight">{block.title}</h3>
              <ul className="mt-3 space-y-2 text-base text-background/85">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12">
          <p className="max-w-3xl text-lg">{logistics.closing}</p>
        </Reveal>
      </Section>

      {/* 5. Is this right for your child? */}
      <Section tone="white">
        <Reveal>
          <SectionTitle>{fit.header}</SectionTitle>
          <p className="mt-5 max-w-2xl text-lg">{fit.intro}</p>
        </Reveal>
        <Reveal className="mt-8">
          <Rows
            columns={2}
            rows={fit.rows.map((r) => ({ title: r.lead, body: r.body }))}
          />
        </Reveal>
        <Reveal className="mt-8">
          <p className="max-w-2xl text-base font-bold">{fit.closing}</p>
        </Reveal>
      </Section>

      {/* 6. 1-on-1 tutoring */}
      <Section tone="cream">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <Reveal>
            <SectionTitle>
              <PendingText text={tutoring.header.text} />
            </SectionTitle>
            <p className="mt-5 max-w-xl text-lg">
              <PendingText text={tutoring.body.text} />
            </p>
            <div className="mt-8">
              <Button href={nav.cta.href}>{nav.cta.label}</Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ArtSlot label="Tutoring art" />
          </Reveal>
        </div>
      </Section>

      {/* 7. Book a free call */}
      <Section id="book" tone="yellow">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <Reveal>
            <SectionTitle>{book.header}</SectionTitle>
          </Reveal>
          <Reveal delay={0.1}>
            <BookForm />
          </Reveal>
        </div>
      </Section>

      <footer className="border-t border-primary/10 bg-background px-4 py-10 pb-24 md:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xl font-bold tracking-tight">{nav.wordmark}</p>
            <p className="mt-2 text-sm text-primary/70">
              <PendingText text={footer.email.text} />
              {" · "}
              <PendingText text={footer.location.text} />
              {" · "}
              <PendingText text={footer.social.text} />
            </p>
          </div>
          <p className="text-sm text-primary/60">{footer.legal}</p>
        </div>
      </footer>
    </>
  );
}
