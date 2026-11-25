import type { Metadata } from "next";
import { AuthCard } from "@/components/AuthCard";

export const metadata: Metadata = {
  title: "Log In — Bandora",
  description: "Log in to your Bandora IELTS learning account.",
};

export default function LoginPage() {
  return <AuthCard mode="login" />;
}
