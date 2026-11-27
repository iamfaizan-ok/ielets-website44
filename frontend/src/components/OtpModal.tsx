"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { Loader2, Mail, X, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(3, local.length));
  return `${visible}***@${domain}`;
}

export function OtpModal({
  email,
  onClose,
  onSuccess,
}: {
  email: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { verifyOtp, resendOtp } = useAuth();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  async function submitCode(code: string) {
    setVerifying(true);
    setError("");
    try {
      await verifyOtp(email, code);
      onSuccess();
    } catch {
      setError("Incorrect code — check your Gmail and try again");
      setShake(true);
      setTimeout(() => setShake(false), 380);
      setDigits(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 20);
    } finally {
      setVerifying(false);
    }
  }

  function handleChange(idx: number, raw: string) {
    const val = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    setError("");

    if (val && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }
    if (val && next.every((d) => d.length === 1)) {
      void submitCode(next.join(""));
    }
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const next = pasted.split("");
      setDigits(next);
      inputRefs.current[3]?.focus();
      void submitCode(pasted);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await resendOtp(email);
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code.");
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Verify Gmail 4-digit code"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 backdrop-blur-xs px-4"
    >
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close verification modal"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:bg-cream-dark hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-forest">
          <Mail className="h-5 w-5" />
        </div>

        <h2 className="mt-4 font-serif text-xl font-semibold text-ink">
          Check your Gmail
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          We sent a 4-digit code to{" "}
          <strong className="text-ink">{maskEmail(email)}</strong>
        </p>

        {/* 4 Numeric OTP Inputs */}
        <div
          className={`mt-5 flex justify-between gap-3 ${
            shake ? "animate-otp-shake" : ""
          }`}
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              disabled={verifying}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${i + 1}`}
              className={`h-14 w-14 rounded-2xl border-2 text-center font-serif text-2xl font-bold text-ink transition-colors focus:outline-none ${
                error
                  ? "border-[#DC2626] bg-rose-50/60"
                  : "border-border bg-cream/50 focus:border-forest focus:bg-surface"
              }`}
            />
          ))}
        </div>

        {verifying && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-forest">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Verifying code...
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-[#DC2626]"
          >
            <XCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-5 text-center text-xs text-muted">
          {cooldown > 0 ? (
            <span>Resend code in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={() => void handleResend()}
              className="font-semibold text-forest hover:text-amber transition-colors"
            >
              Resend to Gmail
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
