"use client";

// spanCols rule: "spanCols": 1 for portrait works (default), "spanCols": 2 for landscape works.
// Set in data/portfolio.json per work entry.

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
      {/* 3-col desktop / 2-col tablet / 1-col mobile, dense fill for span-2 gaps */}
      <div className="wg-grid">
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
        .wg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-flow: dense;
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .wg-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .wg-grid { grid-template-columns: 1fr; }
        }

        .wg-span-2 { grid-column: span 2; }
        @media (max-width: 640px) {
          .wg-span-2 { grid-column: span 1; }
        }

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
        /* Fallback image scale */
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
  const span2    = work.spanCols === 2;

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

  const hasVideo  = !!work.video;
  const showBadge = work.type === "video" || hasVideo;

  return (
    <div
      className={`wg-card${span2 ? " wg-span-2" : ""}`}
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
        {hasVideo ? (
          /* Video works: fixed aspect ratio container */
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: span2 ? "16/9" : "4/5",
              background: work.accentColor || "#111",
            }}
          >
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
            {showBadge && <VideoBadge />}
            <div
              className="wg-thumb-overlay absolute inset-0 pointer-events-none"
              style={{ background: "rgba(0,0,0,0.14)" }}
            />
          </div>
        ) : work.thumbnail ? (
          /* Image-only works: natural ratio, no crop */
          <div
            className="relative w-full overflow-hidden"
            style={{ background: work.accentColor || "#111" }}
          >
            <Image
              src={work.thumbnail}
              alt={work.title}
              width={span2 ? 1280 : 800}
              height={span2 ? 720  : 1067}
              className="w-full h-auto block wg-thumb-img"
              sizes={
                span2
                  ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              priority={eager}
              loading={eager ? undefined : "lazy"}
            />
            {showBadge && <VideoBadge />}
            <div
              className="wg-thumb-overlay absolute inset-0 pointer-events-none"
              style={{ background: "rgba(0,0,0,0.14)" }}
            />
          </div>
        ) : null}

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

function VideoBadge() {
  return (
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
  );
}
