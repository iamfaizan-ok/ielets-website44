import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequireAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { WritingExamRunner } from "@/components/WritingExamRunner";
import { WritingReport } from "@/components/WritingReport";
import { Footer } from "@/components/CtaFooter";
import { WRITING_TESTS } from "@/data/writingTests";

export const metadata: Metadata = {
  title: "Give Writing Test — Bandora",
  description: "Timed IELTS Writing Task 1 and Task 2 practice workspace.",
};

export function generateStaticParams() {
  return WRITING_TESTS.map((t) => ({ testId: t.id }));
}

export default async function WritingTestPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const { testId } = await params;
  const test = WRITING_TESTS.find((t) => t.id === testId);
  if (!test) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <RequireAuth>
          <WritingExamRunner test={test} />
          <WritingReport />
        </RequireAuth>
      </main>
      <Footer />
    </div>
  );
}
