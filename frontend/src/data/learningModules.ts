export interface SkillTeacher {
  name: string;
  badge?: string;
  focus: string;
  image: string;
  url: string;
  cta?: string;
}

export interface SkillVideo {
  step: number;
  title: string;
  badge?: string;
  subtitle: string;
  image: string;
  url: string;
  cta: string;
}

export interface SkillLearningConfig {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  icon: "writing" | "speaking" | "listening" | "reading";
  teachersHeading?: string;
  videosHeading: string;
  teachers?: SkillTeacher[];
  videos: SkillVideo[];
}

export const WRITING_MODULE: SkillLearningConfig = {
  id: "writing-module",
  eyebrow: "1. Writing Learning Module",
  title: "IELTS Writing — Learn & Check Writing",
  subtitle:
    "Trusted IELTS teachers and a 10-step video sequence to level up Task 1 & Task 2.",
  ctaLabel: "Check Writing",
  icon: "writing",
  teachersHeading: "Famous IELTS Teachers & Channels",
  videosHeading: "Top 10 IELTS Writing Sequence",
  teachers: [
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
  ],
  videos: [
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
  ],
};

export const SPEAKING_MODULE: SkillLearningConfig = {
  id: "speaking-module",
  eyebrow: "2. Speaking Learning Module",
  title: "IELTS Speaking — Fluency & Practice",
  subtitle:
    "Top speaking coaches and a 10-step video guide covering Part 1, Cue Cards & Part 3.",
  ctaLabel: "Practice Speaking",
  icon: "speaking",
  teachersHeading: "Famous IELTS Speaking Teachers",
  videosHeading: "Top 10 IELTS Speaking Lessons",
  teachers: [
    {
      name: "IELTS Advantage – Christopher Pell",
      focus: "Speaking strategies, Band 7–9, mock tests",
      image:
        "https://images.openai.com/static-rsc-4/JeYXOhdpCP13tzhdsnBmvZuXivJL_IckGEbErDy1pUvSCyWbLfLZPd8INYVLIvDaUeZTkx7__3drQK9_m2SCSObl2rok1NQNCQUUPP8DWPZm6QfCt5hpizowMPw5K1HDpTCnqINljGr4hrHKc1BGi9Pt37WBalfeQ-oZLEoy1jg?purpose=inline",
      url: "https://www.youtube.com/@Ieltsadvantage",
    },
    {
      name: "E2 IELTS",
      focus: "Mock interviews, speaking techniques, examiner criteria",
      image:
        "https://images.openai.com/static-rsc-4/61Tk7gFfiaheIj724lkZmVzPwFhOt0EHYCjVbUr9f0svOZEbWNGL26-SJDePg1ErhY-2oTk50pcjAxbjFC-SP8joocUuN0OukNWUIYF2mUGBRyd-AVI6ZJg9mTwxTf_X6HYPGMo4m5fu-d5iAAjFWhbafStYSoi1qVZBaF4f6cE?purpose=inline",
      url: "https://www.youtube.com/@E2IELTS",
    },
    {
      name: "Fastrack IELTS – Asiya",
      focus: "Cue cards, sample answers, speaking practice",
      image:
        "https://images.openai.com/static-rsc-4/unb4TO22rOlktLbBRbTZhlJYm-deZJagnvvMAhpoN35ljnVcsKRsVJhvz68XPPENTKEi5L-vzlBAx_Tys9foA0YQBFaZ5Pu0ndttKPBfjesQp-AxogHUy-iC9ljULb1sVLnYw3ik66OwJLt8CDHnxxeuBBER9cckZoV_a31dc-I?purpose=inline",
      url: "https://www.youtube.com/@FasTrackIELTS",
    },
    {
      name: "English Speaking Success – Keith",
      focus: "Natural English, fluency, vocabulary and pronunciation",
      image:
        "https://images.openai.com/static-rsc-4/i23zii0EQL2Fewnr9LVZGJ1ty9kQ_19hVTnrNo5boiqvqmLx64kl1wZWDI6NGTZbC2I17d0yo6nf2_CLGYIk0fTl6-eWC9dmD6NmRb1ts7WLS2aP29VRAOxPvh4yaoYXF9PNCagg0Th5CNITIvFgGgRSJrh8ONQU_Heo81o04F0?purpose=inline",
      url: "https://www.youtube.com/results?search_query=English+Speaking+Success+Keith+IELTS",
      cta: "Find Keith's lessons",
    },
    {
      name: "IELTS Liz",
      focus: "Speaking Part 1, Part 2 and Part 3 fundamentals",
      image:
        "https://images.openai.com/static-rsc-4/K95aUK_lVbPtHeSeIoA8BE5deB14MyHF8igkfdP55ZPXpZlBpdxApVXQxLV_b7VoaW8HeTU1wffsKVPWTO13-tGY4m3QtqFm0cSUbhHwvtdfYN_id5tyRK46XCvwgFfGZBxjld6n7sBMYIZexBc0vvHeoM52Y0qLohdPIiYKp-Y?purpose=inline",
      url: "https://www.youtube.com/@ieltsliz",
    },
  ],
  videos: [
    {
      step: 1,
      title: "Master IELTS Speaking in One Video",
      badge: "Start here",
      subtitle: "IELTS Advantage · Complete speaking strategy",
      image:
        "https://images.openai.com/static-rsc-4/wJ_r-vpdQ032_GVmIO612zHwwNuLVfqvwVhlbfuK_mR2vglqLqg6Eg1SfENraieRszA3P9vcXkNqgVKFKiURuUSUNUhr3IasTEAq7V9BNk8K7zM852TVraIwJZUPRFhgxqWgCDaDvYakGgKeuGcr5j3JX7MIROF3GhUq9o_dSGs?purpose=inline",
      url: "https://www.youtube.com/watch?v=bqznnq9gOsU",
      cta: "Watch on YouTube",
    },
    {
      step: 2,
      title: "The Only IELTS Speaking Course You Need",
      subtitle: "IELTS Advantage · 3-hour complete course",
      image:
        "https://images.openai.com/static-rsc-4/Y57BLrRkQgCUdprpuGC0k1kVj1AT7PYuvXG5g1VYYjmB_akgs3g2F017vakiNF5EIsqbE78jpJvtVOVSzVYdmDBhupB5ViKTgSinvi7WYir5t8NIPSalWfQ2SFoTnFZDjMDRhpKyH4vG1aXCNdOAFxIlUW019ggEo3jyjCSUI3k?purpose=inline",
      url: "https://www.youtube.com/watch?v=rqmv0LCcPTs",
      cta: "Watch on YouTube",
    },
    {
      step: 3,
      title: "IELTS Speaking Part 1 – Questions and Answers",
      subtitle: "Introduction, hometown, studies, hobbies and daily routine",
      image:
        "https://images.openai.com/static-rsc-4/QIG31fJZPuv4kS78uCl8cz4qcisKPMaZ_kEEpljlo3F_IpinTgQRoiIsCloxBK0T6GUW5J4i-jYIQBL50WfImCA0RuzJrVBgp5EjSeR1pfZcnrtRW2GpozO2hv4rdsplIz6nZPmsKD4uRKnx2Wytee1BF2AHqj19VY3lvUmpjMo?purpose=inline",
      url: "https://www.youtube.com/results?search_query=E2+IELTS+Speaking+Part+1+questions+answers",
      cta: "Watch lessons",
    },
    {
      step: 4,
      title: "IELTS Speaking Part 2 – Cue Card Masterclass",
      subtitle: "How to speak for 1–2 minutes without stopping",
      image:
        "https://images.openai.com/static-rsc-4/Xi8L5hHbgEIe904UR9t9hV1xsc2x3F-MMWnJ_CB7jvsNm1MKTC9sK700RvpKnq_Vp6etsOzsApsroIwUWUHSlaXNx_U5Mw1a-yQLtF8DEQR3CvmXsm7cL8dzzeIHAn041lLmqgjIlVgr_HXRniXtfEKGaL8bOvgSkLCl2vG8yHM?purpose=inline",
      url: "https://www.youtube.com/results?search_query=Fastrack+IELTS+Speaking+Part+2+Cue+Card+strategy",
      cta: "Watch lessons",
    },
    {
      step: 5,
      title: "IELTS Speaking Part 3 – Discussion",
      subtitle: "Giving opinions, explanations and examples",
      image:
        "https://images.openai.com/static-rsc-4/3i4FPQwwaRAB0W1kfzk5cv_a-q5l5SYYvH8oJarvUqQZCzBDeKrQqlxQfnCNv86OhxJ8bmWATGvSwn66RJgoekcLrDeCvGQaj5OZZUdR93t4jAJnLSxFl--0HAhwQrvenWDqP0NZBeWBNmLydfWvKhDpObj2y4QMq9s7dB3mPjA?purpose=inline",
      url: "https://www.youtube.com/results?search_query=E2+IELTS+Speaking+Part+3+discussion",
      cta: "Watch lessons",
    },
    {
      step: 6,
      title: "Improve English Pronunciation and Fluency",
      subtitle: "Natural pronunciation, stress, intonation and rhythm",
      image:
        "https://images.openai.com/static-rsc-4/rplajThr6Awgw5dz_tMXjPlg5pBPtw2sCMueQfiek_I7KQCRv_iFBGitfqdyye5b5uAt5pgfJEOOPk5FGLjmGFSjro1RTAo60rAT6Y74YWxdYnSxVdMuzFOeUwNEVDVndnhrJvzuZC0z2QFwlJiU57vqFXnzyuQbvNqdmve-fr0?purpose=inline",
      url: "https://www.youtube.com/results?search_query=English+Speaking+Success+IELTS+pronunciation+fluency",
      cta: "Watch lessons",
    },
    {
      step: 7,
      title: "IELTS Speaking Vocabulary – Band 7+",
      subtitle: "Natural expressions, collocations and paraphrasing",
      image:
        "https://images.openai.com/static-rsc-4/YqX1hd1nFziJDWyvjQJY0w-ULZhpAwBPQE4GcvOuUkdFx_QfZmOdg3JGtlI_CFsYK5E8fNmdNnFgXQZv-W2IahbXJqNOMRW3xaRZhJ4TkSACMyiFaXGHqI5IYOQiMEiyL2MPZOeJuRskH_2ZFZBVG0m7FmvldhwpICtz-dx72Ls?purpose=inline",
      url: "https://www.youtube.com/results?search_query=Keith+English+Speaking+Success+IELTS+vocabulary",
      cta: "Watch lessons",
    },
    {
      step: 8,
      title: "IELTS Speaking Band 9 Mock Test",
      subtitle: "Listen to a high-level candidate's complete interview",
      image:
        "https://images.openai.com/static-rsc-4/ZsgFg3oE_IIjO1qH-l4SkSywA0HjdYIUv8QjZ63ESSl3e07nVkuSPnyDYKMYo-5eZQs4__9QfLLqA5qlRs9RN87gz3kmyJVZIcHi9_7jSvGgOr609rCC6a-Wfsh3QSmM_CH87OeKSVYEVmHNzubd7kDN-Wh0SoQ51r3D-L66YGg?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Speaking+Band+9+full+mock+test",
      cta: "Watch mock tests",
    },
    {
      step: 9,
      title: "Common IELTS Speaking Mistakes",
      subtitle: "Avoid memorised answers, repetition and unnatural expressions",
      image:
        "https://images.openai.com/static-rsc-4/x5VppLNeufKla2TgFXWWDijkbUbsNh7bizFBe51azyzsTcTyzZhWwDUKieQWU6MDNKHgHw60TdGQK6CTcsmRQgrX0DfFo9pGrv-QcfaKGE_IZDGNmfCDdcesBL7Q6QyxpzNlMf8i4lPkWS_aBP_0Kqv4SVkjbEdrN_U3h-0qhc4?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Advantage+common+speaking+mistakes",
      cta: "Watch lessons",
    },
    {
      step: 10,
      title: "Full IELTS Speaking Test – All 3 Parts",
      badge: "Final practice",
      subtitle: "Complete 11–14 minute exam simulation",
      image:
        "https://images.openai.com/static-rsc-4/HRBTuJoPT9qitmsXxn3nI7wl1OySrAOldsbI2Gmv-DnkwzJsOGxJP_OsqXEd1exy9Ce3CiXPqWVdEpPH8O0HXnMHqottRUQMtBthy6grtoxIH4WJ08H9jVnR9UlBwrSiRbRWfWYFAIX_-CcDyqk4MLqjCJErt1H3g81-vUeK0ss?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Speaking+full+test+Part+1+Part+2+Part+3",
      cta: "Practice full test",
    },
  ],
};

