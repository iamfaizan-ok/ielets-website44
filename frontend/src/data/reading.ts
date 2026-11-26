export type QuestionType = "tfng" | "mcq" | "fill";

export interface ReadingQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface ReadingPassage {
  id: string;
  label: string;
  title: string;
  topic: string;
  recommendedMinutes: number;
  paragraphs: { key: string; text: string }[];
  questions: ReadingQuestion[];
}

export interface PerformancePoint {
  label: string;
  band: number;
  accuracy: number;
}

export type ReportPeriod = "day" | "week" | "month";

export const READING_TIMELINE = [
  { step: "01", title: "Passage 1", meta: "20 min · Factual", active: true },
  { step: "02", title: "Passage 2", meta: "20 min · Analytical", active: false },
  { step: "03", title: "Passage 3", meta: "20 min · Academic", active: false },
  { step: "04", title: "Answers & Report", meta: "Instant Band", active: false },
];

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "urban-forests",
    label: "Passage 1",
    title: "How Urban Micro-Forests Cool Cities",
    topic: "Environment & Urban Design",
    recommendedMinutes: 20,
    paragraphs: [
      {
        key: "A",
        text: "Dense cities absorb solar radiation in asphalt roads and concrete facades, creating urban heat islands that can raise night-time temperatures by up to 4°C compared with surrounding rural areas. To counter this, municipal planners are increasingly planting compact 'micro-forests'—native woodland plots as small as a tennis court.",
      },
      {
        key: "B",
        text: "Developed from the Miyawaki method, these plots pack three to five native saplings per square metre. Because the trees compete for sunlight, they grow up to ten times faster than conventional park plantings and form a multi-layered canopy within three years.",
      },
      {
        key: "C",
        text: "Field measurements in Rotterdam and Tokyo showed that surface temperatures beneath a mature micro-forest canopy dropped by 3.2°C on peak summer afternoons. However, researchers caution that micro-forests cannot replace large city parks for storm-water retention during extreme monsoon rainfall.",
      },
    ],
    questions: [
      {
        id: "q1",
        type: "tfng",
        prompt:
          "Urban heat islands can make city nights warmer than nearby countryside areas.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        answer: "TRUE",
        explanation:
          "Paragraph A states night-time temperatures can rise by up to 4°C compared with surrounding rural areas.",
      },
      {
        id: "q2",
        type: "tfng",
        prompt:
          "Micro-forests require at least one hectare of land to cool a neighbourhood.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        answer: "FALSE",
        explanation:
          "Paragraph A notes plots can be 'as small as a tennis court', contradicting 'at least one hectare'.",
      },
      {
        id: "q3",
        type: "mcq",
        prompt: "Why do trees in a Miyawaki micro-forest grow unusually fast?",
        options: [
          "They are watered with synthetic nutrients every week",
          "Dense planting creates competition for sunlight",
          "Only imported fast-growing species are selected",
        ],
        answer: "Dense planting creates competition for sunlight",
        explanation:
          "Paragraph B explains that packing 3–5 saplings per m² makes trees compete for sunlight and grow faster.",
      },
      {
        id: "q4",
        type: "fill",
        prompt:
          "In Rotterdam and Tokyo, summer surface temperatures fell by ______ °C under a mature canopy. (number)",
        answer: "3.2",
        explanation:
          "Paragraph C gives the exact figure: 'dropped by 3.2°C'.",
      },
      {
        id: "q5",
        type: "tfng",
        prompt:
          "Micro-forests completely eliminate the need for large city parks during extreme rainfall.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        answer: "FALSE",
        explanation:
          "Paragraph C explicitly cautions they 'cannot replace large city parks' during extreme monsoon rainfall.",
      },
    ],
  },
  {
    id: "sleep-memory",
    label: "Passage 2",
    title: "Sleep Spindles and Vocabulary Retention",
    topic: "Cognitive Neuroscience",
    recommendedMinutes: 20,
    paragraphs: [
      {
        key: "A",
        text: "For decades, linguists assumed that repeating new words aloud was the single decisive factor in long-term vocabulary retention. Recent sleep-lab studies suggest that what happens hours after studying—specifically during Stage 2 non-REM sleep—plays an equally critical role.",
      },
      {
        key: "B",
        text: "During this phase, the brain generates brief bursts of electrical activity known as sleep spindles, lasting roughly half a second each. Electroencephalogram (EEG) recordings show that learners with higher spindle density recall significantly more newly learned words the next morning.",
      },
      {
        key: "C",
        text: "Crucially, late-night caffeine intake reduced spindle frequency by 18% in adult participants, even when total sleep duration remained unchanged. Researchers therefore recommend finishing spaced-repetition sessions at least two hours before bedtime.",
      },
    ],
    questions: [
      {
        id: "p2-q1",
        type: "tfng",
        prompt:
          "Sleep spindles occur primarily during Stage 2 non-REM sleep.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        answer: "TRUE",
        explanation:
          "Paragraphs A and B directly link sleep spindles to Stage 2 non-REM sleep.",
      },
      {
        id: "p2-q2",
        type: "mcq",
        prompt:
          "What did EEG recordings reveal about learners with higher spindle density?",
        options: [
          "They slept for shorter total durations",
          "They remembered more new words the next morning",
          "They preferred reading over speaking practice",
        ],
        answer: "They remembered more new words the next morning",
        explanation:
          "Paragraph B states they 'recall significantly more newly learned words the next morning'.",
      },
      {
        id: "p2-q3",
        type: "fill",
        prompt:
          "Late-night caffeine reduced sleep spindle frequency by ______ %. (number)",
        answer: "18",
        explanation: "Paragraph C states 'reduced spindle frequency by 18%'.",
      },
      {
        id: "p2-q4",
        type: "tfng",
        prompt:
          "The study found that older adults benefit more from spaced repetition than teenagers.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        answer: "NOT GIVEN",
        explanation:
          "Age comparisons between older adults and teenagers are not mentioned in the passage.",
      },
    ],
  },
];

