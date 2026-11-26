export interface WritingTeacher {
  name: string;
  badge?: string;
  focus: string;
  image: string;
  url: string;
}

export interface WritingVideo {
  step: number;
  title: string;
  badge?: string;
  subtitle: string;
  image: string;
  url: string;
  cta: string;
}

export const WRITING_TEACHERS: WritingTeacher[] = [
  {
    name: "IELTS Advantage – Christopher Pell",
    badge: "Highly recommended",
    focus: "Essay structure, Band 7+, Task 2 strategy",
    image:
      "https://images.openai.com/static-rsc-4/RhkIEXJXINnfFDKPnCvYlnvohfuqM6PxDy5GV62rSitaoQZJgj93G1E0OYTHgbm2XNfCdg16sRfXgcgaT-WKBwBkNijA6KtxWHGs6PsAVms0xUovOEZiXPM6qy0IZxnYh2auTHazDqHo63XqxsSPC5_tfVnHeXS0w6tfLkjZs-M?purpose=inline",
    url: "https://www.youtube.com/@Ieltsadvantage",
  },
  {
    name: "IELTS Liz",
    focus: "Grammar, vocabulary, Task 1 and Task 2",
    image:
      "https://images.openai.com/static-rsc-4/K95aUK_lVbPtHeSeIoA8BE5deB14MyHF8igkfdP55ZPXpZlBpdxApVXQxLV_b7VoaW8HeTU1wffsKVPWTO13-tGY4m3QtqFm0cSUbhHwvtdfYN_id5tyRK46XCvwgFfGZBxjld6n7sBMYIZexBc0vvHeoM52Y0qLohdPIiYKp-Y?purpose=inline",
    url: "https://www.youtube.com/@ieltsliz",
  },
  {
    name: "E2 IELTS",
    focus: "Exam techniques, essay evaluation, Band 9 samples",
    image:
      "https://images.openai.com/static-rsc-4/hp-LIkGAKDSZMAO9ngxF8wGD-NNEdWDdcyNPfxnkAAhF9_5gvvEK29iu_YIpjULZ7hcYbYaO_B7fj25n2RjVBykKD99SrunPd8cEAq2x5UhK-reZHnkfBOEWH3gn0c56liRmh-y4hdD10Hmdcec2vpy00-xrobFlbUyBm2ffg9o?purpose=inline",
    url: "https://www.youtube.com/@E2IELTS",
  },
  {
    name: "Fastrack IELTS – Asiya",
    focus: "Detailed writing lessons and exam practice",
    image:
      "https://images.openai.com/static-rsc-4/unb4TO22rOlktLbBRbTZhlJYm-deZJagnvvMAhpoN35ljnVcsKRsVJhvz68XPPENTKEi5L-vzlBAx_Tys9foA0YQBFaZ5Pu0ndttKPBfjesQp-AxogHUy-iC9ljULb1sVLnYw3ik66OwJLt8CDHnxxeuBBER9cckZoV_a31dc-I?purpose=inline",
    url: "https://www.youtube.com/@FasTrackIELTS",
  },
];

