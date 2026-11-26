"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import {
  QUESTION_TYPE_STATS,
  READING_REPORT_DATA,
  type ReportPeriod,
} from "@/data/reading";

const PERIODS: { id: ReportPeriod; label: string }[] = [
  { id: "day", label: "Day by Day" },
  { id: "week", label: "Week by Week" },
  { id: "month", label: "Month by Month" },
];

export function ReadingReport({
  latestAccuracy,
}: {
  latestAccuracy: number | null;
}) {
  const [period, setPeriod] = useState<ReportPeriod>("day");
  const report = READING_REPORT_DATA[period];

  const points =
    period === "day" && latestAccuracy !== null
      ? report.points.map((pt, i) =>
          i === report.points.length - 1
            ? {
                ...pt,
                accuracy: latestAccuracy,
                band: Number((5 + (latestAccuracy / 100) * 3.5).toFixed(1)),
              }
            : pt
        )
      : report.points;

  return (
    <section
      id="reading-report"
      className="mx-auto max-w-6xl px-4 pb-14 sm:px-6"
    >
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
              <BarChart3 className="h-3.5 w-3.5" />
              Reading Performance Report
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Track Your Reading Progress
            </h2>
          </div>

          {/* Day / Week / Month Switcher */}
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

        {/* Summary KPI Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-cream/60 p-4">
            <p className="text-xs text-muted">Reading Band</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-forest">
              {report.summaryBand}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-cream/60 p-4">
            <p className="text-xs text-muted">Accuracy</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-ink">
              {latestAccuracy !== null && period === "day"
                ? `${latestAccuracy}%`
                : report.accuracy}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-cream/60 p-4">
            <p className="text-xs text-muted">Avg Pace</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-ink">
              {report.avgPace}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-cream/60 p-4">
            <p className="text-xs text-muted">Completed</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-amber">
              {report.completed}
            </p>
          </div>
        </div>

        {/* Chart + Question-Type Breakdown */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 rounded-2xl border border-border bg-cream/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Accuracy &amp; Band Trend ({PERIODS.find((p) => p.id === period)?.label})
            </p>
            <div className="mt-5 flex h-44 items-end justify-between gap-3">
              {points.map((pt) => (
                <div
                  key={pt.label}
                  className="flex flex-1 flex-col items-center gap-2 h-full justify-end"
                >
                  <span className="text-[11px] font-bold text-forest">
                    {pt.accuracy}%
                  </span>
                  <div className="w-full max-w-10 rounded-t-xl bg-cream-dark h-32 flex items-end overflow-hidden">
                    <div
                      style={{ height: `${pt.accuracy}%` }}
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
              Question Type Accuracy
            </p>
            <div className="mt-4 space-y-4">
              {QUESTION_TYPE_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between text-xs font-semibold text-ink">
                    <span>{stat.label}</span>
                    <span className="text-forest">{stat.accuracy}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-cream-dark overflow-hidden">
                    <div
                      style={{ width: `${stat.accuracy}%` }}
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
