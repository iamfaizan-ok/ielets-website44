"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

export type ExamModule = "reading" | "listening" | "writing" | "speaking";

export interface ExamQuestion {
  id: number;
  order: number;
  question_type: string;
  prompt: string;
  options: string[];
}

export interface ExamPayload {
  id: number;
  module: ExamModule;
  title: string;
  book_series: string;
  category: string;
  content: Record<string, unknown>;
  media_url: string;
  duration_minutes: number;
  started_at: number;
  questions: ExamQuestion[];
}

export interface AttemptSummary {
  id: number;
  test_id: number;
  test_title: string;
  module: ExamModule;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  band_score: string;
  created_at: string;
}

export interface AttemptDetail extends AttemptSummary {
  task_id: string;
  user_answers: Record<string, unknown>;
  speaking_audio_url: string;
  criteria_scores: Record<string, unknown>;
  ai_feedback: Record<string, unknown>;
}

export interface UserAnalytics {
  total_attempts: number;
  overall_average_band: number | null;
  module_averages: Partial<Record<ExamModule, number>>;
  weakest_question_type: { question_type: string; accuracy: number } | null;
  progression: { date: string; module: ExamModule; band_score: number }[];
}

export function fetchNextExam(module: ExamModule) {
  return apiFetch<ExamPayload>(`/exams/next/${module}/`);
}

export function fetchExamList(module?: ExamModule) {
  const qs = module ? `?module=${module}` : "";
  return apiFetch<{ results: ExamPayload[] }>(`/exams/${qs}`);
}

export function submitObjectiveExam(
  test_id: number,
  answers: Record<string, string>
) {
  return apiFetch<{
    attempt_id: number;
    correct: number;
    total: number;
    band_score: string;
  }>("/evaluations/submit-objective/", {
    method: "POST",
    body: JSON.stringify({ test_id, answers }),
  });
}

export function submitWritingExam(
  test_id: number,
  task1_response: string,
  task2_response: string
) {
  return apiFetch<{
    attempt_id: number;
    task_id: string;
    status: string;
    remaining_credits: number;
  }>("/evaluations/submit-writing/", {
    method: "POST",
    body: JSON.stringify({ test_id, task1_response, task2_response }),
  });
}

export async function submitSpeakingWithPresignedUpload(
  test_id: number,
  audioBlob: Blob,
  contentType = "audio/webm"
) {
  const presign = await apiFetch<{
    upload_url: string;
    object_key: string;
  }>("/exams/upload-url/", {
    method: "POST",
    body: JSON.stringify({ content_type: contentType, file_size: audioBlob.size }),
  });

  const putRes = await fetch(presign.upload_url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: audioBlob,
  });
  if (!putRes.ok) {
    throw new Error("Failed to upload speaking audio to Cloudflare R2.");
  }

  return apiFetch<{
    attempt_id: number;
    task_id: string;
    status: string;
    remaining_credits: number;
  }>("/evaluations/submit-speaking/", {
    method: "POST",
    body: JSON.stringify({
      test_id,
      speaking_audio_key: presign.object_key,
      mime_type: contentType,
    }),
  });
}

export function fetchEvaluationStatus(attemptId: number) {
  return apiFetch<AttemptDetail>(`/evaluations/status/${attemptId}/`);
}

export function fetchAttemptHistory(module?: ExamModule) {
  const qs = module ? `?module=${module}` : "";
  return apiFetch<{ count: number; results: AttemptSummary[] }>(
    `/evaluations/history/${qs}`
  );
}

export function fetchAttemptDetail(attemptId: number) {
  return apiFetch<AttemptDetail>(`/evaluations/history/${attemptId}/`);
}

export function fetchUserAnalytics() {
  return apiFetch<UserAnalytics>("/evaluations/analytics/");
}

export function useEvaluationPolling(attemptId: number | null) {
  const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "COMPLETED" | "FAILED">(
    attemptId ? "PROCESSING" : "IDLE"
  );
  const [error, setError] = useState("");
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (!attemptId) return;
    let active = true;

    const interval = setInterval(async () => {
      try {
        const res = await fetchEvaluationStatus(attemptId);
        if (!active) return;

        if (res.status === "COMPLETED") {
          setStatus("COMPLETED");
          clearInterval(interval);
          await refreshUser();
          router.push(`/result/${attemptId}`);
        } else if (res.status === "FAILED") {
          setStatus("FAILED");
          setError("AI evaluation failed. Your credit has been refunded.");
          clearInterval(interval);
          await refreshUser();
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to check evaluation status.");
      }
    }, 2500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [attemptId, refreshUser, router]);

  return { status, error };
}
