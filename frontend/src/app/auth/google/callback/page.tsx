"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { consumeReturnUrl, useAuth } from "@/context/AuthContext";
import { BrandLogo } from "@/components/Navbar";

export default function GoogleCallbackPage() {
  const { completeGoogleAuth } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") ?? undefined;
    const state = params.get("state") ?? undefined;
    const oauthError = params.get("error") ?? undefined;

    completeGoogleAuth({ code, state, error: oauthError })
      .then(() => {
        router.replace(consumeReturnUrl() || "/dashboard");
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Google authentication could not be completed."
        );
      });
  }, [completeGoogleAuth, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-7 text-center shadow-sm">
        <div className="flex justify-center">
          <BrandLogo />
        </div>

        {error ? (
          <>
            <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
              {error}
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex rounded-full bg-forest px-5 py-2.5 text-xs font-bold text-white hover:bg-forest-dark"
            >
              Back to Login
            </Link>
          </>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted">
            <Loader2 className="h-6 w-6 animate-spin text-forest" />
            <span>Completing Google sign-in...</span>
          </div>
        )}
      </div>
    </main>
  );
}
