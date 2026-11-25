"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/landing";

export function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
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

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-border/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <BrandLogo />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="#get-started"
            className="text-sm font-medium text-ink transition-colors hover:text-forest"
          >
            Log in
          </Link>
          <Link
            href="#get-started"
            className="rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-amber-hover"
          >
            Start learning free
          </Link>
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
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink py-1"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 pt-3 border-t border-border">
              <Link
                href="#get-started"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink py-1.5"
              >
                Log in
              </Link>
              <Link
                href="#get-started"
                onClick={() => setOpen(false)}
                className="rounded-full bg-amber px-5 py-2.5 text-center text-sm font-semibold text-white"
              >
                Start learning free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
