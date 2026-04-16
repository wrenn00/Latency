"use client";

// ─── ProjectBackground ────────────────────────────────────────────────────────
//
// SWAP GUIDE — adding real video in one line per project:
//   In data/projects.ts, add:
//     videoUrl: "https://player.vimeo.com/progressive_redirect/...",
//     posterUrl: "/path/to/poster.jpg",
//   to any project entry. This component automatically uses the <video>
//   element when videoUrl is present; otherwise renders the procedural
//   CSS placeholder built from accentColor.
//
// Each layer is always mounted; opacity transitions handle the crossfade.
// The parent WorkCanvas owns two instances (A/B) and alternates which one
// is visible to achieve smooth overlapping crossfades (State D).
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { useRef, useEffect } from "react";

const FADE_DURATION = 0.6; // seconds — both enter and exit

interface ProjectBackgroundProps {
  project: Project | null;
  visible: boolean;
  soundOn: boolean;
  reduced: boolean;
}

export function ProjectBackground({
  project,
  visible,
  soundOn,
  reduced,
}: ProjectBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !soundOn;
  }, [soundOn]);

  // Play/pause based on visibility
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (visible) {
      vid.play().catch(() => {/* autoplay blocked — stays paused */});
    } else {
      vid.pause();
    }
  }, [visible]);

  if (!project) return null;

  const opacity = visible ? 1 : 0;
  const transition = { duration: reduced ? 0.1 : FADE_DURATION, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      className="absolute inset-0"
      animate={{ opacity }}
      transition={transition}
      aria-hidden
    >
      {project.videoUrl ? (
        // ── Real video ──────────────────────────────────────────────────────
        <video
          ref={videoRef}
          src={project.videoUrl}
          poster={project.posterUrl}
          loop
          playsInline
          muted={!soundOn}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        // ── Procedural CSS placeholder ───────────────────────────────────────
        // Built from accentColor so each project feels distinct.
        // Replace with videoUrl later without touching this component.
        <ProceduralBackground project={project} reduced={reduced} />
      )}

      {/* Vignette so text stays readable over any media */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,5,0.55) 100%)",
        }}
      />
    </motion.div>
  );
}

// ── Procedural animated placeholder ──────────────────────────────────────────
function ProceduralBackground({
  project,
  reduced,
}: {
  project: Project;
  reduced: boolean;
}) {
  const c = project.accentColor;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Dominant color radial */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 55% 45%, ${c}55 0%, ${c}18 45%, transparent 72%)`,
        }}
      />

      {/* Secondary color bloom — bottom-left */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 20% 75%, ${c}28 0%, transparent 60%)`,
        }}
      />

      {/* Slow-panning overlay — skips animation when reduced motion */}
      {!reduced && (
        <motion.div
          className="absolute inset-[-20%]"
          style={{
            background: `linear-gradient(127deg, ${c}18 0%, transparent 45%, ${c}10 80%, transparent 100%)`,
          }}
          animate={{ x: ["-5%", "5%", "-5%"], y: ["-3%", "4%", "-3%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        />
      )}

      {/* Noise texture reinforcement (uses the same SVG grain as GrainOverlay) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.06, mixBlendMode: "overlay" }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id={`noise-${project.slug}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#noise-${project.slug})`} />
        </svg>
      </div>
    </div>
  );
}
