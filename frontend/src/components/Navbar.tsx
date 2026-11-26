"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  Clock,
  Headphones,
  LogOut,
  Menu,
  Mic,
  Pause,
  PenLine,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { NAV_LINKS, PRACTICE_ITEMS } from "@/data/landing";

const PRACTICE_ICONS: Record<string, typeof BookOpen> = {
  reading: BookOpen,
  listening: Headphones,
  writing: PenLine,
  speaking: Mic,
};

const NAV_BTN_CLASS =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark hover:text-forest";

export function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group shrink-0">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
          light ? "bg-amber text-white" : "bg-forest text-white"
        } transition-transform group-hover:scale-105`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 17C5 11.477 9.477 7 15 7h4v3c0 5.523-4.477 10-10 10H5v-3Z"
            fill="currentColor"
          />
          <circle cx="17" cy="7" r="2.5" fill="#E8822A" />
        </svg>
      </span>
      <span
        className={`font-serif text-xl font-semibold tracking-tight ${
          light ? "text-white" : "text-ink"
        }`}
      >
        Bandora
      </span>
    </Link>
  );
}

const WRITING_EXAM_SECONDS = 60 * 60;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isWriting = pathname?.startsWith("/writing");
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(WRITING_EXAM_SECONDS);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const timerMins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const timerSecs = String(secondsLeft % 60).padStart(2, "0");

  function handleLogout() {
    localStorage.removeItem("bandora_user");
    setOpen(false);
    router.push("/");
  }
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [mobilePracticeOpen, setMobilePracticeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setPracticeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-border/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <BrandLogo />

        <nav className="hidden items-center gap-1.5 lg:gap-2 md:flex">
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setPracticeOpen(true)}
            onMouseLeave={() => setPracticeOpen(false)}
          >
            <button
              type="button"
              onClick={() => setPracticeOpen((prev) => !prev)}
              aria-expanded={practiceOpen}
              className={NAV_BTN_CLASS}
            >
              Practice
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  practiceOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {practiceOpen && (
              <div className="absolute left-0 top-full pt-2.5">
                <div className="w-52 rounded-xl border border-border bg-surface p-1.5 shadow-md">
                  {PRACTICE_ITEMS.map((sub) => {
                    const Icon = PRACTICE_ICONS[sub.id] ?? BookOpen;
                    return (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setPracticeOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream hover:text-forest"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${sub.badgeBg} ${sub.badgeText}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map((item) => {
            const label =
              isDashboard && item.label === "My History"
                ? "My Progress"
                : item.label;
            return (
              <Link key={item.label} href={item.href} className={NAV_BTN_CLASS}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex shrink-0">
          {isWriting ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 shadow-2xs">
              <Clock className="h-3.5 w-3.5 text-forest" />
              <span className="font-serif text-sm font-bold tabular-nums text-ink">
                {timerMins}:{timerSecs}
              </span>
              <button
                type="button"
                onClick={() => setTimerRunning((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-full bg-amber px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-amber-hover"
              >
                {timerRunning ? (
                  <>
                    <Pause className="h-3 w-3" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-white" /> Start
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsLeft(WRITING_EXAM_SECONDS);
                }}
                aria-label="Reset writing timer"
                className="flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-cream-dark hover:text-ink"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          ) : isDashboard ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-cream-dark"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="whitespace-nowrap rounded-full bg-amber px-5 py-2 text-sm font-bold text-white shadow-xs transition-colors hover:bg-amber-hover"
              >
                Start learning free
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="inline-flex items-center justify-center rounded-lg p-2 text-ink hover:bg-cream-dark md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-cream px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setMobilePracticeOpen((prev) => !prev)}
              className="flex items-center justify-between py-1.5 text-sm font-medium text-ink"
            >
              Practice
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  mobilePracticeOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobilePracticeOpen && (
              <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3 pb-1">
                {PRACTICE_ITEMS.map((sub) => {
                  const Icon = PRACTICE_ICONS[sub.id] ?? BookOpen;
                  return (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 py-1 text-sm font-medium text-muted hover:text-ink"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${sub.badgeBg} ${sub.badgeText}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {NAV_LINKS.map((item) => {
              const label =
                isDashboard && item.label === "My History"
                  ? "My Progress"
                  : item.label;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-ink py-1.5"
                >
                  {label}
                </Link>
              );
            })}
            <div className="mt-2 flex flex-col gap-2 pt-3 border-t border-border">
              {isDashboard ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-ink py-1.5"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-amber px-5 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Start learning free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
