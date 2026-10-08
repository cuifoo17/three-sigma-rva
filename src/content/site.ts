// All copy on the site lives here. Placeholders are marked with `pending: true`
// and render in a visibly different style until the founder supplies the text.

export const nav = {
  wordmark: "Three Sigma",
  links: [
    { label: "What they'll learn", href: "#learn" },
    { label: "Logistics", href: "#logistics" },
    { label: "About", href: "#about" },
  ],
  cta: { label: "Book a free call", href: "#book" },
};

export const hero = {
  headline: "Equip your child with top 1% AI fluency.",
  subheadline:
    "A five-week, hands-on class where gifted teens learn to build real websites, apps, and games with AI, and finish with a capstone project they can actually show people.",
};

export const outcomes = {
  header: "What they'll walk away with",
  cards: [
    {
      title: "Build and ship a real mobile app",
      body: "Using Expo Go, students build mobile apps they can open on their own phone and hand to a friend, the same way a professional developer tests their work before releasing it.",
    },
    {
      title: "Websites and apps backed by a live user database",
      body: "Most beginner projects are static pages that don't do anything. Students learn Firebase, a live database used by real companies, so the apps and websites they build can save data, remember users, and respond in real time.",
    },
    {
      title: "How to solve problems with AI, not outsource the thinking.",
      body: "The students who thrive with AI are the ones who know what to ask for and why. We teach the mental frameworks for turning a vague idea into a clear plan, breaking it into pieces, and steering the AI toward a finished product they fully understand.",
    },
    {
      title:
        "Systems thinking and resource allocation, the skills AI can't replace",
      body: "As AI takes over more of the coding, the people who stay valuable are the ones who can see the whole system and decide where to spend limited time, money, and effort. Students practice both by scoping their capstone, making trade-offs, and designing an experience real users would actually want.",
    },
  ],
};

export const logistics = {
  header: "Logistics",
  blocks: [
    {
      title: "How long is the course?",
      items: [
        "5 weeks",
        "2 classes per week, Tuesday and Thursday, 60 minutes each",
        "Separate middle school and high school tracks",
        "Sunday morning make-up classes available",
      ],
    },
    { title: "Class size", items: ["Maximum of 10 students per track"] },
    { title: "Where", items: ["In person at Staples Mill Library"] },
  ],
  closing:
    "Before the first class, we meet with every family one-on-one to walk through the details, answer questions, and make sure the course is the right fit.",
};

export const fit = {
  header: "Is this right for your child?",
  intro:
    "This course is built for students in roughly the top 5% of problem-solving ability. The kids who do best tend to look something like this:",
  rows: [
    {
      lead: "Picks things up fast.",
      body: "Tends to catch on quickly and doesn't need a lot of repetition before they're ready for the next step.",
    },
    {
      lead: "Is a creative problem solver.",
      body: "Enjoys figuring things out and often finds their own way to an answer rather than waiting to be shown.",
    },
    {
      lead: "Has a resilient, go-getter attitude.",
      body: "Willing to try, get it wrong, and try again, which is most of what building software actually is.",
    },
    {
      lead: "Is doing well in challenging coursework.",
      body: "Comfortable in honors or AP classes, has skipped a grade, or is otherwise a step ahead of their grade level.",
    },
  ],
  closing:
    "No coding experience required. Every student is pre-screened for aptitude before enrolling.",
};

export const teacher = {
  header: "About the teacher",
  paragraphs: [
    {
      text: "Hello, I'm Braulio. I'm a Virginia native who went on to study Mandarin at Princeton. I have over 10 years of experience teaching and coaching kids aged 7 through 15.",
    },
    {
      text: "Paragraph 2: self-taught developer, apps on the App Store, built by directing AI.",
      pending: true,
    },
    {
      text: "Paragraph 3: why. The coaching I never had, the job market they're walking into.",
      pending: true,
    },
  ],
};

export const tutoring = {
  header: { text: "1-on-1 tutoring headline", pending: true },
  body: { text: "Short description of 1-on-1 tutoring.", pending: true },
};

export const book = {
  header: "Let's chat to see if AI Prodigy Builder is a good fit",
  fields: {
    parent: "Parent's name",
    child: "Child's name",
    email: "Email",
    phone: "Phone number",
    // Optional: one tap picks a cohort from the enrolling table, so the
    // call starts at "which week", not "which days".
    days: "Preferred days",
    background:
      "Please include any relevant background about your child, past experiences, interests, suitability for this course etc",
  },
  submit: "Submit",
};

export const footer = {
  email: { text: "email@example.com", pending: true },
  location: { text: "Richmond, Virginia", pending: true },
  social: { text: "Social link", pending: true },
  legal: "© 2026 Three Sigma Coaching",
};
