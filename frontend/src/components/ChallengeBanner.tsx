import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ChallengeBanner() {
  return (
    <section id="challenge" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-border bg-surface px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center">
        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">
            Daily Habit
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink">
            Make today a practice day.
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            One short challenge a day keeps your English sharp and your
            confidence high.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="rounded-2xl bg-cream px-5 py-3 border border-border">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-3xl font-semibold text-ink">
                15
              </span>
              <span className="text-sm font-medium text-muted">min</span>
            </div>
            <p className="text-xs text-muted">Recommended daily goal</p>
          </div>

          <Link
            href="#get-started"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-amber-hover"
          >
            Try today&apos;s challenge
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
