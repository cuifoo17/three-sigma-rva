import brain from "@/app/glyphs/brain.png";
import toolbox from "@/app/glyphs/toolbox.png";
import phone from "@/app/glyphs/phone.png";

// Copy for the card deck: every section cut to what fits one phone screen.
// Detail that didn't fit moved into the row pop-ups. Source of truth for the
// long form stays in site.ts; pending items keep their pending markers.

import { nav, tutoring, book, footer } from "@/content/site";

export { nav, book, footer, tutoring };

// Book screen only: replaces the form once it's sent (after the cube twist).
export const deckBook = {
  thanks:
    "Thanks for the info, I'll be personally reaching out to see if the AI prodigy builder is a good fit for your child.",
};

export const deckHero = {
  headline: "In the right hands, AI can do wonders.",
  sub: "Over five weeks, in person, your child will learn to direct AI rather than lean on it. By the end they'll be ahead of the curve, and ready to thrive in a world built on AI.",
};

// Exact copy baked into the frames of /hero.mp4 (the Screens hero). Read by
// screen readers only; change it when the video changes.
export const heroVideo = {
  headline: "In the right hands, AI can do wonders",
  sub: "Over five weeks, in person, your child will learn to direct AI rather than lean on it. By the end they'll be creating websites, apps, and videos that they fully understand from top to bottom.",
};

export const deckTeacher = {
  header: "About the teacher",
  points: [
    "I'm Braulio, a Virginia native who studied Mandarin at Princeton. I have over 10 years of experience teaching and coaching kids of all ages.",
    "Over the past year I've published 4 apps to the App Store and helped small business owners improve their online presence.",
    "My goal is to teach your child how to think like a developer and be comfortable using AI to augment their natural abilities.",
  ],
};

export const deckOutcomes = {
  header: "What they'll walk away with",
  // Screens page only: two-line title (the newline is a forced break) with the
  // header demoted to a subtitle.
  title: "Most teens lean on AI.\nYours will command it.",
  sub: "What they'll walk away with:",
  rows: [
    {
      title: "The skills AI can't replace",
      sub: "Systems thinking and product taste.",
      glyph: brain,
      body: "As AI takes over more of the manual and entry-level work, the people who'll stay valuable can see the whole system and decide where to spend limited time, money, and effort. Students develop both skills by carefully planning a capstone project and learning how and where to make trade-offs in their designs.",
    },
    {
      title: "Use AI as a tool, not a crutch",
      sub: "Directing vs. blindly following.",
      glyph: toolbox,
      body: "The students who thrive with AI know what to ask for and why. We teach the frameworks for turning a vague idea into a clear plan, breaking it into pieces, and steering the AI toward a product they fully understand.",
    },
    {
      title: "A real app on their own phone",
      sub: "Backed by a live database.",
      glyph: phone,
      body: "Using Expo Go, students build mobile apps they can open on their own phone and hand to a friend. Behind it sits Firebase, a live database used by real companies, so what they build can save data, remember users, and respond in real time.",
    },
  ],
};

export const deckLogistics = {
  header: "Logistics",
  rows: [
    {
      title: "5 weeks, Tuesdays and Thursdays",
      body: "Two 60-minute classes a week, with separate middle school and high school tracks. Sunday morning make-up classes are available.",
    },
    {
      title: "Maximum of 10 students per track",
      body: "Small on purpose, so every student gets real attention from the instructor and nobody coasts.",
    },
    {
      title: "In person at Staples Mill Library",
      body: "Before the first class, we meet with every family one-on-one to walk through the details, answer questions, and make sure the course is the right fit.",
    },
  ],
};

// Screens-page logistics: one status line, the cohort table, short FAQ.
// Seats are hand-edited until enrollment moves to a database.
export const enrolling = {
  header: "Now enrolling for Nov 10",
  sub: "Classes are at Staples Mill Library",
  columns: ["Days", "Time", "Dates", "Seats left"],
  cohorts: [
    { days: "Mon + Wed", time: "5:00 to 6:00", dates: "Nov 9 to Dec 16", seats: 10 },
    { days: "Tue + Thu", time: "5:00 to 6:00", dates: "Nov 10 to Dec 15", seats: 10 },
    { days: "Fri + Sat", time: "Fri 5:00, Sat 10:00", dates: "Nov 13 to Dec 19", seats: 10 },
  ],
  faq: [
    "60 minutes, twice a week, five weeks.",
    "No coding background needed.",
    "Missed a class? Sunday make-ups.",
    "$1,000 for the ten sessions.",
    "Every student is screened. We'll go over what we look for on the call.",
  ],
};

export const deckFit = {
  header: "Is this right for your child?",
  // The newline is a forced break on the screens page; elsewhere it collapses to a space.
  intro: "The course is designed for the top 5% of\nproblem solvers. The kids who do best:",
  rows: [
    {
      title: "Pick things up quickly",
      body: "Tend to catch on quickly and don't need a lot of repetition before they're ready for the next step.",
    },
    {
      title: "Solve problems creatively",
      body: "Enjoy figuring things out and often find their own way to an answer rather than waiting to be shown.",
    },
    {
      title: "Try, fail, and try again",
      body: "Willing to get it wrong and go again, which is most of what building software actually is.",
    },
    {
      title: "Excel in difficult classes",
      body: "Comfortable in honors or AP classes, have skipped a grade, or are otherwise a step ahead of their grade level.",
    },
  ],
  closing: "No coding experience required. Every student is pre-screened for aptitude.",
};
