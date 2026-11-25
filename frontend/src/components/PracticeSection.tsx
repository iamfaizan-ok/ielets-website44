import Link from "next/link";
import { ArrowRight, Mic, Sparkles } from "lucide-react";

const WAVE_HEIGHTS = [16, 28, 20, 36, 24, 40, 18, 32, 22, 34, 14, 26];

export function PracticeSection() {
  return (
    <section id="practice" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest">
          Your Daily Practice
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Less overthinking. More doing.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          No cluttered dashboards. Just clear, focused tools that help you
          practice effectively.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Left Dark Forest Card — Speaking */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-forest p-7 text-white sm:p-8">
          <div>
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
              Speaking
            </span>
            <h3 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">
              A safe space to speak up.
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-emerald-100/80">
              Practice speaking aloud without pressure and get instant fluency
              and pronunciation cues.
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-forest-dark/80 p-4 border border-white/10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber text-white">
                  <Mic className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-1" aria-hidden="true">
                  {WAVE_HEIGHTS.map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-1 rounded-full bg-emerald-300/80"
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-200/80">
                02:00
              </span>
            </div>
            <Link
              href="#challenge"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:text-white transition-colors"
            >
              Start a 2-min session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Right Light Card — Writing */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-border bg-surface p-7 sm:p-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
              <Sparkles className="h-3 w-3" />
              Writing Feedback
            </span>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-ink sm:text-3xl">
              Your ideas, expressed better.
            </h3>
            <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted">
              See how small vocabulary and coherence upgrades lift your Task 2
              essays from Band 6.5 to Band 7.5+.
            </p>
          </div>

          <div className="mt-7 rounded-2xl border border-border bg-cream p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Sample Revision
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-ink">
              &ldquo;Governments should{" "}
              <span className="line-through text-muted">put more money</span>{" "}
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-900">
                allocate greater funding
              </span>{" "}
              toward public transit to{" "}
              <span className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-900">
                alleviate urban congestion
              </span>
              .&rdquo;
            </p>
            <Link
              href="#challenge"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-amber transition-colors"
            >
              Improve my writing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
