import Link from "next/link";
import { ArrowRight, BookOpen, Headphones, Mic, PenLine } from "lucide-react";
import { SKILL_MODULES } from "@/data/landing";

const MODULE_ICONS: Record<string, typeof Headphones> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic,
};

export function ModulesSection() {
  return (
    <section id="modules" className="mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-14">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Every skill. A stronger you.
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Choose a skill and start practicing with guided, interactive
            exercises.
          </p>
        </div>
        <Link
          href="#practice"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-amber transition-colors"
        >
          Explore all modules
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SKILL_MODULES.map((mod) => {
          const Icon = MODULE_ICONS[mod.id] ?? BookOpen;
          return (
            <article
              key={mod.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div>
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${mod.badgeBg} ${mod.badgeText}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-ink">
                  {mod.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {mod.description}
                </p>
              </div>

              <Link
                href={mod.href}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-amber transition-colors"
              >
                Start practicing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
