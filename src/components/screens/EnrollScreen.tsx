import Reveal from "@/components/Reveal";
import { ScreenTitle } from "@/components/screens/Screen";
import { enrolling } from "@/content/deck";

// Logistics as a status: the cohort table is the hero, the FAQ is five lines.
// Sits on the navy screen, so text is the cream background colour.
export default function EnrollScreen() {
  return (
    <Reveal>
      <ScreenTitle>{enrolling.header}</ScreenTitle>
      <p className="mt-2 text-base text-background/75 md:text-lg">
        {enrolling.sub.before}
        <a
          href={enrolling.sub.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-background/40 underline-offset-4 hover:text-background"
        >
          {enrolling.sub.address}
        </a>
        {enrolling.sub.after}
      </p>

      {/* Four columns fit a phone without sideways scroll; the wrapper
          scrolls as a fallback for very large text sizes. */}
      <div className="mt-6 overflow-x-auto overscroll-x-contain">
        <table className="w-full border-collapse text-left text-base">
          <thead>
            <tr className="text-xs font-bold tracking-wide text-background/60 uppercase">
              {enrolling.columns.map((c) => (
                <th key={c} scope="col" className="pb-2 pr-3 font-bold last:pr-0 last:text-right">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrolling.cohorts.map((c) => (
              <tr key={c.days} className="border-t border-background/15">
                <th scope="row" className="py-3 pr-3 font-bold whitespace-nowrap">
                  {c.days}
                </th>
                <td className="py-3 pr-3">{c.time}</td>
                <td className="py-3 pr-3 whitespace-nowrap">{c.dates}</td>
                <td className="py-3 text-right">
                  <span className="inline-block min-w-8 rounded-full bg-yellow px-2.5 py-0.5 text-center text-sm font-bold text-primary">
                    {c.seats}/{enrolling.capacity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-8 space-y-2 text-base text-background/85">
        {enrolling.faq.map((line) => (
          <li key={line} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
