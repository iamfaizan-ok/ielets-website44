export interface WritingTestItem {
  id: string;
  book: string;
  testNumber: number;
  category: "Academic" | "General";
  task1Type: string;
  task1Prompt: string;
  task2Type: string;
  task2Prompt: string;
  sampleOutline: string;
}

export type WritingReportPeriod = "day" | "week" | "month";

export interface WritingBookSeries {
  name: string;
  featured?: boolean;
  description: string;
}

export const WRITING_BOOK_SERIES: WritingBookSeries[] = [
  {
    name: "Cambridge Academic",
    featured: true,
    description:
      "Authentic past-paper style Academic Writing tasks matching the real exam format and difficulty.",
  },
  {
    name: "Cambridge General",
    featured: true,
    description:
      "General Training letters (Task 1) and essay prompts (Task 2) modeled on official Cambridge tests.",
  },
  {
    name: "Forecast Academic",
    featured: true,
    description:
      "Recent high-frequency Academic Writing prompts curated for upcoming exam dates.",
  },
  {
    name: "IELTS Trainer Academic",
    description:
      "Guided step-by-step Academic Writing tests with clear structure outlines.",
  },
  {
    name: "Collins Practice Tests",
    description:
      "Structured Academic & General Writing tasks focused on coherence and lexical variety.",
  },
  {
    name: "Official Guide to IELTS",
    description:
      "Core exam-style Writing Task 1 and Task 2 practice sets for steady band improvement.",
  },
  {
    name: "Recent Actual Tests",
    description:
      "Real exam-inspired topics recently reported by IELTS candidates.",
  },
];

export const WRITING_BOOKS = WRITING_BOOK_SERIES.map((b) => b.name);

