import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { DashboardHero } from "@/components/DashboardHero";
import { ModulesSection } from "@/components/ModulesSection";
import { SkillLearningModule } from "@/components/SkillLearningModule";
import { Footer } from "@/components/CtaFooter";
import { SPEAKING_MODULE, WRITING_MODULE } from "@/data/learningModules";

export const metadata: Metadata = {
  title: "Dashboard — Bandora",
  description: "Your personalized IELTS practice dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-6">
        <DashboardHero />
        <ModulesSection />
        <SkillLearningModule module={WRITING_MODULE} />
        <SkillLearningModule module={SPEAKING_MODULE} />
      </main>
      <Footer />
    </div>
  );
}
