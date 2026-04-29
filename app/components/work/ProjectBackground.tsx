"use client";

// SWAP GUIDE — adding real video in one line per project:
//   In data/portfolio.json, set:
//     "videoUrl": "https://player.vimeo.com/progressive_redirect/...",
//     "posterUrl": "/uploads/poster.jpg"
//   This component automatically switches from the CSS procedural placeholder
//   to a <video> element when videoUrl is present.

import { motion } from "framer-motion";
import type { Work } from "@/lib/db";
import { useRef, useEffect } from "react";

const FADE_DURATION = 0.6;

interface Props {
  work:     Work | null;
  visible:  boolean;
  soundOn:  boolean;
  reduced:  boolean;
}

export function ProjectBackground({ work, visible, soundOn, reduced }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !soundOn;
  }, [soundOn]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (visible) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [visible]);

  if (!work) return null;

  const opacity = visible ? 1 : 0;
  const transition = { duration: reduced ? 0.1 : FADE_DURATION, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div className="absolute inset-0 pointer-events-none" animate={{ opacity }} transition={transition} aria-hidden>
      {work.videoUrl ? (
        <video
          ref={videoRef}
          src={work.videoUrl}
          poster={work.posterUrl}
          loop
          playsInline
          muted={!soundOn}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <ProceduralBackground work={work} reduced={reduced} />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,5,5,0.55) 100%)",
        }}
      />
    </motion.div>
  );
}

function ProceduralBackground({ work, reduced }: { work: Work; reduced: boolean }) {
  const c = work.accentColor || "#0051FF";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ background: "var(--bg)" }}>
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 70% 60% at 55% 45%, ${c}55 0%, ${c}18 45%, transparent 72%)` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 50% 50% at 20% 75%, ${c}28 0%, transparent 60%)` }}
      />
      {!reduced && (
        <motion.div
          className="absolute inset-[-20%]"
          style={{ background: `linear-gradient(127deg, ${c}18 0%, transparent 45%, ${c}10 80%, transparent 100%)` }}
          animate={{ x: ["-5%", "5%", "-5%"], y: ["-3%", "4%", "-3%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        />
      )}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.06, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id={`noise-${work.id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#noise-${work.id})`} />
        </svg>
      </div>
    </div>
  );
}
