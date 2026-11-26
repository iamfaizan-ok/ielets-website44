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
  icon: "writing" | "speaking";
  teachersHeading: string;
  videosHeading: string;
  teachers: SkillTeacher[];
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
