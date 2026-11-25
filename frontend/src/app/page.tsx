import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ModulesSection } from "@/components/ModulesSection";
import { PracticeSection } from "@/components/PracticeSection";
import { ChallengeBanner } from "@/components/ChallengeBanner";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ResourcesSection } from "@/components/ResourcesSection";
import { CtaFooter } from "@/components/CtaFooter";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ModulesSection />
        <PracticeSection />
        <ChallengeBanner />
        <TestimonialsSection />
        <ResourcesSection />
      </main>
      <CtaFooter />
    </div>
  );
}
