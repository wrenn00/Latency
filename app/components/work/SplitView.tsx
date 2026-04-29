"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWorkCanvas } from "./WorkCanvasContext";
import type { Work } from "@/lib/db";

const EASE = [0.22, 1, 0.36, 1] as const;

// Per-category color labels
const TAG: Record<string, { bg: string; fg: string }> = {
  "uiux":              { bg: "rgba(0,81,255,0.14)",   fg: "#6B9FFF" },
  "xr":                { bg: "rgba(124,58,237,0.14)", fg: "#A78BFA" },
  "graphic":           { bg: "rgba(5,150,105,0.14)",  fg: "#34D399" },
  "advertising-design":{ bg: "rgba(217,119,6,0.14)",  fg: "#FCD34D" },
};

interface Props {
  work:          Work;
  filteredWorks: Work[];
}

export function SplitView({ work, filteredWorks }: Props) {
  const { closeWork, selectWork, enterFullscreen } = useWorkCanvas();

  const idx  = filteredWorks.findIndex((w) => w.id === work.id);
  const prev = idx > 0                         ? filteredWorks[idx - 1] : null;
  const next = idx < filteredWorks.length - 1  ? filteredWorks[idx + 1] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     { closeWork();  return; }
      if (e.key === "ArrowLeft"  && prev) selectWork(prev.id);
      if (e.key === "ArrowRight" && next) selectWork(next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeWork, selectWork, prev, next]);

  const tag = TAG[work.categoryId] ?? { bg: "rgba(255,255,255,0.08)", fg: "var(--fg-muted)" };

  return (
    <motion.div
      key={work.id}
      className="flex flex-1 min-h-0"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{   opacity: 0, x: -16 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {/* ── LEFT: image ────────────────────────────────────────────── */}
      <div
        className="relative flex-[6] min-w-0"
        style={{ background: "#050505" }}
      >
        {/* Expand to fullscreen */}
        <button
          onClick={enterFullscreen}
          data-interactive="true"
          aria-label="Fullscreen"
          className="absolute top-5 left-5 z-10 cursor-none font-[family-name:var(--font-mono)] text-[18px] leading-none transition-opacity duration-150"
          style={{ color: "var(--fg-muted)", opacity: 0.45 }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.45")}
        >
          ↗
        </button>

        {/* Image — padded via inset */}
        {work.thumbnail ? (
          <div className="absolute inset-10 sm:inset-14">
            <Image
              src={work.thumbnail}
              alt={work.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 60vw, 55vw"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: work.accentColor || "#111" }} />
        )}
      </div>

      {/* ── RIGHT: info ────────────────────────────────────────────── */}
      <div
        className="flex-[4] min-w-0 flex flex-col overflow-hidden"
        style={{ borderLeft: "1px solid var(--border)" }}
      >
        {/* Controls row */}
        <div
          className="shrink-0 flex items-center justify-between px-7 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-5">
            <NavBtn label="← prev" enabled={!!prev} onClick={() => prev && selectWork(prev.id)} />
            <NavBtn label="next →" enabled={!!next} onClick={() => next && selectWork(next.id)} />
          </div>
          <button
            onClick={closeWork}
            data-interactive="true"
            className="cursor-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] flex items-center gap-1.5 transition-opacity duration-150"
            style={{ color: "var(--fg-muted)", opacity: 0.55 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>×</span> close
          </button>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-7 py-8">
          {/* Category tag */}
          <span
            className="inline-block font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 mb-7"
            style={{ background: tag.bg, color: tag.fg, borderRadius: 2 }}
          >
            {work.category}
          </span>

          {/* Title */}
          <h2
            className="font-[family-name:var(--font-sans)] leading-[1.15] tracking-tight mb-2"
            style={{ fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 500, color: "var(--fg)" }}
          >
            {work.title}
          </h2>
          <p
            className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.06em] mb-8"
            style={{ color: "var(--fg-muted)", opacity: 0.45 }}
          >
            {work.year}
          </p>

          {/* Description */}
          {work.description && (
            <p
              className="font-[family-name:var(--font-mono)] text-[13px] leading-[1.85] mb-8"
              style={{ color: "var(--fg-muted)" }}
            >
              {work.description}
            </p>
          )}

          {/* Credits */}
          {(work.role || work.client) && (
            <div
              className="flex flex-col gap-3 pt-6"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {work.role && (
                <CreditRow label="Role"   value={work.role}   />
              )}
              {work.client && (
                <CreditRow label="Client" value={work.client} />
              )}
            </div>
          )}
        </div>

        {/* Case study link */}
        <div
          className="shrink-0 px-7 py-5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <Link
            href={`/work/${work.id}`}
            data-interactive="true"
            className="cursor-none font-[family-name:var(--font-mono)] text-[12px] tracking-[0.06em] transition-opacity duration-150"
            style={{ color: "var(--fg-muted)", opacity: 0.45 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.45")}
          >
            View full case study →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────

function NavBtn({ label, enabled, onClick }: { label: string; enabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      data-interactive="true"
      className="cursor-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] transition-opacity duration-150"
      style={{ color: "var(--fg-muted)", opacity: enabled ? 0.55 : 0.15 }}
      onMouseEnter={(e) => enabled && (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = enabled ? "0.55" : "0.15")}
    >
      {label}
    </button>
  );
}

function CreditRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-5">
      <span
        className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] uppercase shrink-0 w-14"
        style={{ color: "var(--fg-muted)", opacity: 0.38 }}
      >
        {label}
      </span>
      <span
        className="font-[family-name:var(--font-mono)] text-[12px]"
        style={{ color: "var(--fg-muted)" }}
      >
        {value}
      </span>
    </div>
  );
}
