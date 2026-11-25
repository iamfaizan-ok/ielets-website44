"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, X } from "lucide-react";
import { BrandLogo } from "./Navbar";

interface AuthCardProps {
  mode: "login" | "signup";
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.97Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

const INPUT_CLASS =
  "mt-1.5 w-full rounded-xl border border-border bg-cream/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-forest focus:bg-surface focus:outline-none";

export function AuthCard({ mode }: AuthCardProps) {
  const isSignup = mode === "signup";
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (isSignup && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ponytail: client-side session until Backend auth API is connected
    const fallbackName = email.split("@")[0]?.replace(/[._-]+/g, " ") || "Learner";
    const displayName = isSignup
      ? name.trim()
      : fallbackName.replace(/\b\w/g, (c) => c.toUpperCase());

    localStorage.setItem(
      "bandora_user",
      JSON.stringify({ name: displayName, email: email.trim(), isNew: isSignup })
    );
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-10 flex items-center justify-center">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
        <Link
          href="/"
          aria-label="Cancel and return home"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-cream-dark hover:text-ink"
        >
          <X className="h-4 w-4" />
        </Link>

        <BrandLogo />

        <h1 className="mt-5 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {isSignup ? "Create your free account" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {isSignup
            ? "Start practicing IELTS with daily 15-minute goals."
            : "Log in to continue your IELTS preparation."}
        </p>

        <button
          type="button"
          onClick={() => setError("Google sign-in will connect once Backend auth is enabled.")}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark"
        >
          <GoogleIcon />
          {isSignup ? "Sign up with Google" : "Log in with Google"}
        </button>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            or
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-ink">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Faizan Aslam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLASS}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-ink">
              {isSignup ? "Create Password" : "Password"}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={isSignup ? "new-password" : "current-password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${INPUT_CLASS} pr-10`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted hover:text-ink"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {isSignup && (
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-semibold text-ink"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${INPUT_CLASS} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  aria-label={
                    showConfirm ? "Hide confirm password" : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted hover:text-ink"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-bold text-white shadow-xs transition-colors hover:bg-amber-hover"
          >
            {isSignup ? "Create free account" : "Log in"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          {isSignup ? "Already have an account?" : "New to Bandora?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-forest hover:text-amber transition-colors"
          >
            {isSignup ? "Log in" : "Start learning free"}
          </Link>
        </p>
      </div>
    </main>
  );
}
