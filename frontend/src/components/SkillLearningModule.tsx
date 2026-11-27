"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  Headphones,
  Lock,
  Mic,
  PenLine,
  Play,
} from "lucide-react";
import { saveReturnUrl, useAuth } from "@/context/AuthContext";
import type { SkillLearningConfig } from "@/data/learningModules";
import { getLessonSlug } from "@/data/learningModules";
import { fetchProtectedTeachers } from "@/services/ieltsService";

const CTA_ICONS = {
  writing: PenLine,
  speaking: Mic,
  listening: Headphones,
  reading: BookOpen,
};

export function SkillLearningModule({
  module,
  eyebrowOverride,
  titleOverride,
  showCta = true,
}: {
  module: SkillLearningConfig;
  eyebrowOverride?: string;
  titleOverride?: string;
  showCta?: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [teacherUrls, setTeacherUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user || !module.teachers?.length) return;
    fetchProtectedTeachers()
      .then((res) => setTeacherUrls(res.teachers))
      .catch(() => {
        // Ignore if session expired; RequireAuth handles redirect
      });
  }, [user, module.teachers]);

  function redirectGuestToSignup(targetPath: string) {
    saveReturnUrl(targetPath);
    router.push(`/signup?next=${encodeURIComponent(targetPath)}`);
  }

  const visibleVideos = showAllVideos
    ? module.videos
    : module.videos.slice(0, 4);
  const CtaIcon = CTA_ICONS[module.icon];
  const ctaTarget =
    module.icon === "reading"
      ? "/reading"
      : module.icon === "writing"
        ? "/writing"
        : "/dashboard";

  return (
    <section
      id={module.id}
      className="mx-auto max-w-6xl px-4 pb-8 sm:px-6"
    >
      <div className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
        {/* Compact Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest">
              {eyebrowOverride ?? module.eyebrow}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {titleOverride ?? module.title}
            </h2>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              {module.subtitle}
            </p>
          </div>

          {showCta && (
            <button
              type="button"
              onClick={() =>
                user
                  ? router.push(ctaTarget)
                  : redirectGuestToSignup(ctaTarget)
              }
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-amber px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-amber-hover sm:self-auto"
            >
              <CtaIcon className="h-4 w-4" />
              {module.ctaLabel}
            </button>
          )}
        </div>

        {/* Famous IELTS Teachers (Locked for guests; URLs fetched only when authenticated) */}
        {module.teachers && module.teachers.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              {module.teachersHeading}
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {module.teachers.map((teacher) => {
                const resolvedUrl = user ? teacherUrls[teacher.teacherKey] : undefined;
                const inner = (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-xl object-cover bg-cream-dark border border-border"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-ink group-hover:text-forest">
                        {teacher.name}
                      </p>
                      {teacher.badge && (
                        <span className="mt-0.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                          {teacher.badge}
                        </span>
                      )}
                      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">
                        {teacher.focus}
                      </p>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-forest">
                        {user ? (
                          <>
                            {teacher.cta ?? "YouTube channel"}
                            <ExternalLink className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 text-amber" />
                            Sign up to unlock
                          </>
                        )}
                      </span>
                    </div>
                  </>
                );

                return resolvedUrl ? (
                  <a
                    key={teacher.name}
                    href={resolvedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-2xl border border-border bg-cream/60 p-3.5 transition-colors hover:border-forest/40 hover:bg-cream"
                  >
                    {inner}
                  </a>
                ) : (
                  <button
                    key={teacher.name}
                    type="button"
                    onClick={() => redirectGuestToSignup("/dashboard")}
                    className="group flex text-left items-start gap-3 rounded-2xl border border-border bg-cream/60 p-3.5 transition-colors hover:border-forest/40 hover:bg-cream"
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Top 10 Videos (Zero YouTube URLs in DOM; locked for guests) */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              {module.videosHeading}
            </h3>
            <button
              type="button"
              onClick={() => setShowAllVideos((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:text-amber transition-colors"
            >
              {showAllVideos ? "Show less" : "Show all 10 videos"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  showAllVideos ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {visibleVideos.map((video) => {
              const lessonPath = `/lesson/${getLessonSlug(module.id, video.step)}`;
              const content = (
                <>
                  <div className="relative h-14 w-22 shrink-0 overflow-hidden rounded-xl bg-cream-dark border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={video.image}
                      alt={video.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-1 top-1 rounded-md bg-forest/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {String(video.step).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-bold text-ink group-hover:text-forest sm:text-sm">
                        {video.title}
                      </p>
                      {video.badge && (
                        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                          {video.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {video.subtitle}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-forest">
                      {user ? (
                        <>
                          <Play className="h-3 w-3 fill-forest" />
                          {video.cta}
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 text-amber" />
                          Sign up to watch
                        </>
                      )}
                    </span>
                  </div>
                </>
              );

              return user ? (
                <Link
                  key={video.step}
                  href={lessonPath}
                  className="group flex items-center gap-3.5 rounded-2xl border border-border bg-cream/40 p-3 transition-colors hover:border-forest/40 hover:bg-cream"
                >
                  {content}
                </Link>
              ) : (
                <button
                  key={video.step}
                  type="button"
                  onClick={() => redirectGuestToSignup(lessonPath)}
                  className="group flex text-left items-center gap-3.5 rounded-2xl border border-border bg-cream/40 p-3 transition-colors hover:border-forest/40 hover:bg-cream"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
