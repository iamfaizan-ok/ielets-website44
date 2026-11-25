"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface UserSession {
  name: string;
  isNew: boolean;
}

const DEFAULT_USER: UserSession = { name: "Learner", isNew: false };
const emptySubscribe = () => () => {};

function parseUser(raw: string | null): UserSession {
  if (!raw) return DEFAULT_USER;
  try {
    const parsed = JSON.parse(raw) as Partial<UserSession>;
    return parsed.name
      ? { name: parsed.name, isNew: Boolean(parsed.isNew) }
      : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

function IeltsDashboardIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg
        viewBox="0 0 440 340"
        fill="none"
        className="w-full h-auto"
        aria-label="IELTS study workspace illustration"
      >
        {/* Warm arch backdrop */}
        <path
          d="M60 306V165C60 84.92 124.92 20 205 20H235C315.08 20 380 84.92 380 165V306H60Z"
          fill="#F2E7D8"
        />
        <circle cx="332" cy="76" r="26" fill="#E8822A" fillOpacity="0.2" />
        <circle cx="102" cy="96" r="16" fill="#113B30" fillOpacity="0.1" />

        {/* Study card */}
        <rect
          x="96"
          y="78"
          width="248"
          height="176"
          rx="20"
          fill="#FFFFFF"
          stroke="#E6E1D6"
          strokeWidth="2"
        />

        {/* Top header bar inside card */}
        <rect x="120" y="102" width="84" height="10" rx="5" fill="#113B30" />
        <rect x="120" y="120" width="136" height="8" rx="4" fill="#E6E1D6" />

        {/* Target Band badge */}
        <rect x="274" y="98" width="48" height="36" rx="10" fill="#113B30" />
        <text
          x="298"
          y="114"
          textAnchor="middle"
          fill="#A7F3D0"
          fontSize="8"
          fontWeight="600"
          fontFamily="sans-serif"
        >
          BAND
        </text>
        <text
          x="298"
          y="128"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="700"
          fontFamily="sans-serif"
        >
          8.0
        </text>

        {/* 4 Skill progress bars */}
        <rect x="120" y="152" width="202" height="10" rx="5" fill="#FAF8F4" />
        <rect x="120" y="152" width="150" height="10" rx="5" fill="#10B981" />

        <rect x="120" y="174" width="202" height="10" rx="5" fill="#FAF8F4" />
        <rect x="120" y="174" width="132" height="10" rx="5" fill="#E8822A" />

        <rect x="120" y="196" width="202" height="10" rx="5" fill="#FAF8F4" />
        <rect x="120" y="196" width="118" height="10" rx="5" fill="#0EA5E9" />

        <rect x="120" y="218" width="202" height="10" rx="5" fill="#FAF8F4" />
        <rect x="120" y="218" width="164" height="10" rx="5" fill="#F43F5E" />

        {/* Desk base + books */}
        <rect x="64" y="268" width="312" height="14" rx="7" fill="#113B30" />
        <rect x="108" y="254" width="66" height="14" rx="3" fill="#E8822A" />
        <rect x="116" y="242" width="52" height="12" rx="3" fill="#1B5E4B" />
      </svg>
    </div>
  );
}

export function DashboardHero() {
  const rawUser = useSyncExternalStore(
    emptySubscribe,
    () => localStorage.getItem("bandora_user"),
    () => null
  );
  const user = parseUser(rawUser);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8">
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <span className="inline-block rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest">
            {user.isNew ? "Your IELTS Workspace" : "Student Dashboard"}
          </span>

          <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl">
            {user.isNew
              ? `Welcome, ${user.name}!`
              : `Welcome back, ${user.name}!`}
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            {user.isNew
              ? "Your personalized IELTS space is ready. Start your practicing with focused, 15-minute exercises across all four exam skills."
              : "Great to see you again. Pick up right where you left off and keep building steady confidence toward your target band score."}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <Link
              href="#modules"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-amber-hover"
            >
              {user.isNew ? "Start your Daily Practice" : "Continue practicing"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#modules"
              className="inline-flex items-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark"
            >
              Choose a module
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <IeltsDashboardIllustration />
        </div>
      </div>
    </section>
  );
}
