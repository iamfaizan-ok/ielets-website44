"use client";

import { useSyncExternalStore } from "react";
import { Flame } from "lucide-react";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEKS = ["W1", "W2", "W3", "W4"];
const STORAGE_KEY = "bandora_writing_tracker";
const EMPTY_JSON = "[]";

let listeners: Array<() => void> = [];

function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function getSnapshot(): string {
  return localStorage.getItem(STORAGE_KEY) ?? EMPTY_JSON;
}

function getServerSnapshot(): string {
  return EMPTY_JSON;
}

export function markTodayPracticed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const current: number[] = raw ? JSON.parse(raw) : [];
    const jsDay = new Date().getDay();
    const monBased = jsDay === 0 ? 6 : jsDay - 1;
    const todayIdx = 21 + monBased;
    if (!current.includes(todayIdx)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, todayIdx]));
      listeners.forEach((l) => l());
    }
  } catch {
    // Ignore storage errors
  }
}

export function WritingTracker() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  let activeDays: number[] = [];
  try {
    activeDays = JSON.parse(raw);
  } catch {
    activeDays = [];
  }

  return (
    <div className="rounded-3xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-serif text-base font-semibold text-ink">
          Practice Track
        </h3>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
          <Flame className="h-3 w-3 fill-amber text-amber" />
          {activeDays.length}d
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted">
        Updates automatically when you submit a test.
      </p>

      {/* M T W T F S S header */}
      <div className="mt-4 grid grid-cols-8 items-center gap-1.5 text-center">
        <span />
        {DAYS.map((d, i) => (
          <span key={i} className="text-[11px] font-semibold text-muted">
            {d}
          </span>
        ))}
      </div>

      {/* 4 Week Rows of Circles */}
      <div className="mt-2 space-y-2">
        {WEEKS.map((wk, rowIdx) => (
          <div key={wk} className="grid grid-cols-8 items-center gap-1.5">
            <span className="text-[10px] font-semibold text-muted">{wk}</span>
            {DAYS.map((_, colIdx) => {
              const idx = rowIdx * 7 + colIdx;
              const done = activeDays.includes(idx);
              return (
                <span
                  key={colIdx}
                  title={done ? "Test completed" : "No test yet"}
                  aria-label={`Week ${rowIdx + 1} Day ${colIdx + 1}: ${
                    done ? "completed" : "not completed"
                  }`}
                  className={`mx-auto h-5 w-5 rounded-full border-2 transition-colors ${
                    done
                      ? "border-forest bg-forest"
                      : "border-border bg-cream/60"
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
