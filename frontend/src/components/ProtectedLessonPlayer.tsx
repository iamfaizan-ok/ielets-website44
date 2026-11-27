"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { toYoutubeEmbedUrl } from "@/data/learningModules";
import { fetchProtectedLesson } from "@/services/ieltsService";

export function ProtectedLessonPlayer({
  slug,
  fallbackImage,
  title,
  subtitle,
}: {
  slug: string;
  fallbackImage: string;
  title: string;
  subtitle: string;
}) {
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchProtectedLesson(slug)
      .then((res) => {
        if (active) setYoutubeUrl(res.youtube_url);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Could not load video.");
        }
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const embedUrl = youtubeUrl ? toYoutubeEmbedUrl(youtubeUrl) : null;

  return (
    <>
      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800">
          {error}
        </p>
      )}

      {!youtubeUrl ? (
        <div className="mt-6 flex aspect-video items-center justify-center rounded-2xl border border-border bg-cream text-sm text-muted">
          Loading protected video lesson...
        </div>
      ) : embedUrl ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-forest-dark aspect-video">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <div className="mt-6 relative overflow-hidden rounded-2xl border border-border bg-forest-dark aspect-video flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fallbackImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <a
            href={youtubeUrl}
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

      <div className="mt-5 flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-ink">{subtitle}</p>
          <p className="mt-0.5 text-xs text-muted">
            Watch the lesson above, take notes, and continue with the next video
            below.
          </p>
        </div>
        {youtubeUrl && (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border bg-cream px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-cream-dark sm:self-auto"
          >
            Open on YouTube
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </>
  );
}
