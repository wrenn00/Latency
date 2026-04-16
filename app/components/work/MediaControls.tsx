"use client";

// Media controls — visible only when a project is COMMITTED (State E).
// Top-right: Prev / Next / Close
// Bottom-right: Play | Pause | Sound | Fullscreen (visual stubs for placeholder era)
// Bottom-left: live timecode counting up from 0 while committed

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";
import { useWorkCanvas } from "./WorkCanvasContext";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  activeProject:  Project | null;
  allProjects:    Project[];
  reduced:        boolean;
}

// ── Timecode counter ──────────────────────────────────────────────────────────
function useTimecode(running: boolean) {
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (!running) { setSecs(0); return; }
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// ── Icon helpers ──────────────────────────────────────────────────────────────
function CtrlBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      data-interactive="true"
      className="cursor-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] flex items-center gap-1.5 focus:outline-none transition-opacity duration-150"
      style={{ color: "var(--fg-muted)", opacity: 0.6 }}
      aria-label={label}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
    >
      {children}
    </button>
  );
}

export function MediaControls({ activeProject, allProjects, reduced }: Props) {
  const { close, commit, isSoundOn, toggleSound } = useWorkCanvas();
  const timecode = useTimecode(!!activeProject);
  const [isPlaying, setIsPlaying] = useState(true);

  const idx  = activeProject ? allProjects.findIndex((p) => p.slug === activeProject.slug) : -1;
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

  return (
    <AnimatePresence>
      {activeProject && (
        <motion.div
          key="controls"
          className="contents"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{   opacity: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.35, ease: EASE }}
        >
          {/* ── Top-right: Prev / Next / Close ─────────────────────── */}
          <div className="absolute top-7 right-8 sm:right-10 flex items-center gap-5 z-20">
            <CtrlBtn
              label="Previous project"
              onClick={() => prev && commit(prev.slug)}
            >
              <span style={{ opacity: prev ? 1 : 0.25 }}>← prev</span>
            </CtrlBtn>

            <CtrlBtn
              label="Next project"
              onClick={() => next && commit(next.slug)}
            >
              <span style={{ opacity: next ? 1 : 0.25 }}>next →</span>
            </CtrlBtn>

            <CtrlBtn label="Close" onClick={close}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>×</span>
              <span>close</span>
            </CtrlBtn>
          </div>

          {/* ── Bottom-left: timecode ───────────────────────────────── */}
          <div className="absolute bottom-8 left-8 sm:left-10 z-20">
            <span
              className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums tracking-[0.08em]"
              style={{ color: "var(--fg-muted)", opacity: 0.5 }}
            >
              {timecode}
            </span>
          </div>

          {/* ── Bottom-right: playback controls ────────────────────── */}
          <div className="absolute bottom-8 right-8 sm:right-10 flex items-center gap-4 z-20">
            {/* Play / Pause */}
            <CtrlBtn
              label={isPlaying ? "Pause" : "Play"}
              onClick={() => setIsPlaying((p) => !p)}
            >
              {isPlaying
                ? <span style={{ fontSize: 10 }}>▐▐</span>
                : <span style={{ fontSize: 10 }}>▶</span>
              }
            </CtrlBtn>

            {/* Sound */}
            <CtrlBtn label={isSoundOn ? "Mute" : "Unmute"} onClick={toggleSound}>
              <span style={{ fontSize: 11 }}>{isSoundOn ? "♪" : "♪̶"}</span>
              <span>{isSoundOn ? "sound on" : "sound off"}</span>
            </CtrlBtn>

            {/* Fullscreen stub */}
            <CtrlBtn label="Fullscreen" onClick={() => document.documentElement.requestFullscreen?.()}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 4V1h3M8 1h3v3M11 8v3H8M4 11H1V8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </CtrlBtn>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
