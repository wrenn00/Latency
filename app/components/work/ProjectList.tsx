"use client";

// The heart of WorkCanvas.
// A typography-only list — no thumbnails, no cards.
// Hover a name: everything else fades to 15% opacity with a distance-based stagger.
// Items CLOSER to the hovered one fade LAST (ripple outward from center).
// The list container owns mouse-leave so rapid inter-item moves never trigger unhoveredgaps.

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { useWorkCanvas } from "./WorkCanvasContext";

// ── Timing constants ──────────────────────────────────────────────────────────
const FADE_DURATION_ENTER = 0.4;    // s — other items fade to 15%
const FADE_DURATION_EXIT  = 0.3;    // s — items return to 100%
const STAGGER_MAX_MS      = 0.065;  // s — max stagger delay (close items fade last)
const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  projects:  Project[];
  reduced:   boolean;
}

export function ProjectList({ projects, reduced }: Props) {
  const { hoveredId, activeId, setHovered, commit, close } = useWorkCanvas();
  const listRef = useRef<HTMLDivElement>(null);

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); return; }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx     = projects.findIndex((p) => p.slug === (hoveredId ?? activeId));
        const next    = e.key === "ArrowDown"
          ? Math.min(idx + 1, projects.length - 1)
          : Math.max(idx - 1, 0);
        const target  = projects[next > -1 ? next : 0];
        if (target) setHovered(target.slug);
      }

      if (e.key === "Enter" && hoveredId) commit(hoveredId);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [projects, hoveredId, activeId, setHovered, commit, close]);

  // Clear hover when mouse leaves the entire list
  const handleListLeave = useCallback(() => {
    if (!activeId) setHovered(null);
  }, [activeId, setHovered]);

  // ── Opacity / delay per item ──────────────────────────────────────────────
  const effectiveHoveredId = hoveredId ?? activeId;
  const hoveredIndex = effectiveHoveredId
    ? projects.findIndex((p) => p.slug === effectiveHoveredId)
    : -1;

  return (
    <>
      {/* ARIA live region — announces hovered project to screen readers */}
      {effectiveHoveredId && (() => {
        const p = projects.find((x) => x.slug === effectiveHoveredId);
        return (
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {p ? `Now previewing: ${p.title}, ${p.category}` : ""}
          </div>
        );
      })()}

      <div
        ref={listRef}
        role="list"
        className="flex flex-col"
        style={{ gap: "0.08em" }}
        onMouseLeave={handleListLeave}
      >
        {projects.map((project, i) => {
          const isHovered  = project.slug === effectiveHoveredId;
          const isCommitted = project.slug === activeId;

          // Opacity: 1 if hovered/committed or nothing is hovered; else 0.15
          const opacity = effectiveHoveredId === null
            ? 1
            : isHovered
            ? 1
            : 0.15;

          // Stagger: items CLOSER to hovered fade LAST (higher delay)
          const distance    = hoveredIndex >= 0 ? Math.abs(i - hoveredIndex) : 0;
          const maxDistance = Math.max(projects.length - 1, 1);
          // Normalised closeness: 1 = right next to hovered, 0 = far away
          const closeness   = 1 - distance / maxDistance;
          const enterDelay  = reduced ? 0 : closeness * STAGGER_MAX_MS;
          const exitDelay   = reduced ? 0 : (1 - closeness) * STAGGER_MAX_MS * 0.5;

          const isEntering  = effectiveHoveredId !== null;
          const delay       = isEntering ? enterDelay : exitDelay;
          const duration    = reduced
            ? 0.1
            : isEntering
            ? FADE_DURATION_ENTER
            : FADE_DURATION_EXIT;

          return (
            <motion.button
              key={project.slug}
              role="listitem"
              data-interactive="true"
              className="text-left block cursor-none w-full focus:outline-none"
              style={{ WebkitTapHighlightColor: "transparent" }}
              animate={{ opacity }}
              transition={{ duration, delay, ease: EASE }}
              onMouseEnter={() => setHovered(project.slug)}
              onFocus={()    => setHovered(project.slug)}
              onBlur={()     => { if (!activeId) setHovered(null); }}
              onClick={()    => commit(project.slug)}
              aria-label={`${project.title} — ${project.category}, ${project.year}`}
              aria-pressed={isCommitted}
            >
              <span
                className="font-[family-name:var(--font-sans)] leading-[1.32] tracking-[-0.01em] block"
                style={{
                  fontSize:   "clamp(20px, 2.6vw, 32px)",
                  fontWeight: 500,
                  color:      isHovered ? "var(--fg)" : "var(--fg)",
                  // Subtle accent underline when this item is the committed one
                  borderBottom: isCommitted ? "1px solid var(--accent)" : "none",
                  paddingBottom: isCommitted ? "2px" : "0",
                }}
              >
                {project.title}.
              </span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