export const LISTENING_MODULE: SkillLearningConfig = {
  id: "listening-module",
  eyebrow: "3. Listening Learning Module",
  title: "IELTS Listening — Top 10 Lessons",
  subtitle:
    "Master all 4 listening sections, distractors, map labelling, and accent comprehension.",
  ctaLabel: "Practice Listening",
  icon: "listening",
  videosHeading: "Top 10 IELTS Listening Lessons",
  videos: [
    {
      step: 1,
      title: "Complete IELTS Listening Introduction",
      badge: "Start here",
      subtitle: "IELTS Liz – Listening format and essential tips",
      image:
        "https://images.openai.com/static-rsc-4/r8mxxMbY0p7AddOaRiZ8eu8mSZzN2-gINDTtDuPs41HcEdFFTbn1NnAU8GZ9gm2KF7LvUfIe6oc4UWJpzPMbTkYyCg7WHcQvDl3JnTuKSMXWdT9XQsPdOz1_c2pIu1xWjDsKB8S3Knfj1UQM21FEurwy7U6pifbQHlPv_A4q1TM?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Liz+Listening+Tips+Essential+Information",
      cta: "Watch on YouTube",
    },
    {
      step: 2,
      title: "Full IELTS Listening Practice Test",
      subtitle: "E2 IELTS – Four sections with answers",
      image:
        "https://images.openai.com/static-rsc-4/MVlFwfqTIY3LWqrrTAFHxaKa9IgnSFHcoy8llPY2VFS3exKXWNGjOzrUCe6GcuTuo1vdqQWDdtL6om01jT8zopfaOaH5lFwBzkVRBiX6JkJfDjsYMZo0Dp7dvIhjVbUsyg904Wbf2VeJgmPiSRpMZ1q3oQXEL1R5n50eqycukh8?purpose=inline",
      url: "https://www.youtube.com/results?search_query=E2+IELTS+full+listening+practice+test+with+answers",
      cta: "Watch on YouTube",
    },
    {
      step: 3,
      title: "Multiple Choice Questions Strategy",
      subtitle: "Understand distractors and identify correct answers",
      image:
        "https://images.openai.com/static-rsc-4/R4e4t2T5rNm4Mg2yfb39_rU_vPsfsKEdde0KdJ1IMUP6LJyEokyI-m9WtJaITD3ilXMYQIfun91ZvLWX9KXUwyI5pNzMbtP6jbeKby-j0l_UGu2X3gkJGokAp2MknX_ieK2422va2K4dNZqnuOEzJOk4A4Nkc3R_khlzsIiO8xY?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Liz+Listening+Multiple+Choice+Strategy",
      cta: "Watch on YouTube",
    },
    {
      step: 4,
      title: "Map Labelling and Directions",
      subtitle: "Learn directions, locations and maps",
      image:
        "https://images.openai.com/static-rsc-4/2GtQWRbUfluZSnbz6ea9cB3l4zi5QTHx9Iv0Gz21_eOFYnz0I57Fktlv2_GJwRzcUiEHuKioFTlkl5AGrf_db-XyovjayNuvb1guxfpW_hmPWNkM4WPopzY3NS9YMzSO-Qc3Chk6B0H_aR5c9kps0s7NGIFHbGY0KO4mk6FlE3k?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Listening+Map+Labelling+Fastrack+IELTS",
      cta: "Watch on YouTube",
    },
    {
      step: 5,
      title: "Form and Note Completion",
      subtitle: "Names, addresses, numbers and missing information",
      image:
        "https://images.openai.com/static-rsc-4/Bljl8dv_UxnrKZ5eL8S0F-LBgCg3yvKLQrcWapZKPKTRdocAuy0EnPJnKxUxS5RlzEolY3zbhoWuQSOtGaPhoD8RqvoWyVu-aZ6Kyhu9T905IWig7QTZII8NLsrBNJKOgeNJvLnZkgT4q6a0tox7Sy0o7F0Xo-0Q1lMKRm1UjVo?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Listening+Form+Completion+IELTS+Liz",
      cta: "Watch on YouTube",
    },
    {
      step: 6,
      title: "Spelling, Numbers and Dates",
      subtitle: "Avoid spelling and number mistakes",
      image:
        "https://images.openai.com/static-rsc-4/3ocsiie_TSBxkm6Gc2nuFpHxPCNDFozfn2KuHTHhnsxylspeXJNh3NY22IivKyRlBVOy-jK27zvANGxwHNogElJL46ApcUrVoiI85JKGTBj4bI66JLlpbDesl4wKo52ioR4ranNX8mmLtBc3KRL8kiXMdcesXs3RIO_Id-tl6QE?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Listening+Spelling+Numbers+Dates+IELTS+Liz",
      cta: "Watch on YouTube",
    },
    {
      step: 7,
      title: "Sentence Completion Techniques",
      subtitle: "Predict missing words before listening",
      image:
        "https://images.openai.com/static-rsc-4/BioNKFfmbcqf1r5tgJ9aDdn8-8jbqvDg_YZE6XMuJ0ho5j9Ed6-cS1rVXxyvUy_yotBxGXDCGByt2YRCGYSxZnL-JUw8xlmyXyt_FZzieDQnnp4it8I3Fd-p_tyFK5Eubr8UWl5i0sUdV-1fll4FYNu-vSeAl7hpoRyoF0dDnyg?purpose=inline",
      url: "https://www.youtube.com/results?search_query=E2+IELTS+Listening+Sentence+Completion+strategy",
      cta: "Watch on YouTube",
    },
    {
      step: 8,
      title: "British, Australian and Other English Accents",
      subtitle: "Improve your ability to understand different accents",
      image:
        "https://images.openai.com/static-rsc-4/qzN6G-tP14x76baklvOUt1uB3wwJz2vJeK672PBOo75puo9PmBI6lATwbxU4N6x2uVl6tqm7nIDeFdBCcdJ4fOZnFGnJtYIlEjc53m3aI-eZLG8OouLtIYVgnGYmz1XWr4wqW9vNENN4iTipGiFXF1PPQ0yqEBRD6JKZo438TJM?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Listening+British+Australian+Accents+Practice",
      cta: "Watch on YouTube",
    },
    {
      step: 9,
      title: "IELTS Listening – Band 9 Strategies",
      subtitle: "IELTS Advantage – Improve accuracy and concentration",
      image:
        "https://images.openai.com/static-rsc-4/y1U5vl5jy010BgAemPUQBy5NS28B4M8zFe88o_3U1oee2eII3l-yJztWlUg5GhFIIfetjuFsyB8oLrbTlIZYSZbUY4VNhkZcnPrRzoddBwdiGahDqqkzEOj1BsdVu5BuZd9Qtclmm1vESrFpQ636cswOaNZFdUNebYRS1oJ0FxU?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Advantage+Listening+Band+9+strategies",
      cta: "Watch on YouTube",
    },
    {
      step: 10,
      title: "Complete IELTS Listening Mock Test",
      badge: "Final practice",
      subtitle: "All four sections with answer explanations",
      image:
        "https://images.openai.com/static-rsc-4/UmsIDsfGj_NPnKeB8iDljmQ_UlVWGFFT53oVCN9tQn8f6GaabijxJc3Jj34pELU_1nDmJDS3KvhhFwloW-lW5f5cHLqqF0BQk2-fWYR1RagyOm-Xm5oRSrYuc3sOPaTE8Gmqe7EcXDPY0hqnztBKS-2k1bYsuUdKgqYI0quI9Yw?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Listening+Full+Mock+Test+4+Sections+with+Answers",
      cta: "Watch on YouTube",
    },
  ],
};

