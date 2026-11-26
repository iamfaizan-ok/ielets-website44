"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, PenLine } from "lucide-react";
import { WRITING_BOOKS, WRITING_TESTS } from "@/data/writingTests";

export function WritingLibrary() {
  const [selectedBook, setSelectedBook] = useState<string>(WRITING_BOOKS[0]);
  const [category, setCategory] = useState<"All" | "Academic" | "General">(
    "All"
  );

  const filteredTests = WRITING_TESTS.filter(
    (t) =>
      t.book === selectedBook &&
      (category === "All" || t.category === category)
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8">
      {/* Intro + Sequence */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">
              <PenLine className="h-3.5 w-3.5" />
              IELTS Writing Tests Collection
            </span>
            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Choose a Book &amp; Practice Writing
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              Select a Cambridge IELTS volume below, pick a practice test, and
              click <strong>Give Test</strong> to open the timed 60-minute
              writing workspace.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-border bg-cream p-1 self-start">
            {(["All", "Academic", "General"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  category === cat
                    ? "bg-forest text-white"
                    : "text-muted hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Step 1: Choose Book */}
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Step 1 — Select Cambridge Book
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {WRITING_BOOKS.map((book) => (
              <button
                key={book}
                type="button"
                onClick={() => setSelectedBook(book)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-colors sm:text-sm ${
                  selectedBook === book
                    ? "border-forest bg-forest text-white shadow-xs"
                    : "border-border bg-cream/60 text-ink hover:bg-cream-dark"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {book}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2: Practice Tests List */}
      <div className="mt-8">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            {selectedBook} — Practice Tests
          </h2>
          <span className="text-xs font-medium text-muted">
            {filteredTests.length}{" "}
            {filteredTests.length === 1 ? "test" : "tests"} available
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filteredTests.map((test) => (
            <article
              key={test.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all hover:border-forest/40 hover:shadow-xs sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest">
                    {test.book} · Test {test.testNumber}
                  </span>
                  <span className="rounded-full border border-border bg-cream px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                    {test.category}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber">
                      Task 1 · {test.task1Type}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/90 sm:text-sm">
                      {test.task1Prompt}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-forest">
                      Task 2 · {test.task2Type}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/90 sm:text-sm">
                      {test.task2Prompt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                  <Clock className="h-3.5 w-3.5" />
                  60 min · 150 + 250 words
                </span>
                <Link
                  href={`/writing/${test.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-amber-hover"
                >
                  Give Test
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