export const WRITING_VIDEOS: WritingVideo[] = [
  {
    step: 1,
    title: "Complete IELTS Writing Task 2 Course",
    badge: "Start here",
    subtitle: "IELTS Advantage · Complete essay from introduction to conclusion",
    image:
      "https://images.openai.com/static-rsc-4/eXuOHBVUzC7F3CEvSqYKO6SrBc3bXjtLHjxZ54garp1eu2p-vVjikn4M6LY4-ER8twOuItU9g34LldRpW7Bg6w4u2HS_c9vPwwsJGfZQKmSU60FyPeCOnNFbiUTH-V0m3iFE6by0rVnDbx-IeHYdx7RItix7rDh_bIxFiMgjhWo?purpose=inline",
    url: "https://www.youtube.com/watch?v=h2uF03zKaCA",
    cta: "Watch video",
  },
  {
    step: 2,
    title: "Band 9 IELTS Writing Sample",
    subtitle: "E2 IELTS · Learn how a high-scoring essay is written",
    image:
      "https://images.openai.com/static-rsc-4/P_QkTqPGaY15J00BUIMGZ8-N_X9g8M4b-25STMuf4O4t359S1TpIIklugeW2Mzu9XWYAPS7gfJBNjy15w3XrUV1xI2EJDCgrzckK6vUWY77Tp9aY8U8OX_c9OEeyxNR2w7Y5gnoe3rz8C2zhfydACOLoBGrCxOsujbPpIbpeCeg?purpose=inline",
    url: "https://www.youtube.com/watch?v=5o_oph2vhGM",
    cta: "Watch video",
  },
  {
    step: 3,
    title: "IELTS Writing Task 1 – Complete Guide",
    subtitle: "Academic graphs, charts and diagrams",
    image:
      "https://images.openai.com/static-rsc-4/Ujpevkb5iFwtuS4Q-hWbj3juw7nOG0VKXwi9EgCUDLHWXRvcx3SV4AdP7xDHYKj5mt3XNwPuVokcp_cOHN0dLXQr9hrPhltK3cOayzDKanrp9bjJ7o6iLFvAPFX2dtth-waBohTu0MzDnAp062mKD76m8dL-JL-XxZom9C_nxFs?purpose=inline",
    url: "https://www.youtube.com/results?search_query=IELTS+Liz+Writing+Task+1+complete+guide",
    cta: "Watch lessons",
  },
  {
    step: 4,
    title: "How to Write an IELTS Essay Introduction",
    subtitle: "Introduction, thesis statement and essay structure",
    image:
      "https://images.openai.com/static-rsc-4/1tNX_bjIjlVXSLuL1QubkeSRhGT4IHrcIrgX6rhsXilJPegM99itYlRqPmObzufrElXxzrfxmYnHaonlohwtyvvyPmMlewQON1VhfQd3aQZZD-kEvoC687qQCqaVxP0D-edNowPFz2XEYhbvEozBa6Rb4_n_pej-xCMUqiCOmLI?purpose=inline",
    url: "https://www.youtube.com/results?search_query=IELTS+Advantage+how+to+write+essay+introduction",
    cta: "Watch lessons",
  },
  {
    step: 5,
    title: "How to Write Body Paragraphs",
    subtitle: "Topic sentences, explanations and examples",
    image:
      "https://images.openai.com/static-rsc-4/5tGAp0EfibB2ScSRHC4RV082naCSmd0HyASjH8x4wG8SLkjhztn48kJJ1yNieXRtlMSeEhAduNE1rP1_LB-TKHD2t84kxTP4MsDqGq1ge8D4G1uGNOT3Vj8Uqa9QZq8Ycfj7k_jn0yXEYiyUxbNSFg99NUSX0Xj1px1PnDw5bBM?purpose=inline",
    url: "https://www.youtube.com/results?search_query=IELTS+Writing+Task+2+body+paragraphs+IELTS+Advantage",
    cta: "Watch lessons",
  },
  {
    step: 6,
    title: "All IELTS Writing Task 2 Essay Types",
    subtitle: "Opinion, discussion, advantages/disadvantages, problem/solution",
    image:
      "https://images.openai.com/static-rsc-4/EpQJi93YN_r8NmpqnCstCrYd5YR_koL2La7C7DJb_CZVpBvA87yEWK6NMfKQliYol27sJ-N5ABeLFMGJHnWAVB8uAFtjxCZ90eJEyh74fsqf-O6ZxwF_5ueGpdnoTdMBMf9B9xSBEmMXBBuO5uwF49tMo6gTFUrpKjY1fwpyFpg?purpose=inline",
    url: "https://www.youtube.com/results?search_query=IELTS+Writing+Task+2+all+essay+types+Fastrack+IELTS",
    cta: "Watch lessons",
  },
  {
    step: 7,
    title: "IELTS Writing Grammar and Vocabulary",
    subtitle: "Sentence structures, vocabulary and common mistakes",
    image:
      "https://images.openai.com/static-rsc-4/W9y7SfXH1L6yL0A82p2NFfTUoDW33nMbadek8Zph1TZPwRGJGazQxwPt1BggjqZsNyv2MvKDzeIu-_t08uYiaVxHawiptW-KPeZ4sKH47D_AfXdEkB0e5WJnrscrWthlYqCba3auLZS8YBGhEMxdYAxJUBXXroNZpN72ZlPtv64?purpose=inline",
    url: "https://www.youtube.com/results?search_query=IELTS+Liz+writing+grammar+vocabulary",
    cta: "Watch lessons",
  },
  {
    step: 8,
    title: "Coherence and Cohesion",
    subtitle: "Paragraph linking, connectors and logical flow",
    image:
      "https://images.openai.com/static-rsc-4/gRAdJoZMLgIsX-8apwVAEfbLdlxhS-LIAfFLB67Xurg8-N_VO9WuBkrfru8eEY4f63RJIrrOo1DBvSmbZTTQW4222OUlroLm0vx2pthQM5pbKkMLyOx8zLlATgrBj-dN_HtiiabJq5RCwJkgeR1BQZEqz15tv38tM_-9Xxu1sM4?purpose=inline",
    url: "https://www.youtube.com/results?search_query=E2+IELTS+coherence+and+cohesion+writing",
    cta: "Watch lessons",
  },
  {
    step: 9,
    title: "IELTS Writing Band Descriptors Explained",
    subtitle: "Understand how examiners assess your writing",
    image:
      "https://images.openai.com/static-rsc-4/SCACr707oo79O85Vc0oQOcngrIl_3YvBLvfel2aOC4FR0V6fkwSxBN-RTUlFwAwYZ9satyVfv13Ub8MZR0bHr03F6axOYbEFDl8KFT5X4AYb45aIh0CKjebEcN1fDgN9EYvjb9mciulI2gZWw_zFPGMqG0qNZV33DiZjHV1T4Nk?purpose=inline",
    url: "https://www.youtube.com/results?search_query=IELTS+writing+band+descriptors+examiner+explained",
    cta: "Watch lessons",
  },
  {
    step: 10,
    title: "Full IELTS Writing Mock Test",
    badge: "Exam practice",
    subtitle: "Practice Task 1 and Task 2 under exam timing",
    image:
      "https://images.openai.com/static-rsc-4/dg31tynxaURP01hfO8Vq1J6ahx4zC3tb0b2VSIq3qTGLbtioaaW3_YTbx1qHaVrHeEdj8sxuuZ2ChQeSD1H2UOCVMt7lASHnBJ7z60MBGTDC-fRWzCGxyfvCysWO7ujgGsYnC1bJeOFJJ0817qvccSS3-72bCznnBWfoqAeQxoY?purpose=inline",
    url: "https://www.youtube.com/results?search_query=IELTS+Writing+full+mock+test+60+minutes",
    cta: "Watch practice",
  },
];
