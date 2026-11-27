import type { Metadata } from "next";
import { RequireAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { ReadingHero } from "@/components/ReadingHero";
import { ReadingWorkspace } from "@/components/ReadingWorkspace";
import { Footer } from "@/components/CtaFooter";

export const metadata: Metadata = {
  title: "IELTS Reading — Practice & Performance | Bandora",
  description:
    "Practice IELTS Academic Reading passages with instant answers and Day/Week/Month performance tracking.",
};

export default function ReadingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <RequireAuth>
          <ReadingHero />
          <ReadingWorkspace />
        </RequireAuth>
      </main>
      <Footer />
    </div>
  );
}
