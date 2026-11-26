import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { DashboardHero } from "@/components/DashboardHero";
import { ModulesSection } from "@/components/ModulesSection";
import { WritingLearningModule } from "@/components/WritingLearningModule";
import { Footer } from "@/components/CtaFooter";

export const metadata: Metadata = {
  title: "Dashboard — Bandora",
  description: "Your personalized IELTS practice dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <DashboardHero />
        <ModulesSection />
        <WritingLearningModule />
      </main>
      <Footer />
    </div>
  );
}
