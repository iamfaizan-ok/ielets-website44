import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { COMPACT_RESOURCES } from "@/data/landing";

export function ResourcesSection() {
  return (
    <section id="resources" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Keep your curiosity going.
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Guides, study tips, and strategies to help you prepare smarter.
          </p>
        </div>
        <Link
          href="#get-started"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-amber transition-colors"
        >
          Explore all articles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Featured Left Card */}
        <article className="lg:col-span-6 overflow-hidden rounded-3xl border border-border bg-surface flex flex-col">
          <div className="h-52 w-full bg-gradient-to-br from-forest via-emerald-900 to-amber-900/70 p-6 flex items-end">
            <span className="rounded-full bg-white/15 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-white">
              Study Habits
            </span>
          </div>
          <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-ink">
                A study routine that actually sticks
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                Why 15 focused minutes a day beats weekend cramming—and how to
                structure your week across all four IELTS skills.
              </p>
            </div>
            <Link
              href="#get-started"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-amber transition-colors"
            >
              Read guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>

        {/* Right Stacked Resource List */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          {COMPACT_RESOURCES.map((res) => (
            <Link
              key={res.title}
              href={res.href}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:border-forest/40 hover:shadow-xs"
            >
              <div>
                <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-forest transition-colors">
                  {res.title}
                </h3>
                <p className="mt-1 text-xs text-muted">{res.meta}</p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-ink group-hover:bg-forest group-hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