export const READING_MODULE: SkillLearningConfig = {
  id: "reading-module",
  eyebrow: "4. Reading Learning Module",
  title: "IELTS Reading — Top 10 Lessons",
  subtitle:
    "Sharpen skimming, scanning, True/False/Not Given, headings, and 60-minute pacing.",
  ctaLabel: "Practice Reading",
  icon: "reading",
  videosHeading: "Top 10 IELTS Reading Lessons",
  videos: [
    {
      step: 1,
      title: "How to Reach Band 9 in IELTS Reading",
      badge: "Start here",
      subtitle: "IELTS Advantage – Complete reading strategy",
      image:
        "https://images.openai.com/static-rsc-4/Ih5XtDHKTRVj9n0K6pNyE3V31FHcirGN9YpL6W3wVcnS3IrQxSmo2hKivFNzrPl64jEmOfAcilfRbqtqAh1uzgQXSzYiO7iB35ThrOpninDLhzypOFh4h8HBPsUzvocfw-oT2vmweoypGb84i426xWeQyqVaFH9_w2yF_TDmM60?purpose=inline",
      url: "https://www.youtube.com/watch?v=apOCnYpR-9g",
      cta: "Watch on YouTube",
    },
    {
      step: 2,
      title: "Complete IELTS Academic Reading Test",
      subtitle: "Asad Yaqub – Step-by-step test solving",
      image:
        "https://images.openai.com/static-rsc-4/atGBAmBKSqdpAyLM4UccKmwIhLcp-7QwtJldnb-RkEUBAUIqnNbn_4qLP_2ebAddnyUZDZ8XpjvSolZKN39qAOB2PbYnqqmJqfFX7U3vaKrkuLApuEq77XngWtuOO8J6ljievDOfekPZs_pDsw7au63eU6qdyEo5sU7aPWnz0eI?purpose=inline",
      url: "https://www.youtube.com/watch?v=1vZix-mNovc",
      cta: "Watch on YouTube",
    },
    {
      step: 3,
      title: "True / False / Not Given",
      subtitle: "Learn the differences and avoid common traps",
      image:
        "https://images.openai.com/static-rsc-4/7Q1WwTgEkomNZUP9CLlT9XxgH6DEFD7JI33yAyLto8yyOXlB2bb132S-u6Dj6er-rrFYpRq6FOXzAnw_4UTlaqMVPpCsRDHWPCZSheyZHjF5cHDtgUf_8zQKCXFr-p2_CWaMHLKaoz3yBGzO05d1D9rqabQk-ELUtVzR_2NQAhA?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Liz+True+False+Not+Given+complete+lesson",
      cta: "Watch on YouTube",
    },
    {
      step: 4,
      title: "Matching Headings Strategy",
      subtitle: "Understand main ideas and paragraph headings",
      image:
        "https://images.openai.com/static-rsc-4/j0iC9YJdh7t8tSP-kdjCC9lyHJvGP1586cnXubSpVhGYznnGNkR5McOpv6vrWdRg5Q8LxMfZZqe_7EWeov_tNnntUn5qGZkwuEzbixU5UUVpdftndh6cL-oviDYgvuUe-Em_OvrL8GlAR1vXp0r2mhJhog2KHR7Jv-yNMHw7m_Q?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Advantage+Matching+Headings+Reading",
      cta: "Watch on YouTube",
    },
    {
      step: 5,
      title: "Skimming and Scanning Techniques",
      subtitle: "Read efficiently and locate answers faster",
      image:
        "https://images.openai.com/static-rsc-4/H_imzs8JuupNnEZzmJTF7I7KTCYVaC1J7f5DRDiXGh4gDtITk-sbhqnDrkSoKmIXTCHji9PYkwj3A49-rj5M20BbbPBaS2fv6Fb592FRz7JnfN7-P6E3c9WS9u7txDdghYKDhU1aGKWnLpz9-rrwQF7XnblPVayMxpiQ0DQ8hcs?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Reading+Skimming+Scanning+IELTS+Advantage",
      cta: "Watch on YouTube",
    },
    {
      step: 6,
      title: "Multiple Choice Questions",
      subtitle: "Find correct options and eliminate distractors",
      image:
        "https://images.openai.com/static-rsc-4/mHevzPL7yqclTdgANPxPhFcLyzYRlnR4TOgrbEbmY3h785Vmu5lvs-YELvlOadg45uKhmOk4Tanjdjkenu-EEiog2B4g7HgxA_DD0eeOWAe-dQTvovKtEcxNSVhFg5giNt5oI3g099kfirkNdRnwoR_lFtJJ-d984Tph86t6wxU?purpose=inline",
      url: "https://www.youtube.com/results?search_query=E2+IELTS+Reading+Multiple+Choice+Strategy",
      cta: "Watch on YouTube",
    },
    {
      step: 7,
      title: "Matching Information",
      subtitle: "Match information with the correct paragraphs",
      image:
        "https://images.openai.com/static-rsc-4/xt010I6PWnUdsRL4ipShSCCrjPQRj1jtTygNB1XWNWzfZazVTO7sCvJe9nLY2FFgRotjCcu-D-edL9m1y_2Uv8p7mf2GAXFZRVGlMDESgQU0eNfftgl7XHqydC4XvAy0eKybiRF1gKYt9212Hf3zHK2ZyQSwYdktldgDN7a6vxc?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Reading+Matching+Information+Fastrack+IELTS",
      cta: "Watch on YouTube",
    },
    {
      step: 8,
      title: "Summary and Sentence Completion",
      subtitle: "Understand synonyms and word limits",
      image:
        "https://images.openai.com/static-rsc-4/ZvbeMbmbBzdk9y73Wnp0GWr6CzjD61kjQ09kTjad1HHXuYed-j5zz5-mabIGNetiipnY_RMZAXqueWHbamL9lkFvHYBCGviSKvVhE0XbU1rEu5XaZksLD9-EIMiEyWVTblQ4TdQ5f6UCARJ70kvLjsIppHHX-9leKbdMh_Fon2Y?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Reading+Summary+Completion+IELTS+Liz",
      cta: "Watch on YouTube",
    },
    {
      step: 9,
      title: "Reading Time Management",
      subtitle: "Complete 40 questions in 60 minutes",
      image:
        "https://images.openai.com/static-rsc-4/mUzLi10Pd4YEN_cNxMa7HSxAx6p_LuoCk5JDLXtIUOYJmljHfoZ025-0jz8rroYScCyJ5pACmO83m2GjylFgiKJjqbowUtsJwbUa3zcfYid4slUdodaPOXcZLVuuIvj7SbNcW7NonNtuXacnWiaJWHfkTICYDyiU8bG_IwjEn2g?purpose=inline",
      url: "https://www.youtube.com/results?search_query=IELTS+Reading+Time+Management+Band+9",
      cta: "Watch on YouTube",
    },
    {
      step: 10,
      title: "Full IELTS Academic Reading Mock Test",
      badge: "Final practice",
      subtitle: "Three passages, 40 questions and answer explanations",
      image:
        "https://images.openai.com/static-rsc-4/yV-6r6It4BgXZwHD-KX4JG7Rwi26jQtUe5ja1aUUpCzjx_Jlfscgrqcm4JIO1bUWipd4irAhpLDIiCLsmAlGBwDsEebC8knzPhXgZ0tPq0MA20Zx5__I_gPUOdoFfYin3kGqyh9Gdytb_iBbOP1XvL5dLk-PvSU4ZLvfg3LFX1k?purpose=inline",
      url: "https://www.youtube.com/results?search_query=Full+IELTS+Academic+Reading+Mock+Test+with+answers",
      cta: "Watch on YouTube",
    },
  ],
};

export const ALL_LEARNING_MODULES: SkillLearningConfig[] = [
  WRITING_MODULE,
  SPEAKING_MODULE,
  LISTENING_MODULE,
  READING_MODULE,
];

export function getLessonSlug(moduleId: string, step: number): string {
  const prefix = moduleId.replace("-module", "");
  return `${prefix}-${step}`;
}

export function getLessonBySlug(slug: string) {
  for (const mod of ALL_LEARNING_MODULES) {
    const video = mod.videos.find(
      (v) => getLessonSlug(mod.id, v.step) === slug
    );
    if (video) {
      return {
        module: mod,
        video,
        moreVideos: mod.videos.filter((v) => v.step !== video.step),
      };
    }
  }
  return null;
}

export function toYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const v = parsed.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}?rel=0`;
  } catch {
    // Invalid URL
  }
  return null;
}
