import type { Metadata } from "next";
import { AuthCard } from "@/components/AuthCard";

export const metadata: Metadata = {
  title: "Sign Up — Bandora",
  description: "Create your free Bandora IELTS learning account.",
};

export default function SignupPage() {
  return <AuthCard mode="signup" />;
}
