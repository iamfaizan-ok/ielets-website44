"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { RequireAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/CtaFooter";
import {
  fetchAttemptDetail,
  type AttemptDetail,
} from "@/services/ieltsService";

function ResultBody() {
  const params = useParams<{ attemptId: string }>();
  const attemptId = Number(params.attemptId);
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!attemptId) return;
    fetchAttemptDetail(attemptId)
      .then(setAttempt)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Could not load result.")
      );
  }, [attemptId]);

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-muted">
        Loading your evaluation report...
      </div>
    );
  }

  const reviewList = Array.isArray(attempt.ai_feedback?.review)
    ? (attempt.ai_feedback.review as Array<{
        question_id: number;
        order: number;
        user_answer: string;
        correct_answer: string;
        is_correct: boolean;
        explanation: string;
      }>)
    : [];

  const corrections = Array.isArray(attempt.ai_feedback?.sentence_corrections)
    ? (attempt.ai_feedback.sentence_corrections as string[])
    : [];
  const vocab = Array.isArray(attempt.ai_feedback?.upgraded_vocabulary)
    ? (attempt.ai_feedback.upgraded_vocabulary as string[])
    : [];
  const modelSample =
    typeof attempt.ai_feedback?.model_sample_band_8_5 === "string"
      ? attempt.ai_feedback.model_sample_band_8_5
      : "";
  const summary =
    typeof attempt.ai_feedback?.summary === "string"
      ? attempt.ai_feedback.summary
      : "";

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-14 sm:px-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-amber sm:text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mt-4 rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest">
              {attempt.module} Evaluation Report
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold text-ink sm:text-3xl">
              {attempt.test_title}
            </h1>
          </div>

          <div className="rounded-2xl bg-forest px-6 py-3 text-center text-white">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
              Band Score
            </p>
            <p className="font-serif text-3xl font-bold">{attempt.band_score}</p>
          </div>
        </div>

        {summary && (
          <p className="mt-4 text-sm leading-relaxed text-muted">{summary}</p>
        )}

        {/* Criteria Scores */}
        {Object.keys(attempt.criteria_scores || {}).length > 0 &&
          !attempt.criteria_scores.question_types && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(attempt.criteria_scores).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-2xl border border-border bg-cream/60 p-4"
                >
                  <p className="text-xs capitalize text-muted">
                    {k.replace(/_/g, " ")}
                  </p>
                  <p className="mt-1 font-serif text-2xl font-semibold text-forest">
                    {String(v)}
                  </p>
                </div>
              ))}
            </div>
          )}

        {/* Objective Review */}
        {reviewList.length > 0 && (
          <div className="mt-6 space-y-3">
            {reviewList.map((r) => (
              <div
                key={r.question_id}
                className={`rounded-2xl border p-4 text-xs sm:text-sm ${
                  r.is_correct
                    ? "border-emerald-200 bg-emerald-50/70 text-emerald-950"
                    : "border-rose-200 bg-rose-50/70 text-rose-950"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {r.is_correct ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-700" />
                  )}
                  Q{r.order}: Your answer &ldquo;{r.user_answer || "—"}&rdquo; ·
                  Correct: &ldquo;{r.correct_answer}&rdquo;
                </div>
                {r.explanation && (
                  <p className="mt-1 opacity-90">{r.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* AI Corrections & Vocabulary */}
        {corrections.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-cream/40 p-5">
            <h2 className="font-serif text-lg font-semibold text-ink">
              Sentence-Level Corrections
            </h2>
            <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm text-ink/90">
              {corrections.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {vocab.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {vocab.map((word, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200"
              >
                <Sparkles className="h-3 w-3 text-amber" />
                {word}
              </span>
            ))}
          </div>
        )}

        {modelSample && (
          <div className="mt-6 rounded-2xl border border-border bg-cream/60 p-5">
            <h2 className="font-serif text-lg font-semibold text-forest">
              Band 8.5+ Model Sample
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/90">
              {modelSample}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1">
        <RequireAuth>
          <Suspense fallback={null}>
            <ResultBody />
          </Suspense>
        </RequireAuth>
      </main>
      <Footer />
    </div>
  );
}
