import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { WritingLibrary } from "@/components/WritingLibrary";
import { WritingReport } from "@/components/WritingReport";
import { Footer } from "@/components/CtaFooter";

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
        <WritingLibrary />
        <WritingReport />
      </main>
      <Footer />
    </div>
  );
}
