"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { WRITING_BOOK_SERIES, WRITING_TESTS } from "@/data/writingTests";

export function WritingLibrary() {
  const [selectedBook, setSelectedBook] = useState<string>("All");
  const [searchInput, setSearchInput] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  const query = appliedQuery.trim().toLowerCase();

  const visibleSeries = WRITING_BOOK_SERIES.filter(
    (s) => selectedBook === "All" || s.name === selectedBook
  );

  function matchesSearch(book: string, title: string, t1: string, t2: string) {
    if (!query) return true;
    return `${book} ${title} ${t1} ${t2}`.toLowerCase().includes(query);
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 sm:pt-8">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Filters Sidebar */}
        <aside className="lg:col-span-3 rounded-3xl border border-border bg-surface p-5">
          <h2 className="font-serif text-xl font-semibold text-ink">Filters</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAppliedQuery(searchInput);
            }}
            className="mt-4 space-y-3"
          >
            <label
              htmlFor="writing-search"
              className="block text-xs font-semibold text-ink"
            >
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                id="writing-search"
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setAppliedQuery(e.target.value);
                }}
                placeholder="Search books or tests..."
                className="w-full rounded-xl border border-border bg-cream/50 py-2 pl-8 pr-3 text-xs text-ink placeholder:text-muted/70 focus:border-forest focus:bg-surface focus:outline-none"
              />
            </div>
            <p className="text-[11px] leading-snug text-muted">
              Search across book names, Task 1 &amp; Task 2 topics.
            </p>
            <button
              type="submit"
              className="w-full rounded-xl bg-amber py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-amber-hover"
            >
              Filter
            </button>
          </form>
        </aside>

        {/* Right Books Pills + Compact Tests */}
        <div className="lg:col-span-9 space-y-5">
          {/* Top Book Name Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedBook("All")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
                selectedBook === "All"
                  ? "bg-forest text-white"
                  : "border border-border bg-surface text-ink hover:bg-cream-dark"
              }`}
            >
              All
            </button>

            {WRITING_BOOK_SERIES.map((series) => {
              const active = selectedBook === series.name;
              return (
                <button
                  key={series.name}
                  type="button"
                  onClick={() => setSelectedBook(series.name)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? "border-forest bg-forest text-white"
                      : "border-border bg-surface text-ink hover:bg-cream-dark"
                  }`}
                >
                  {series.name}
                  {series.featured && (
                    <Star
                      className={`h-3 w-3 ${
                        active
                          ? "fill-amber text-amber"
                          : "fill-forest/80 text-forest"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tests Container */}
          <div className="rounded-3xl border border-border bg-surface p-5 sm:p-6">
            <p className="text-xs font-medium text-muted">
              Showing:{" "}
              <strong className="text-ink">
                {selectedBook === "All" ? "All Tests" : selectedBook}
              </strong>
            </p>

            <div className="mt-4 space-y-7">
              {visibleSeries.map((series) => {
                const tests = WRITING_TESTS.filter(
                  (t) =>
                    t.book === series.name &&
                    matchesSearch(
                      t.book,
                      `Test ${t.testNumber}`,
                      t.task1Type,
                      t.task2Type
                    )
                );
                if (tests.length === 0) return null;

                return (
                  <div key={series.name}>
                    <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
                      {series.name}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {series.description}
                    </p>

                    <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                      {tests.map((test) => (
                        <article
                          key={test.id}
                          className="flex flex-col justify-between rounded-2xl border border-border bg-cream/40 p-4 transition-colors hover:border-forest/40 hover:bg-cream"
                        >
                          <div>
                            <h3 className="text-sm font-bold leading-snug text-forest">
                              {test.book} Writing Test {test.testNumber}
                            </h3>
                            <p className="mt-1.5 text-[11px] text-muted">
                              {test.task1Type} · {test.task2Type}
                            </p>
                          </div>

                          <Link
                            href={`/writing/${test.id}`}
                            className="mt-4 block w-full rounded-xl bg-forest py-2 text-center text-xs font-bold text-white transition-colors hover:bg-forest-dark"
                          >
                            Give Test
                          </Link>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
