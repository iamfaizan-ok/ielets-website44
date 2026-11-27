import type { Metadata } from "next";
import { RequireAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { DashboardHero } from "@/components/DashboardHero";
import { DashboardAnalytics } from "@/components/DashboardAnalytics";
import { ModulesSection } from "@/components/ModulesSection";
import { SkillLearningModule } from "@/components/SkillLearningModule";
import { Footer } from "@/components/CtaFooter";
import {
  LISTENING_MODULE,
  READING_MODULE,
  SPEAKING_MODULE,
  WRITING_MODULE,
} from "@/data/learningModules";

export const metadata: Metadata = {
  title: "Dashboard — Bandora",
  description: "Your personalized IELTS practice dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-6">
        <RequireAuth>
          <DashboardHero />
          <DashboardAnalytics />
          <ModulesSection />
          <SkillLearningModule module={WRITING_MODULE} />
          <SkillLearningModule module={SPEAKING_MODULE} />
          <SkillLearningModule module={LISTENING_MODULE} />
          <SkillLearningModule module={READING_MODULE} />
        </RequireAuth>
      </main>
      <Footer />
    </div>
  );
}
