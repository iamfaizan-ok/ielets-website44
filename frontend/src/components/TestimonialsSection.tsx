import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/landing";

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Different journeys. Shared ambition.
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            A few stories from learners who trained with Bandora.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-ink">
          <Star className="h-4 w-4 fill-amber text-amber" />
          <span>4.9 / 5 average rating</span>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <article
            key={item.name}
            className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6"
          >
            <div>
              <div className="flex gap-1 text-amber" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber text-amber" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/60">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${item.avatarBg}`}
              >
                {item.initials}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{item.name}</p>
                <p className="text-xs font-medium text-forest">{item.score}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
