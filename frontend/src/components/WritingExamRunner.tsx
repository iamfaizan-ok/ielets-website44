"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import type { WritingTestItem } from "@/data/writingTests";

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function WritingExamRunner({ test }: { test: WritingTestItem }) {
  const [activeTask, setActiveTask] = useState<"task1" | "task2">("task1");
  const [task1Text, setTask1Text] = useState("");
  const [task2Text, setTask2Text] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const w1 = countWords(task1Text);
  const w2 = countWords(task2Text);

  const estimatedBand =
    w1 >= 150 && w2 >= 250
      ? "7.5+"
      : w1 >= 100 && w2 >= 180
        ? "6.5"
        : "5.5";

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-amber transition-colors sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Writing Tests
        </Link>

        <span className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-forest">
          {test.book} · Test {test.testNumber} ({test.category})
        </span>
      </div>

      {/* Task Switcher */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setActiveTask("task1")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              activeTask === "task1"
                ? "bg-forest text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            Task 1 ({w1}/150 words)
          </button>
          <button
            type="button"
            onClick={() => setActiveTask("task2")}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              activeTask === "task2"
                ? "bg-forest text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            Task 2 ({w2}/250 words)
          </button>
        </div>

        <p className="text-xs text-muted">
          Use the <strong>Header Timer</strong> above to start your 60-minute
          timeline.
        </p>
      </div>

      {/* Split Workspace */}
      <div className="mt-5 grid gap-6 lg:grid-cols-12">
        {/* Prompt Panel */}
        <article className="lg:col-span-5 rounded-3xl border border-border bg-surface p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-amber">
            {activeTask === "task1"
              ? `Task 1 · ${test.task1Type} (20 min · min 150 words)`
              : `Task 2 · ${test.task2Type} (40 min · min 250 words)`}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink sm:text-base">
            {activeTask === "task1" ? test.task1Prompt : test.task2Prompt}
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-cream/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-forest">
              Recommended Structure
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              {test.sampleOutline}
            </p>
          </div>
        </article>

        {/* Writing Editor */}
        <div className="lg:col-span-7 rounded-3xl border border-border bg-surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="writing-editor"
                className="text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Your {activeTask === "task1" ? "Task 1" : "Task 2"} Response
              </label>
              <span className="text-xs font-bold text-forest">
                {activeTask === "task1" ? w1 : w2} words
              </span>
            </div>

            <textarea
              id="writing-editor"
              rows={12}
              value={activeTask === "task1" ? task1Text : task2Text}
              onChange={(e) =>
                activeTask === "task1"
                  ? setTask1Text(e.target.value)
                  : setTask2Text(e.target.value)
              }
              placeholder={
                activeTask === "task1"
                  ? "Write at least 150 words summarising the key features..."
                  : "Write at least 250 words presenting a clear, well-supported essay..."
              }
              className="mt-3 w-full rounded-2xl border border-border bg-cream/40 p-4 text-sm leading-relaxed text-ink placeholder:text-muted/60 focus:border-forest focus:bg-surface focus:outline-none"
            />
          </div>

          {submitted && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-950">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                Writing Test Submitted!
              </div>
              <p className="mt-1">
                Task 1: <strong>{w1} words</strong> · Task 2:{" "}
                <strong>{w2} words</strong> · Readiness Band:{" "}
                <strong>{estimatedBand}</strong>
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => {
                setTask1Text("");
                setTask2Text("");
                setSubmitted(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-cream-dark"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>

            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="rounded-full bg-amber px-6 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-amber-hover sm:text-sm"
            >
              Submit Writing Test
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
