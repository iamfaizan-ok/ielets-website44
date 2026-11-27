import type { Metadata } from "next";
import { RequireAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { WritingLibrary } from "@/components/WritingLibrary";
import { WritingReport } from "@/components/WritingReport";
import { SkillLearningModule } from "@/components/SkillLearningModule";
import { Footer } from "@/components/CtaFooter";
import { WRITING_MODULE } from "@/data/learningModules";

export const metadata: Metadata = {
  title: "IELTS Writing Tests — Books & Practice | Bandora",
  description:
    "Choose a Cambridge IELTS book, pick a Writing Task 1 & Task 2 test, and track your writing progress.",
};

export default function WritingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <RequireAuth>
          <WritingLibrary />
          <WritingReport />
          <SkillLearningModule
            module={WRITING_MODULE}
            eyebrowOverride="More Learn About Writing in IELTS"
            titleOverride="Learn IELTS Writing from Top Teachers"
            showCta={false}
          />
        </RequireAuth>
      </main>
      <Footer />
    </div>
  );
}
