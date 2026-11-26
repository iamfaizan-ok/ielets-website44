"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  WRITING_CRITERIA_STATS,
  WRITING_REPORT_DATA,
  type WritingReportPeriod,
} from "@/data/writingTests";

const PERIODS: { id: WritingReportPeriod; label: string }[] = [
  { id: "day", label: "Day by Day" },
  { id: "week", label: "Week by Week" },
  { id: "month", label: "Month by Month" },
];

export function WritingReport() {
  const [period, setPeriod] = useState<WritingReportPeriod>("day");
  const report = WRITING_REPORT_DATA[period];

  return (
    <section
      id="writing-report"
      className="mx-auto max-w-6xl px-4 pb-14 sm:px-6"
    >
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
              <BarChart3 className="h-3.5 w-3.5" />
              Progress in Writing Test
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Your Writing Performance
            </h2>
          </div>

          <div className="inline-flex rounded-full border border-border bg-cream p-1 self-start sm:self-auto">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  period === p.id
                    ? "bg-forest text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-cream/60 p-4">
            <p className="text-xs text-muted">Writing Band</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-forest">
              {report.band}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-cream/60 p-4">
            <p className="text-xs text-muted">Avg Word Count</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-ink">
              {report.avgWords}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-cream/60 p-4">
            <p className="text-xs text-muted">On-Time Rate</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-ink">
              {report.onTimeRate}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-cream/60 p-4">
            <p className="text-xs text-muted">Tests Completed</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-amber">
              {report.testsDone}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-2xl border border-border bg-cream/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Writing Score Trend ({PERIODS.find((p) => p.id === period)?.label})
            </p>
            <div className="mt-5 flex h-44 items-end justify-between gap-3">
              {report.points.map((pt) => (
                <div
                  key={pt.label}
                  className="flex flex-1 flex-col items-center gap-2 h-full justify-end"
                >
                  <span className="text-[11px] font-bold text-forest">
                    {pt.score}%
                  </span>
                  <div className="w-full max-w-10 rounded-t-xl bg-cream-dark h-32 flex items-end overflow-hidden">
                    <div
                      style={{ height: `${pt.score}%` }}
                      className="w-full rounded-t-xl bg-forest transition-all duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-muted">
                    {pt.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-border bg-cream/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Examiner Criteria Breakdown
            </p>
            <div className="mt-4 space-y-4">
              {WRITING_CRITERIA_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between text-xs font-semibold text-ink">
                    <span>{stat.label}</span>
                    <span className="text-forest">{stat.score}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-cream-dark overflow-hidden">
                    <div
                      style={{ width: `${stat.score}%` }}
                      className="h-full rounded-full bg-amber"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
