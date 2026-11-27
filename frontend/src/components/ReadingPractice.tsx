"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { READING_PASSAGES } from "@/data/reading";
import {
  fetchNextExam,
  submitObjectiveExam,
  type ExamPayload,
} from "@/services/ieltsService";

function estimateBand(correct: number, total: number): string {
  const ratio = total > 0 ? correct / total : 0;
  if (ratio >= 0.9) return "8.5";
  if (ratio >= 0.8) return "7.5";
  if (ratio >= 0.6) return "6.5";
  if (ratio >= 0.4) return "5.5";
  return "5.0";
}

export function ReadingPractice({
  onComplete,
}: {
  onComplete?: (accuracy: number) => void;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [liveExam, setLiveExam] = useState<ExamPayload | null>(null);
  const [passageIdx, setPassageIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchNextExam("reading")
      .then((exam) => {
        if (exam.questions?.length) setLiveExam(exam);
      })
      .catch(() => {
        // Fallback to local sample if backend has no seeded reading tests yet
      });
  }, [user]);

  const passage = READING_PASSAGES[passageIdx];
  const activeQuestions = liveExam
    ? liveExam.questions.map((q) => ({
        id: String(q.id),
        prompt: q.prompt,
        options: q.options.length ? q.options : undefined,
        answer: "",
        explanation: "",
      }))
    : passage.questions;

  function selectPassage(idx: number) {
    setPassageIdx(idx);
    setAnswers({});
    setChecked(false);
  }

  async function handleCheck() {
    if (liveExam && user) {
      setSubmitting(true);
      setApiError("");
      try {
        const res = await submitObjectiveExam(liveExam.id, answers);
        const pct = Math.round((res.correct / Math.max(1, res.total)) * 100);
        onComplete?.(pct);
        router.push(`/result/${res.attempt_id}`);
        return;
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Submission failed.");
      } finally {
        setSubmitting(false);
      }
    }

    setChecked(true);
    const correctCount = passage.questions.filter(
      (q) =>
        (answers[q.id] ?? "").trim().toLowerCase() === q.answer.toLowerCase()
    ).length;
    const pct = Math.round((correctCount / passage.questions.length) * 100);
    onComplete?.(pct);
  }

  const score = passage.questions.filter(
    (q) => (answers[q.id] ?? "").trim().toLowerCase() === q.answer.toLowerCase()
  ).length;

  return (
    <section
      id="reading-practice"
      className="mx-auto max-w-6xl px-4 pb-10 sm:px-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest">
            Interactive Practice
          </p>
          <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Passage &amp; Answer Check
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {READING_PASSAGES.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPassage(idx)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                idx === passageIdx
                  ? "bg-forest text-white"
                  : "border border-border bg-surface text-ink hover:bg-cream-dark"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-12">
        {/* Left: Passage */}
        <article className="lg:col-span-6 rounded-3xl border border-border bg-surface p-6 sm:p-7">
          <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
            <span className="text-xs font-semibold text-forest">
              {liveExam ? liveExam.book_series : passage.topic}
            </span>
            <span className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-muted">
              {liveExam ? liveExam.duration_minutes : passage.recommendedMinutes} min target
            </span>
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold text-ink sm:text-2xl">
            {liveExam ? liveExam.title : passage.title}
          </h3>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink/90">
            {liveExam ? (
              <p className="whitespace-pre-line">
                {String(liveExam.content?.text ?? "")}
              </p>
            ) : (
              passage.paragraphs.map((para) => (
                <p key={para.key}>
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-cream-dark text-xs font-bold text-forest">
                    {para.key}
                  </span>
                  {para.text}
                </p>
              ))
            )}
          </div>
        </article>

        {/* Right: Questions & Instant Answers */}
        <div className="lg:col-span-6 rounded-3xl border border-border bg-surface p-6 sm:p-7 flex flex-col justify-between">
          {apiError && (
            <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs text-rose-800">
              {apiError}
            </p>
          )}
          <div className="space-y-5">
            {activeQuestions.map((q, index) => {
              const userVal = answers[q.id] ?? "";
              const isCorrect =
                userVal.trim().toLowerCase() === q.answer.toLowerCase();

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-border bg-cream/50 p-4"
                >
                  <p className="text-xs font-semibold text-ink sm:text-sm">
                    {index + 1}. {q.prompt}
                  </p>

                  {q.options ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                          }
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                            userVal === opt
                              ? "border-forest bg-forest text-white"
                              : "border-border bg-surface text-ink hover:bg-cream-dark"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={userVal}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      placeholder="Type your answer..."
                      className="mt-3 w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-ink focus:border-forest focus:outline-none sm:text-sm"
                    />
                  )}

                  {checked && (
                    <div
                      className={`mt-3 rounded-xl px-3 py-2 text-xs ${
                        isCorrect
                          ? "bg-emerald-50 text-emerald-900"
                          : "bg-rose-50 text-rose-900"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold">
                        {isCorrect ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-rose-700" />
                        )}
                        <span>
                          {isCorrect
                            ? "Correct"
                            : `Answer: ${q.answer}`}
                        </span>
                      </div>
                      <p className="mt-1 opacity-90">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            {checked ? (
              <div className="text-sm font-semibold text-ink">
                Score:{" "}
                <span className="text-forest">
                  {score}/{passage.questions.length}
                </span>{" "}
                · Est. Band{" "}
                <span className="text-amber">
                  {estimateBand(score, passage.questions.length)}
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted">
                Answer all {passage.questions.length} questions, then check.
              </span>
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setChecked(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-cream-dark"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleCheck()}
                className="rounded-full bg-amber px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-amber-hover disabled:opacity-60"
              >
                {submitting ? "Grading..." : "Check Answers"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
