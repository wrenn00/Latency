"use client";

/*
 * WorkCanvas — voku.studio-inspired cinematic hover-reveal
 * ══════════════════════════════════════════════════════════
 *
 * CORE PARADIGM:
 *   Projects are presented as a vertical text list with no thumbnails.
 *   Hovering a name triggers a fullscreen ambient media reveal behind
 *   the list. Other names fade to 15% opacity with a proximity stagger.
 *   The list stays legible on top while the hovered work fills the canvas.
 *
 * HOW TO ADD REAL VIDEO:
 *   In data/portfolio.json set a work's videoUrl field:
 *     "videoUrl": "https://player.vimeo.com/progressive_redirect/...",
 *     "posterUrl": "/uploads/your-poster.jpg"
 *   ProjectBackground auto-switches from CSS placeholder to <video>.
 *
 * TIMING CONSTANTS (tune here, nowhere else):
 *   MEDIA_FADE   = 600ms  — background enter/exit (ProjectBackground)
 *   LIST_STAGGER = 65ms   — max stagger between list items (ProjectList)
 *
 * DATA FLOW:
 *   app/work/page.tsx (server) reads portfolio.json →
 *   passes {works, categories} as props →
 *   WorkCanvasProvider holds them in context →
 *   all children consume via useWorkCanvas()
 *
 * STATES:
 *   A — Idle: list at 100%, no background
 *   B — Hover: media fades in, list redistributes opacity
 *   C — Unhover: media fades out, list returns to 100%
 *   D — Cross-hover: A/B layers crossfade seamlessly
 *   E — Committed (click): controls visible, URL updates, sound unlocks
 *   F — Keyboard: Arrow Up/Down moves through list, Enter commits, Esc closes
 * ══════════════════════════════════════════════════════════
 */

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { WorkCanvasProvider, useWorkCanvas } from "./WorkCanvasContext";
import { ProjectBackground } from "./ProjectBackground";
import { ProjectList } from "./ProjectList";
import { HoverBreadcrumb } from "./HoverBreadcrumb";
import { CategoryStack } from "./CategoryStack";
import { MediaControls } from "./MediaControls";
import { LiveClock } from "@/app/components/LiveClock";
import type { Work, PortfolioCategory } from "@/lib/db";

// ── Entry point ───────────────────────────────────────────────────────────────
interface WorkCanvasProps {
  works:      Work[];
  categories: PortfolioCategory[];
}

export function WorkCanvas({ works, categories }: WorkCanvasProps) {
  return (
    <WorkCanvasProvider works={works} categories={categories}>
      <WorkCanvasInner />
    </WorkCanvasProvider>
  );
}

// ── useReducedMotion ──────────────────────────────────────────────────────────
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ── Double-buffer crossfade layer ─────────────────────────────────────────────
type Layer = { workId: string | null; visible: boolean };

// ── Inner canvas ──────────────────────────────────────────────────────────────
function WorkCanvasInner() {
  const { works, hoveredId, activeId, filterCategory, isSoundOn, close } = useWorkCanvas();
  const reduced = useReducedMotion();

  const filteredWorks = useMemo<Work[]>(() => {
    if (filterCategory === "ALL") return works;
    return works.filter((w) => w.categoryId === filterCategory);
  }, [works, filterCategory]);

  const displayId = activeId ?? hoveredId;

  // Two always-mounted layers alternate on each displayId change.
  // This gives seamless overlapping crossfades (State D) for free.
  const [layerA, setLayerA] = useState<Layer>({ workId: null, visible: false });
  const [layerB, setLayerB] = useState<Layer>({ workId: null, visible: false });
  const activeLayerRef = useRef<"A" | "B">("A");

  useEffect(() => {
    if (!displayId) {
      setLayerA({ workId: null, visible: false });
      setLayerB({ workId: null, visible: false });
      return;
    }
    if (activeLayerRef.current === "A") {
      setLayerB({ workId: displayId, visible: true });
      setLayerA((prev) => ({ ...prev, visible: false }));
      activeLayerRef.current = "B";
    } else {
      setLayerA({ workId: displayId, visible: true });
      setLayerB((prev) => ({ ...prev, visible: false }));
      activeLayerRef.current = "A";
    }
  }, [displayId]);

  const workA = layerA.workId ? works.find((w) => w.id === layerA.workId) ?? null : null;
  const workB = layerB.workId ? works.find((w) => w.id === layerB.workId) ?? null : null;
  const activeWork = activeId ? works.find((w) => w.id === activeId) ?? null : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "var(--bg)" }} role="main">

      {/* ── Z-1: Fullscreen background media (two layers for crossfade) ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <ProjectBackground work={workA} visible={layerA.visible} soundOn={isSoundOn} reduced={reduced} />
        <ProjectBackground work={workB} visible={layerB.visible} soundOn={isSoundOn} reduced={reduced} />
      </div>

      {/* ── Z-3: UI layer ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[3] pointer-events-none">

        {/* ─ TOP BAR ─────────────────────────────────────────────────── */}
        <div className="absolute top-0 inset-x-0 flex items-start justify-between px-8 sm:px-10 pt-7 sm:pt-9 pointer-events-auto">

          {/* Top-left: Logo + category stack + hover breadcrumb */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              data-interactive="true"
              className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] uppercase cursor-none focus:outline-none"
              style={{ color: "var(--fg)" }}
            >
              LATENCY
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--accent)", animation: "glowPulse 2s ease-in-out infinite" }}
              />
            </Link>

            <CategoryStack />

            <HoverBreadcrumb hoveredId={hoveredId ?? activeId} works={filteredWorks} reduced={reduced} />
          </div>

          {/* Top-right: nav (hidden when a project is committed) */}
          {!activeId && (
            <nav className="flex items-center gap-5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.12em] uppercase">
              {[
                { label: "work",    href: "/work" },
                { label: "about",   href: "/#about" },
                { label: "contact", href: "/#contact" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  data-interactive="true"
                  className="cursor-none focus:outline-none transition-opacity duration-150"
                  style={{ color: "var(--fg-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* ─ MEDIA CONTROLS (State E) ────────────────────────────────── */}
        <MediaControls activeWork={activeWork} allWorks={filteredWorks} reduced={reduced} />

        {/* ─ CENTER: Work list (or empty state) ──────────────────────── */}
        {/* pointer-events-none on the fullscreen positioning shell — list items handle their own events */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="pl-[8vw] pr-[8vw] w-full max-w-[820px] overflow-hidden pointer-events-auto">
            <ProjectList works={filteredWorks} reduced={reduced} />
          </div>
        </div>

        {/* ─ BOTTOM ───────────────────────────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 flex items-end justify-between px-8 sm:px-10 pb-6 sm:pb-8 pointer-events-auto">
          {!activeId && <LiveClock />}
          <div className="flex-1" />
          {!activeId && (
            <span
              className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums"
              style={{ color: "var(--fg-muted)", opacity: 0.35 }}
            >
              {filteredWorks.length} {filteredWorks.length === 1 ? "work" : "works"}
            </span>
          )}
        </div>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 4px rgba(0,81,255,0.35); }
          50%       { opacity: 1;   box-shadow: 0 0 10px rgba(0,81,255,0.6); }
        }
      `}</style>
    </div>
  );
}
