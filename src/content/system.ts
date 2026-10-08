// The design system as data, so the /system page and the site stay in step.

export const colors = [
  { name: "Cream", role: "Background", hex: "#F7F5F0", className: "bg-background" },
  { name: "White", role: "Surface", hex: "#FFFFFF", className: "bg-surface" },
  { name: "Navy", role: "Primary", hex: "#0B1F3A", className: "bg-primary" },
  { name: "Sky", role: "Accent", hex: "#8ECAE6", className: "bg-accent" },
  { name: "Yellow", role: "Accent, warm. The ask.", hex: "#FFC845", className: "bg-yellow" },
];

export const typeRules = [
  "One typeface: Instrument Sans, weights 400 and 700.",
  "Headlines left-aligned and bold, never centered, never light.",
  "Three sizes do the work: display, title, body. Labels are the only exception.",
  "One breakpoint override per role.",
];

export const typeScale = [
  { role: "Display", className: "text-4xl md:text-6xl font-bold tracking-tight", note: "h1, one per page" },
  { role: "Section title", className: "text-3xl md:text-5xl font-bold tracking-tight", note: "h2" },
  { role: "Title", className: "text-2xl font-bold tracking-tight", note: "cards, pop-ups" },
  { role: "Lead", className: "text-lg md:text-xl", note: "subheadlines, closing lines" },
  { role: "Body", className: "text-base", note: "paragraphs, never below 1rem" },
  { role: "Label", className: "text-xs font-bold uppercase tracking-widest", note: "placeholders, toggle" },
];

export const spacingRules = [
  "Side gutters: 1rem on phone, 2rem from md. Content capped at 72rem.",
  "Section padding: 4rem on phone, 6rem from md.",
  "Inside a section, stacks step 1.25rem / 2rem / 2.5rem. Nothing in between.",
  "Grids: 1 column on phone, 2 or 3 from md, gap 1.5rem to 2rem.",
];

export const shapeRules = [
  "Cards, media and pop-ups: 1rem radius (rounded-2xl); pop-ups 1.5rem.",
  "Buttons and the view toggle: full pill.",
  "Inputs: 0.75rem radius, 1px border at 15% navy.",
  "Hairlines are 1px navy at 10%.",
];

export const buttonRules = [
  "Primary: yellow pill, navy bold label. One per section. Always the same words: Book a free call.",
  "Secondary: navy outline pill. Used only where a primary already exists on screen.",
  "Minimum hit height 2.75rem; pressed state scales to 0.98.",
];

export const motionRules = [
  "Sections fade and rise 1.5rem as they enter, once. 600ms, ease-out.",
  "Nothing animates in under 400ms except pressed states.",
  "Reduced-motion users get the static page.",
  "Scroll-linked motion (the thread drawing itself) is reserved for the real art.",
];

export const sectionRules = [
  "Backgrounds alternate cream and white. One navy block (logistics), one yellow block (the ask).",
  "Every section is one thought: title, paragraph, media, call to action.",
  "Secondary information lives in a pop-up or carousel, never a second paragraph.",
];