export const WRITING_TESTS: WritingTestItem[] = [
  {
    id: "cam19-test1",
    book: "Cambridge Academic",
    testNumber: 1,
    category: "Academic",
    task1Type: "Bar Chart",
    task1Prompt:
      "The chart below shows the percentage of households in four countries that used solar energy between 2010 and 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    task2Type: "Opinion (Agree / Disagree)",
    task2Prompt:
      "Some people believe that governments should invest heavily in public libraries even though most books are available online. To what extent do you agree or disagree?",
    sampleOutline:
      "Introduction (paraphrase + clear thesis) → Body 1 (digital access vs community equity) → Body 2 (public study spaces & literacy programs) → Conclusion.",
  },
  {
    id: "cam19-test2",
    book: "Cambridge Academic",
    testNumber: 2,
    category: "Academic",
    task1Type: "Line Graph",
    task1Prompt:
      "The graph illustrates average daily commuter numbers by train, bus, and bicycle in a European city from 2005 to 2025. Summarise the information and highlight key trends.",
    task2Type: "Discussion (Both Views)",
    task2Prompt:
      "Some people think university education should focus purely on career skills, while others believe students should study subjects for personal interest. Discuss both views and give your own opinion.",
    sampleOutline:
      "Introduction (both views + opinion) → Body 1 (job-ready curriculum benefits) → Body 2 (broader critical thinking & curiosity) → Conclusion.",
  },
  {
    id: "cam19-test3",
    book: "Cambridge Academic",
    testNumber: 3,
    category: "Academic",
    task1Type: "Process Diagram",
    task1Prompt:
      "The diagram below shows how recycled glass bottles are collected, cleaned, melted, and reshaped into new packaging. Summarise the stages clearly.",
    task2Type: "Problem & Solution",
    task2Prompt:
      "In many cities, noise pollution is increasing rapidly and affecting residents' health. What are the main causes of this problem, and what measures can be taken to reduce it?",
    sampleOutline:
      "Introduction → Body 1 (traffic & construction causes) → Body 2 (quiet zones, EVs & zoning regulations) → Conclusion.",
  },
  {
    id: "cam19-test4",
    book: "Cambridge General",
    testNumber: 1,
    category: "General",
    task1Type: "Formal Letter",
    task1Prompt:
      "You recently attended a training workshop organized by your company, but some materials were missing. Write a letter to the organizer explaining the issue and suggesting improvements.",
    task2Type: "Advantages & Disadvantages",
    task2Prompt:
      "More professionals are choosing to work remotely from home rather than in an office. Do the advantages of this trend outweigh the disadvantages?",
    sampleOutline:
      "Introduction (clear stance) → Body 1 (flexibility & zero commute) → Body 2 (isolation & collaboration limits) → Conclusion.",
  },
  {
    id: "cam18-test1",
    book: "Forecast Academic",
    testNumber: 1,
    category: "Academic",
    task1Type: "Table",
    task1Prompt:
      "The table compares average monthly spending on food, housing, and transport across three age groups in 2021. Summarise the main figures and comparisons.",
    task2Type: "Opinion",
    task2Prompt:
      "The most effective way to reduce traffic congestion is to increase the price of fuel. To what extent do you agree or disagree?",
    sampleOutline:
      "Introduction → Body 1 (price disincentive effect) → Body 2 (better public transit as fairer alternative) → Conclusion.",
  },
  {
    id: "cam18-test2",
    book: "IELTS Trainer Academic",
    testNumber: 1,
    category: "Academic",
    task1Type: "Map Comparison",
    task1Prompt:
      "The maps show changes made to a university sports centre between 2000 and the present day. Summarise the major developments.",
    task2Type: "Two-Part Question",
    task2Prompt:
      "Why do many young people prefer short-form video content over reading books? Is this a positive or negative development?",
    sampleOutline:
      "Introduction → Body 1 (instant engagement & algorithm feeds) → Body 2 (attention span trade-offs) → Conclusion.",
  },
  {
    id: "cam17-test1",
    book: "Collins Practice Tests",
    testNumber: 1,
    category: "Academic",
    task1Type: "Pie Charts",
    task1Prompt:
      "The pie charts compare electricity generation sources in Australia and France in 1980 and 2010. Summarise the key shifts.",
    task2Type: "Discussion",
    task2Prompt:
      "Some people say advertising encourages unnecessary spending, while others argue it informs consumers about useful products. Discuss both views.",
    sampleOutline:
      "Introduction → Body 1 (consumerism pressure) → Body 2 (product discovery & competition) → Conclusion.",
  },
  {
    id: "cam16-test1",
    book: "Official Guide to IELTS",
    testNumber: 1,
    category: "Academic",
    task1Type: "Mixed Charts",
    task1Prompt:
      "The chart and table show international student enrolments and average tuition fees across three countries in 2020. Summarise the main trends.",
    task2Type: "Opinion",
    task2Prompt:
      "International tourism brings economic benefits to host countries, but it can also harm local environments. Do the benefits outweigh the drawbacks?",
    sampleOutline:
      "Introduction → Body 1 (jobs & infrastructure revenue) → Body 2 (eco-tourism regulation needed) → Conclusion.",
  },
  {
    id: "recent-test1",
    book: "Recent Actual Tests",
    testNumber: 1,
    category: "Academic",
    task1Type: "Line Graph",
    task1Prompt:
      "The graph compares renewable energy share in total electricity production across three countries between 2000 and 2024. Summarise the main trends.",
    task2Type: "Opinion",
    task2Prompt:
      "Some people believe public transport should be free for all citizens. To what extent do you agree or disagree?",
    sampleOutline:
      "Introduction → Body 1 (lower emissions & congestion) → Body 2 (funding & maintenance trade-offs) → Conclusion.",
  },
];

export const WRITING_REPORT_DATA: Record<
  WritingReportPeriod,
  {
    band: string;
    avgWords: string;
    testsDone: string;
    onTimeRate: string;
    points: { label: string; score: number }[];
  }
> = {
  day: {
    band: "7.0",
    avgWords: "415 words",
    testsDone: "5 tests",
    onTimeRate: "86%",
    points: [
      { label: "Mon", score: 65 },
      { label: "Tue", score: 70 },
      { label: "Wed", score: 72 },
      { label: "Thu", score: 76 },
      { label: "Fri", score: 78 },
      { label: "Sat", score: 82 },
      { label: "Sun", score: 80 },
    ],
  },
  week: {
    band: "7.0",
    avgWords: "420 words",
    testsDone: "14 tests",
    onTimeRate: "84%",
    points: [
      { label: "Week 1", score: 64 },
      { label: "Week 2", score: 71 },
      { label: "Week 3", score: 77 },
      { label: "Week 4", score: 83 },
    ],
  },
  month: {
    band: "7.0",
    avgWords: "410 words",
    testsDone: "42 tests",
    onTimeRate: "81%",
    points: [
      { label: "Aug", score: 60 },
      { label: "Sep", score: 68 },
      { label: "Oct", score: 75 },
      { label: "Nov", score: 82 },
    ],
  },
};

export const WRITING_CRITERIA_STATS = [
  { label: "Task Achievement / Response", score: 78 },
  { label: "Coherence & Cohesion", score: 82 },
  { label: "Lexical Resource", score: 74 },
  { label: "Grammatical Range & Accuracy", score: 76 },
];
