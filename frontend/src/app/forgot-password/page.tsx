"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BrandLogo } from "@/components/Navbar";

const INPUT_CLASS =
  "mt-1.5 w-full rounded-xl border border-border bg-cream/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-forest focus:bg-surface focus:outline-none";

export default function ForgotPasswordPage() {
  const { requestPasswordReset, confirmPasswordReset } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const msg = await requestPasswordReset(email);
      setMessage(msg);
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset code.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await confirmPasswordReset({ email, otp, password, confirmPassword });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
        <BrandLogo />
        <h1 className="mt-5 font-serif text-2xl font-semibold text-ink">
          Reset your password
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {step === "request"
            ? "Enter your email to receive a 4-digit reset code."
            : "Enter the 4-digit code sent to your email and choose a new password."}
        </p>

        {message && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-900">
            {message}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800"
          >
            {error}
          </p>
        )}

        {step === "request" ? (
          <form onSubmit={handleRequest} className="mt-5 space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold text-ink">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={INPUT_CLASS}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-bold text-white hover:bg-amber-hover disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send reset code"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="mt-5 space-y-4">
            <div>
              <label htmlFor="reset-otp" className="block text-xs font-semibold text-ink">
                4-Digit Code
              </label>
              <input
                id="reset-otp"
                type="text"
                inputMode="numeric"
                maxLength={4}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="1234"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="new-pw" className="block text-xs font-semibold text-ink">
                New Password
              </label>
              <input
                id="new-pw"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="confirm-pw" className="block text-xs font-semibold text-ink">
                Confirm New Password
              </label>
              <input
                id="confirm-pw"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className={INPUT_CLASS}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-bold text-white hover:bg-amber-hover disabled:opacity-60"
            >
              {submitting ? "Updating..." : "Update password"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-amber"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Login
        </Link>
      </div>
    </main>
  );
}
