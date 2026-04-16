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
 *   In data/projects.ts, add:
 *     videoUrl: "https://player.vimeo.com/progressive_redirect/...",
 *     posterUrl: "/public/posters/your-poster.jpg",
 *   ProjectBackground auto-switches from CSS placeholder to <video>.
 *
 * TIMING CONSTANTS (tune here, nowhere else):
 *   MEDIA_FADE      = 600ms  — background enter/exit
 *   WORDMARK_DELAY  = 150ms  — wordmark lags behind media (in BackgroundWordmark)
 *   LIST_STAGGER    = 65ms   — max stagger between list items (in ProjectList)
 *   IDLE_CYCLE      = 4000ms — wordmark cycling interval (in BackgroundWordmark)
 *
 * STATES:
 *   A — Idle: wordmark cycles, list at 100%
 *   B — Hover: media fades in, list redistributes opacity
 *   C — Unhover: media fades out, list returns to 100%
 *   D — Cross-hover: A/B layers crossfade, no intermediate idle
 *   E — Committed (click): controls visible, URL updates, sound unlocks
 *   F — Keyboard: Arrow Up/Down moves through list, Enter commits, Esc closes
 * ══════════════════════════════════════════════════════════
 */

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECTS, type Project } from "@/data/projects";
import { WorkCanvasProvider, useWorkCanvas } from "./WorkCanvasContext";
import { ProjectBackground } from "./ProjectBackground";
import { BackgroundWordmark } from "./BackgroundWordmark";
import { ProjectList } from "./ProjectList";
import { HoverBreadcrumb } from "./HoverBreadcrumb";
import { CategoryStack } from "./CategoryStack";
import { MetaNav } from "./MetaNav";
import { MediaControls } from "./MediaControls";
import { LiveClock } from "@/app/components/LiveClock";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Entry point — wraps inner component with Context provider ─────────────────
export function WorkCanvas() {
  return (
    <WorkCanvasProvider>
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

// ── Double-buffer crossfade layer type ────────────────────────────────────────
type Layer = { projectId: string | null; visible: boolean };

// ── Inner canvas (consumes Context) ──────────────────────────────────────────
function WorkCanvasInner() {
  const {
    hoveredId,
    activeId,
    filterCategory,
    isSoundOn,
    close,
  } = useWorkCanvas();

  const reduced = useReducedMotion();

  // Filtered project list
  const filteredProjects = useMemo<Project[]>(() => {
    if (filterCategory === "ALL") return PROJECTS;
    return PROJECTS.filter((p) => p.category === filterCategory);
  }, [filterCategory]);

  // The project whose background is "displayed" — activeId locks it
  const displayId = activeId ?? hoveredId;

  // ── Double-buffer crossfade ───────────────────────────────────────────────
  // Two layers (A / B) alternate as the active one.
  // On each displayId change: inactive layer loads new project and fades in,
  // active layer fades out. Swap roles. Gives State D (crossfade) for free.
  const [layerA, setLayerA] = useState<Layer>({ projectId: null, visible: false });
  const [layerB, setLayerB] = useState<Layer>({ projectId: null, visible: false });
  const activeLayerRef = useRef<"A" | "B">("A");

  useEffect(() => {
    if (!displayId) {
      setLayerA({ projectId: null, visible: false });
      setLayerB({ projectId: null, visible: false });
      return;
    }

    // Find inactive layer and load new project into it, fade out current
    if (activeLayerRef.current === "A") {
      setLayerB({ projectId: displayId, visible: true });
      setLayerA((prev) => ({ ...prev, visible: false }));
      activeLayerRef.current = "B";
    } else {
      setLayerA({ projectId: displayId, visible: true });
      setLayerB((prev) => ({ ...prev, visible: false }));
      activeLayerRef.current = "A";
    }
  }, [displayId]);

  // Project objects for background layers
  const projectA = layerA.projectId ? PROJECTS.find((p) => p.slug === layerA.projectId) ?? null : null;
  const projectB = layerB.projectId ? PROJECTS.find((p) => p.slug === layerB.projectId) ?? null : null;

  const activeProject = activeId ? PROJECTS.find((p) => p.slug === activeId) ?? null : null;

  // ── Esc handler for uncommitted hover states ──────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "var(--bg)" }}
      role="main"
    >
      {/* ── Z-1: Fullscreen background media (two layers for crossfade) ── */}
      <div className="absolute inset-0" aria-hidden>
        <ProjectBackground
          project={projectA}
          visible={layerA.visible}
          soundOn={isSoundOn}
          reduced={reduced}
        />
        <ProjectBackground
          project={projectB}
          visible={layerB.visible}
          soundOn={isSoundOn}
          reduced={reduced}
        />
      </div>

      {/* ── Z-2: Giant background wordmark ────────────────────────────── */}
      <div className="absolute inset-0 z-[2]">
        <BackgroundWordmark
          hoveredId={displayId}
          filteredProjects={filteredProjects}
          reduced={reduced}
        />
      </div>

      {/* ── Z-3: UI layer ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[3] pointer-events-none">

        {/* ─ TOP BAR ─────────────────────────────────────────────────── */}
        <div className="absolute top-0 inset-x-0 flex items-start justify-between px-8 sm:px-10 pt-7 sm:pt-9 pointer-events-auto">

          {/* Top-left: Logo + category stack + hover breadcrumb */}
          <div className="flex flex-col gap-6">
            {/* Logo */}
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

            {/* Category filter — always visible */}
            <CategoryStack />

            {/* Hover breadcrumb — fades in on hover */}
            <HoverBreadcrumb
              hoveredId={hoveredId ?? activeId}
              projects={filteredProjects}
              reduced={reduced}
            />
          </div>

          {/* Top-right: nav links (hidden when committed — controls replace them) */}
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
        <MediaControls
          activeProject={activeProject}
          allProjects={filteredProjects}
          reduced={reduced}
        />

        {/* ─ CENTER: Project list ─────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center pointer-events-auto">
          <div
            className="pl-[8vw] pr-[8vw] w-full max-w-[820px]"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <ProjectList projects={filteredProjects} reduced={reduced} />
          </div>
        </div>

        {/* ─ BOTTOM ───────────────────────────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 flex items-end justify-between px-8 sm:px-10 pb-6 sm:pb-8 pointer-events-auto">

          {/* Bottom-left: live clock / location */}
          {!activeId && (
            <div className="flex flex-col gap-0.5">
              <LiveClock />
            </div>
          )}

          {/* Bottom-center: MetaNav strip */}
          <div className="flex-1 flex justify-center px-8">
            <MetaNav />
          </div>

          {/* Bottom-right: project count or empty (controls shown by MediaControls when committed) */}
          {!activeId && (
            <span
              className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums"
              style={{ color: "var(--fg-muted)", opacity: 0.35 }}
            >
              {filteredProjects.length} works
            </span>
          )}
        </div>
      </div>

      {/* Keyframe for logo glow */}
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 4px rgba(0,81,255,0.35); }
          50%       { opacity: 1;   box-shadow: 0 0 10px rgba(0,81,255,0.6); }
        }
      `}</style>
    </div>
  );
}
