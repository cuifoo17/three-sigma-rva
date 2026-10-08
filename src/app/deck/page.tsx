import Image from "next/image";
import BookForm from "@/components/BookForm";
import Button from "@/components/Button";
import Backdrop from "@/components/deck/Backdrop";
import Card, { CardTitle } from "@/components/deck/Card";
import { PendingText } from "@/components/Placeholder";
import Rows from "@/components/Rows";
import {
  book,
  deckFit,
  deckHero,
  deckLogistics,
  deckOutcomes,
  deckTeacher,
  footer,
  nav,
  tutoring,
} from "@/content/deck";
import headshot from "../headshot.png";
import heroImage from "../hero.jpg";

export default function Deck() {
  return (
    <div data-deck="glass">
      <Backdrop art={heroImage} />

      {/* 1. Hero: sharp art behind, glass card at the bottom of the screen */}
      <Card align="end">
        <h1 className="text-3xl font-bold tracking-tight text-balance md:text-5xl">
          {deckHero.headline}
        </h1>
        <p className="mt-4 text-base md:text-lg">{deckHero.sub}</p>
      </Card>

      {/* 2. About the teacher */}
      <Card id="about">
        <div className="whitespace-nowrap">
          <CardTitle>{deckTeacher.header}</CardTitle>
        </div>
        {/* Floated after the title and pulled up into its row: the title keeps
            one line, the cut-out's transparent corner sits beside it, and the
            copy starts below it. */}
        <Image
          src={headshot}
          alt="Braulio, the instructor"
          sizes="(min-width: 768px) 18rem, 11rem"
          className="float-right -mt-2 -mr-3 mb-2 ml-3 size-48 md:mr-0 md:-mt-8 md:size-80"
        />
        <ul className="clear-both space-y-3 pt-5 text-base md:text-lg">
          {deckTeacher.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2.5 size-2 shrink-0 rounded-full bg-primary"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 3. What they'll walk away with */}
      <Card id="learn">
        <CardTitle>{deckOutcomes.header}</CardTitle>
        <div className="mt-5">
          <Rows compact rows={deckOutcomes.rows} />
        </div>
      </Card>

      {/* 4. Logistics */}
      <Card id="logistics">
        <CardTitle>{deckLogistics.header}</CardTitle>
        <div className="mt-5">
          <Rows compact rows={deckLogistics.rows} />
        </div>
      </Card>

      {/* 5. Is this right for your child? */}
      <Card>
        <CardTitle>{deckFit.header}</CardTitle>
        <p className="mt-2 text-base md:text-lg">{deckFit.intro}</p>
        <div className="mt-3">
          <Rows compact rows={deckFit.rows} />
        </div>
        <p className="mt-3 text-sm font-bold">{deckFit.closing}</p>
      </Card>

      {/* 6. 1-on-1 tutoring */}
      <Card>
        <CardTitle>
          <PendingText text={tutoring.header.text} />
        </CardTitle>
        <p className="mt-4 text-base md:text-lg">
          <PendingText text={tutoring.body.text} />
        </p>
        <div className="mt-6">
          <Button href={nav.cta.href}>{nav.cta.label}</Button>
        </div>
      </Card>

      {/* 7. Book a free call: natural height so the keyboard doesn't fight the snap */}
      <Card id="book" snap={false} tone="yellow">
        <CardTitle>{book.header}</CardTitle>
        <div className="mt-5">
          <BookForm />
        </div>
        <p className="mt-8 text-xs text-primary/60">
          {nav.wordmark} · <PendingText text={footer.email.text} /> ·{" "}
          <PendingText text={footer.location.text} /> · {footer.legal}
        </p>
      </Card>
    </div>
  );
}
