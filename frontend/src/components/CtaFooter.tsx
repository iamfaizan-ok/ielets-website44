import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { FOOTER_COLUMNS } from "@/data/landing";
import { BrandLogo } from "./Navbar";

const CTA_PERKS = ["Free modules", "Daily challenges", "Progress tracking"];

export function CtaFooter() {
  return (
    <>
      <section id="get-started" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-forest px-6 py-10 text-white sm:px-12 sm:py-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200/80">
              Get Started
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Give your ambition a little more.
            </h2>
            <p className="mt-3 text-sm text-emerald-100/85 sm:text-base">
              Start with Bandora today. No credit card required.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-emerald-100/90 sm:text-sm">
              {CTA_PERKS.map((perk) => (
                <li key={perk} className="inline-flex items-center gap-2">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Check className="h-3 w-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2.5 shrink-0">
            <Link
              href="#modules"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-hover"
            >
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-xs text-emerald-200/75">
              Free forever plan. Upgrade anytime.
            </span>
          </div>
        </div>
      </section>

      <footer className="bg-forest-dark text-white mt-auto">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <BrandLogo light />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-emerald-100/75">
                Better English. Bigger ambitions. Calm, focused IELTS practice
                designed for everyday progress.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.heading}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-200/70">
                    {col.heading}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((label) => (
                      <li key={label}>
                        <Link
                          href="#modules"
                          className="text-sm text-emerald-100/80 transition-colors hover:text-white"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-emerald-200/60 sm:flex-row sm:items-center">
            <p>© 2026 Bandora. All rights reserved.</p>
            <p>Built for focused IELTS preparation.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
