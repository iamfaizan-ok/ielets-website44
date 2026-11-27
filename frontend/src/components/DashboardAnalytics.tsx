"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import {
  fetchAttemptHistory,
  fetchUserAnalytics,
  type AttemptSummary,
  type UserAnalytics,
} from "@/services/ieltsService";

export function DashboardAnalytics() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [history, setHistory] = useState<AttemptSummary[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([fetchUserAnalytics(), fetchAttemptHistory()])
      .then(([a, h]) => {
        if (!active) return;
        setAnalytics(a);
        setHistory(h.results.slice(0, 5));
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load analytics.");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="history-analytics" className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-forest">
              <BarChart3 className="h-3.5 w-3.5" />
              My Progress &amp; Recent Attempts
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
              Personal IELTS Analytics
            </h2>
          </div>

          {analytics && (
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="rounded-full bg-cream px-3.5 py-1.5 border border-border">
                Avg Band:{" "}
                <strong className="text-forest">
                  {analytics.overall_average_band ?? "—"}
                </strong>
              </span>
              <span className="rounded-full bg-cream px-3.5 py-1.5 border border-border">
                Attempts:{" "}
                <strong className="text-ink">{analytics.total_attempts}</strong>
              </span>
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-4 text-xs text-rose-700">{error}</p>
        ) : history.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            No completed attempts yet. Start a Reading or Writing test to see
            your live PostgreSQL progress here.
          </p>
        ) : (
          <div className="mt-4 space-y-2.5">
            {history.map((item) => (
              <Link
                key={item.id}
                href={`/result/${item.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-cream/40 px-4 py-3 transition-colors hover:border-forest/40 hover:bg-cream"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">
                    {item.test_title}
                  </p>
                  <p className="text-xs text-muted capitalize">
                    {item.module} · {item.status} ·{" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-xs font-bold text-white shrink-0">
                  Band {item.band_score}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
