"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Pause, Play, RotateCcw } from "lucide-react";
import { READING_TIMELINE } from "@/data/reading";

const EXAM_SECONDS = 60 * 60;

export function ReadingHero() {
  const [secondsLeft, setSecondsLeft] = useState(EXAM_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-8 sm:px-6 sm:pt-8">
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">
              <BookOpen className="h-3.5 w-3.5" />
              IELTS Academic Reading
            </span>
            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Master Reading Passages &amp; Pacing
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-muted sm:text-base">
              Train with timed passages, instant answer explanations, and
              day-by-day Band Score tracking.
            </p>
          </div>

          {/* Compact 60-min Timer Widget */}
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-cream px-5 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                Exam Timer
              </p>
              <p className="font-serif text-3xl font-semibold tabular-nums text-ink">
                {mins}:{secs}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRunning((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-hover"
              >
                {running ? (
                  <>
                    <Pause className="h-3.5 w-3.5" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-white" /> Start
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRunning(false);
                  setSecondsLeft(EXAM_SECONDS);
                }}
                aria-label="Reset timer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-muted hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Step Reading Timeline */}
        <div className="mt-7 grid gap-3 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {READING_TIMELINE.map((item, idx) => (
            <div
              key={item.step}
              className={`relative flex items-center gap-3 rounded-2xl border p-3.5 ${
                item.active
                  ? "border-forest bg-emerald-50/60"
                  : "border-border bg-cream/50"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  item.active
                    ? "bg-forest text-white"
                    : "bg-surface border border-border text-ink"
                }`}
              >
                {item.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs text-muted">{item.meta}</p>
              </div>
              {idx < READING_TIMELINE.length - 1 && (
                <ArrowRight className="hidden h-4 w-4 text-muted/60 lg:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="#reading-practice"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-amber transition-colors"
          >
            Jump to Passage Practice
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-border">•</span>
          <Link
            href="#reading-report"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-amber transition-colors"
          >
            View Performance Report
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
