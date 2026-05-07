"use client";

import { memo, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Work } from "@/lib/db";

interface Props {
  works: Work[];
}

export function WorkGrid({ works }: Props) {
  const router = useRouter();

  if (works.length === 0) {
    return (
      <div className="pt-4">
        <p
          className="font-[family-name:var(--font-mono)] text-[13px] tracking-[0.06em]"
          style={{ color: "var(--fg-muted)", opacity: 0.35 }}
        >
          No works yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work, i) => (
          <WorkCard
            key={work.id}
            work={work}
            index={i}
            eager={i === 0}
            onSelect={(id) => router.push(`/work/${id}`)}
          />
        ))}
      </div>

      <style>{`
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .wg-card {
          opacity: 0;
          animation: cardEnter 320ms ease forwards;
        }
        /* Video scale on hover — GPU composited, no layout cost */
        .wg-card video {
          transition: transform 280ms ease;
          will-change: transform;
        }
        .wg-card:hover video { transform: scale(1.025); }
        /* Fallback image scale (works without video) */
        .wg-thumb-img {
          transition: transform 280ms ease;
          will-change: transform;
        }
        .wg-card:hover .wg-thumb-img { transform: scale(1.025); }
        /* Hover overlay */
        .wg-thumb-overlay {
          opacity: 0;
          transition: opacity 220ms ease;
        }
        .wg-card:hover .wg-thumb-overlay { opacity: 1; }
        /* Title dim */
        .wg-title { transition: opacity 180ms ease; }
        .wg-card:hover .wg-title { opacity: 0.65; }
      `}</style>
    </>
  );
}

interface CardProps {
  work:     Work;
  index:    number;
  eager:    boolean;
  onSelect: (id: string) => void;
}

const WorkCard = memo(function WorkCard({ work, index, eager, onSelect }: CardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // iOS Safari fix: first frame doesn't render without nudging currentTime
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.currentTime = 0.01;
  }, []);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {/* autoplay blocked — fail silently */});
  };

  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const hasVideo   = !!work.video;
  const showBadge  = work.type === "video" || hasVideo;

  return (
    <div
      className="wg-card"
      style={{ animationDelay: `${index * 55}ms` }}
      onMouseEnter={hasVideo ? play  : undefined}
      onMouseLeave={hasVideo ? stop  : undefined}
      onTouchStart={hasVideo ? play  : undefined}
      onTouchEnd={hasVideo   ? stop  : undefined}
    >
      <button
        onClick={() => onSelect(work.id)}
        data-interactive="true"
        className="block w-full text-left cursor-none focus:outline-none"
      >
        {/* Media container */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4 / 5", background: work.accentColor || "#111" }}
        >
          {hasVideo ? (
            // MP4 only — preload="auto" so first frame shows immediately on load
            <video
              ref={videoRef}
              src={work.video}
              muted
              playsInline
              loop
              preload="auto"
              aria-label={work.title}
              className="absolute inset-0 w-full h-full object-cover block"
            />
          ) : work.thumbnail ? (
            // Fallback PNG for works without video (e.g. YouTube-only entries)
            <Image
              src={work.thumbnail}
              alt={work.title}
              fill
              className="object-cover wg-thumb-img"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={eager}
              loading={eager ? undefined : "lazy"}
            />
          ) : null}

          {/* ▶ badge */}
          {showBadge && (
            <div
              className="absolute top-2.5 right-2.5 pointer-events-none"
              style={{
                background: "rgba(0,0,0,0.55)",
                borderRadius: 3,
                padding: "3px 6px",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.06em",
              }}
            >
              ▶
            </div>
          )}

          {/* Hover overlay */}
          <div
            className="wg-thumb-overlay absolute inset-0 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.14)" }}
          />
        </div>

        {/* Meta */}
        <div className="mt-3">
          <p
            className="wg-title font-[family-name:var(--font-mono)] text-[13px] tracking-[-0.01em]"
            style={{ color: "var(--fg)" }}
          >
            {work.title}
          </p>
          <p
            className="font-[family-name:var(--font-mono)] text-[11px] mt-0.5"
            style={{ color: "var(--fg-muted)", opacity: 0.4 }}
          >
            {work.year}
          </p>
        </div>
      </button>
    </div>
  );
});
