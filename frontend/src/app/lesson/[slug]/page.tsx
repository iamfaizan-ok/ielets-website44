import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/CtaFooter";
import {
  ALL_LEARNING_MODULES,
  getLessonBySlug,
  getLessonSlug,
  toYoutubeEmbedUrl,
} from "@/data/learningModules";

const IELTS_MODULE_NOTES: Record<string, string> = {
  writing:
    "IELTS Writing assesses Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammar across Task 1 (20 min) and Task 2 (40 min). Structured planning is the fastest way to move from Band 6.5 to 7.5+.",
  speaking:
    "IELTS Speaking is a face-to-face 11–14 minute interview across Part 1 (everyday topics), Part 2 (2-minute cue card), and Part 3 (abstract discussion). Natural fluency matters more than memorizing rare words.",
  listening:
    "IELTS Listening tests your ability to follow four increasingly complex recordings once only. Spotting distractors, signposting words, and exact spelling guarantees steady Band 7.5+ accuracy.",
  reading:
    "IELTS Reading challenges you to answer 40 questions across three passages in 60 minutes. Mastering skimming, scanning, and True/False/Not Given logic saves crucial minutes on exam day.",
};

export function generateStaticParams() {
  return ALL_LEARNING_MODULES.flatMap((mod) =>
    mod.videos.map((v) => ({ slug: getLessonSlug(mod.id, v.step) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = getLessonBySlug(slug);
  return {
    title: found ? `${found.video.title} — Bandora` : "Lesson — Bandora",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getLessonBySlug(slug);
  if (!found) notFound();

  const { module, video, moreVideos } = found;
  const embedUrl = toYoutubeEmbedUrl(video.url);
  const ieltsNote = IELTS_MODULE_NOTES[module.icon] ?? module.subtitle;
  const backHref =
    module.icon === "writing"
      ? "/writing"
      : module.icon === "reading"
        ? "/reading"
        : "/dashboard";
  const backLabel =
    module.icon === "writing"
      ? "Back to Writing"
      : module.icon === "reading"
        ? "Back to Reading"
        : "Back to Dashboard";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-6 pb-14 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-amber transition-colors sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-forest">
            {module.eyebrow} · Lesson {String(video.step).padStart(2, "0")}
          </span>
        </div>

        {/* Module & IELTS Context */}
        <div className="mt-4 rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest">
            {module.title}
          </p>
          <h1 className="mt-1.5 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-4xl">
            {video.title}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-muted">
            {ieltsNote}
          </p>

          {/* Embedded YouTube Player or Clean Playlist Card */}
          {embedUrl ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-forest-dark aspect-video">
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="mt-6 relative overflow-hidden rounded-2xl border border-border bg-forest-dark aspect-video flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.image}
                alt={video.title}
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-2.5 rounded-full bg-amber px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-amber-hover"
              >
                <Play className="h-4 w-4 fill-white" />
                Watch Lesson on YouTube
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}

          {/* Video Details Bar */}
          <div className="mt-5 flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold text-ink">{video.subtitle}</p>
              <p className="mt-0.5 text-xs text-muted">
                Watch the lesson above, take notes, and continue with the next
                video below.
              </p>
            </div>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border bg-cream px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-cream-dark sm:self-auto"
            >
              Open on YouTube
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* More YouTube Video Lessons in This Module */}
        <section className="mt-8 rounded-3xl border border-border bg-surface p-6 sm:p-7">
          <h2 className="font-serif text-xl font-semibold text-ink sm:text-2xl">
            More Videos in {module.title.split("—")[0].trim()}
          </h2>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            Select any lesson below to watch it right here.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {moreVideos.map((item) => (
              <Link
                key={item.step}
                href={`/lesson/${getLessonSlug(module.id, item.step)}`}
                className="group flex items-center gap-3.5 rounded-2xl border border-border bg-cream/40 p-3 transition-colors hover:border-forest/40 hover:bg-cream"
              >
                <div className="relative h-14 w-22 shrink-0 overflow-hidden rounded-xl bg-cream-dark border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-1 top-1 rounded-md bg-forest/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {String(item.step).padStart(2, "0")}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-ink group-hover:text-forest sm:text-sm">
                    {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted">
                    {item.subtitle}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-forest">
                    <Play className="h-3 w-3 fill-forest" />
                    {item.cta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
