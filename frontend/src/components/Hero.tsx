import Link from "next/link";
import { ArrowRight, Award, BookOpen, Clock } from "lucide-react";
import { HERO_FEATURES } from "@/data/landing";

const FEATURE_ICONS = [Award, BookOpen, Clock];

function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="0 0 420 340"
        fill="none"
        className="w-full h-auto"
        aria-label="Student practicing IELTS at a study desk"
      >
        {/* Warm arch backdrop */}
        <path
          d="M70 300V165C70 87.68 132.68 25 210 25C287.32 25 350 87.68 350 165V300H70Z"
          fill="#F2E7D8"
        />
        <circle cx="318" cy="78" r="24" fill="#E8822A" fillOpacity="0.22" />

        {/* Potted plant */}
        <path d="M84 260H116L111 298H89L84 260Z" fill="#D4711C" />
        <path
          d="M100 260C100 240 84 226 76 222C86 220 98 228 100 242C102 225 114 214 126 214C118 225 108 242 100 260Z"
          fill="#1B5E4B"
        />

        {/* Student */}
        <circle cx="215" cy="112" r="26" fill="#F3B892" />
        <path
          d="M190 108C190 92 202 82 216 82C232 82 242 93 241 110C234 102 223 99 212 100C202 101 194 104 190 108Z"
          fill="#16231F"
        />
        <path
          d="M168 232C168 176 188 150 215 150C242 150 262 176 262 232H168Z"
          fill="#E8822A"
        />

        {/* Desk */}
        <rect x="64" y="232" width="292" height="14" rx="7" fill="#113B30" />
        <rect x="92" y="246" width="12" height="54" rx="4" fill="#0B2921" />
        <rect x="316" y="246" width="12" height="54" rx="4" fill="#0B2921" />

        {/* Laptop */}
        <path d="M168 232L180 176H252L242 232H168Z" fill="#FFFFFF" stroke="#113B30" strokeWidth="3" />
        <rect x="155" y="226" width="96" height="6" rx="3" fill="#16231F" />
        <circle cx="210" cy="204" r="6" fill="#E8822A" />

        {/* Books stack */}
        <rect x="272" y="218" width="54" height="14" rx="3" fill="#1B5E4B" />
        <rect x="278" y="206" width="44" height="12" rx="3" fill="#E8822A" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-8 sm:px-6 sm:pt-8 sm:pb-10">
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">
            Online IELTS Preparation
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Big ambitions.
            <br />
            Better English.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Meet Bandora. Your space to train your English skills, build daily
            study habits, and feel ready for IELTS.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              Start learning free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#modules"
              className="inline-flex items-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark"
            >
              Explore our modules
            </Link>
          </div>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-surface px-3.5 py-2">
            <div className="flex -space-x-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 ring-2 ring-surface">
                AR
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-800 ring-2 ring-surface">
                DK
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-800 ring-2 ring-surface">
                SM
              </span>
            </div>
            <span className="text-xs font-medium text-muted">
              Join <strong className="text-ink">45k+ students</strong> on their
              IELTS journey
            </span>
          </div>
        </div>

        <div className="lg:col-span-6">
          <HeroIllustration />
        </div>
      </div>

      {/* 3-column value proposition strip */}
      <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3 sm:gap-6">
        {HERO_FEATURES.map((feat, idx) => {
          const Icon = FEATURE_ICONS[idx];
          return (
            <div key={feat.title} className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-border text-forest">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink">{feat.title}</h2>
                <p className="mt-0.5 text-sm text-muted">{feat.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
