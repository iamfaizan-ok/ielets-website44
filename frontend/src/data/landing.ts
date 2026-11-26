export interface SkillModule {
  id: string;
  title: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  href: string;
}

export interface Testimonial {
  name: string;
  score: string;
  quote: string;
  initials: string;
  avatarBg: string;
}

export interface ResourceItem {
  title: string;
  meta: string;
  href: string;
}

export const PRACTICE_ITEMS = [
  {
    id: "reading",
    label: "Reading",
    href: "#modules",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
  },
  {
    id: "listening",
    label: "Listening",
    href: "#modules",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
  },
  {
    id: "writing",
    label: "Writing",
    href: "#practice",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
  },
  {
    id: "speaking",
    label: "Speaking",
    href: "#practice",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
  },
];

export const NAV_LINKS = [
  { label: "Daily Mock Exam", href: "#practice" },
  { label: "AI Conversation", href: "#practice" },
  { label: "Study Guides", href: "#resources" },
  { label: "My History", href: "#challenge" },
  { label: "Pricing", href: "#get-started" },
];

export const HERO_FEATURES = [
  {
    title: "Built around IELTS",
    description: "Listening, Reading, Writing & Speaking.",
  },
  {
    title: "Practice with guidance",
    description: "Smart feedback on every task.",
  },
  {
    title: "Learn at your own pace",
    description: "5 minutes a day, or a full mock.",
  },
];

export const SKILL_MODULES: SkillModule[] = [
  {
    id: "listening",
    title: "Listening",
    description:
      "Train your ear across accents with real exam-style audio and transcripts.",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    href: "#practice",
  },
  {
    id: "reading",
    title: "Reading",
    description:
      "Master skimming, scanning, and timed passages for Academic & General.",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    href: "#practice",
  },
  {
    id: "writing",
    title: "Writing",
    description:
      "Structure Task 1 & Task 2 essays clearly with band-focused feedback.",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
    href: "#practice",
  },
  {
    id: "speaking",
    title: "Speaking",
    description:
      "Build fluency and confidence with guided Part 1–3 speaking prompts.",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    href: "#practice",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Amina R.",
    score: "Band 8.0",
    quote:
      "Practicing 15 minutes every morning made Speaking feel natural instead of stressful.",
    initials: "AR",
    avatarBg: "bg-emerald-100 text-emerald-800",
  },
  {
    name: "Daniel K.",
    score: "Band 7.5",
    quote:
      "I stopped overthinking Writing Task 2. The structured feedback showed exactly what to fix.",
    initials: "DK",
    avatarBg: "bg-amber-100 text-amber-800",
  },
  {
    name: "Sara M.",
    score: "Band 8.5",
    quote:
      "Everything is calm and focused. No clutter—just the right exercises every single day.",
    initials: "SM",
    avatarBg: "bg-sky-100 text-sky-800",
  },
];

export const COMPACT_RESOURCES: ResourceItem[] = [
  {
    title: "IELTS starter guide",
    meta: "6 min read · Basics & scoring",
    href: "#get-started",
  },
  {
    title: "Vocabulary & flashcards",
    meta: "5 min read · High-band phrases",
    href: "#get-started",
  },
  {
    title: "Pronunciation & shadowing",
    meta: "4 min read · Speaking clarity",
    href: "#get-started",
  },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Practice",
    links: ["Listening", "Reading", "Writing", "Speaking"],
  },
  {
    heading: "Resources",
    links: ["IELTS Guide", "Study Tips", "Vocabulary", "Daily Challenge"],
  },
  {
    heading: "Company",
    links: ["About", "Pricing", "Contact", "Privacy & Terms"],
  },
  {
    heading: "Follow",
    links: ["Instagram", "YouTube", "LinkedIn", "Newsletter"],
  },
];
