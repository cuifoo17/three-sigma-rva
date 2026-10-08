// Graphics model sheet. The style block is the exact text fed to the image
// model; the subject paragraph changes per section.

export const direction = {
  name: "Thread",
  summary:
    "Flat app-brand illustration, Duolingo or Headspace in feel, with a navy diagram as the landscape and teenagers living on it. One thick line tells each section's story.",
};

export const styleBlock = `Flat vector character illustration in the style of a friendly consumer app brand, like Duolingo or Headspace. Plain warm cream background (#F7F5F0), wide 16:9 format.

Style: bold, simple, rounded shapes. No sketch lines, no hatching, no pencil texture, no watercolour. Either clean thick outlines in navy (#0B1F3A) of one uniform weight, or no outlines at all; pick one and keep it. Fills are fully saturated and flat, with one soft shading tone on each shape for depth; no gradients across large areas. Shapes have rounded corners and a slightly chunky, toy-like solidity. Smooth, glossy, modern.

Colours: navy (#0B1F3A), sky blue (#8ECAE6), cream (#F7F5F0) for the ground, and a warm yellow (#FFC845). The diagram is always sky blue and navy. Yellow is the accent: the glowing phone screen, one shirt or pair of shoes, a small highlight, two or three touches per image, never on the diagram itself.

The people: three teenagers, ages 12 to 16, stylised like app mascots: simplified bodies, rounded limbs, slightly larger heads, dot eyes and simple curved mouths, expressive poses. Varied skin tones and hair. Bright, pleased, mid-action. Casual clothes in the palette. About one-third of the frame height, feet fully inside the frame.

Composition: the diagram spans the full width; generous cream space above and below. No text, no words, no UI, no logos.

Do not include: robots, brains, circuit boards, holograms, purple, neon, photorealism, readable screens, adults, classrooms, thin lines, sketchy or hand-drawn texture, 3D rendering with realistic lighting.`;

export const referenceSubject = `Subject: a single thick navy line tells the whole story from left to right. On the left it is a loose tangle, knotted over itself and filled with sky blue. Moving right, the tangle unwinds into one smooth, clean line, like a thread being pulled straight. The line runs the width of the frame and ends on the right at a teenager sitting cross-legged on the ground with a laptop, grinning, holding up a phone with a glowing yellow screen. Along the line, one teenager walks right, pulling the line taut with both hands over one shoulder. One teenager stands near the middle where the tangle becomes straight, looking at the straight part with satisfaction. Nothing else in the frame.`;

export const slots = [
  { name: "Page hero", ratio: "16:9, plus a 4:5 crop for phones", count: 1, note: "The bell curve, redrawn in this style." },
  { name: "Section heroes", ratio: "16:9", count: 2, note: "Logistics (a classroom at the library) and tutoring." },
  { name: "Card art", ratio: "16:9", count: 4, note: "One per outcome card. Same cast, smaller scenes." },
  { name: "Row glyphs", ratio: "1:1", count: 4, note: "One per fit row. Single object, no people." },
  { name: "Pop-up art", ratio: "16:9", count: 4, note: "One per fit pop-up." },
  { name: "Headshot", ratio: "4:5", count: 1, note: "Photograph, not illustration." },
];

export const motionNotes = [
  "Stills first, in Grok or Gemini, from the style block plus one subject paragraph.",
  "Approve the still, then animate it in Higgsfield with image-to-video from that exact file.",
  "One motion sentence per clip: what moves, how slowly, and that it loops cleanly at 5 to 10 seconds.",
  "Pilot one section before generating the full set. Cost line before every batch.",
];