export const READING_REPORT_DATA: Record<
  ReportPeriod,
  {
    summaryBand: string;
    accuracy: string;
    avgPace: string;
    completed: string;
    points: PerformancePoint[];
  }
> = {
  day: {
    summaryBand: "7.5",
    accuracy: "84%",
    avgPace: "17m / passage",
    completed: "6 passages",
    points: [
      { label: "Mon", band: 6.5, accuracy: 72 },
      { label: "Tue", band: 7.0, accuracy: 78 },
      { label: "Wed", band: 7.0, accuracy: 80 },
      { label: "Thu", band: 7.5, accuracy: 84 },
      { label: "Fri", band: 7.5, accuracy: 85 },
      { label: "Sat", band: 8.0, accuracy: 89 },
      { label: "Sun", band: 7.5, accuracy: 86 },
    ],
  },
  week: {
    summaryBand: "7.5",
    accuracy: "82%",
    avgPace: "18m / passage",
    completed: "19 passages",
    points: [
      { label: "Week 1", band: 6.5, accuracy: 70 },
      { label: "Week 2", band: 7.0, accuracy: 76 },
      { label: "Week 3", band: 7.5, accuracy: 83 },
      { label: "Week 4", band: 8.0, accuracy: 88 },
    ],
  },
  month: {
    summaryBand: "7.5",
    accuracy: "80%",
    avgPace: "18m / passage",
    completed: "64 passages",
    points: [
      { label: "Aug", band: 6.0, accuracy: 65 },
      { label: "Sep", band: 6.5, accuracy: 73 },
      { label: "Oct", band: 7.0, accuracy: 79 },
      { label: "Nov", band: 7.5, accuracy: 85 },
    ],
  },
};

export const QUESTION_TYPE_STATS = [
  { label: "True / False / Not Given", accuracy: 82 },
  { label: "Matching Headings", accuracy: 76 },
  { label: "Multiple Choice", accuracy: 88 },
  { label: "Summary Completion", accuracy: 84 },
];
