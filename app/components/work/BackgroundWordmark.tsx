"use client";

// Giant atmospheric title — 5–8% opacity, thin weight, bottom-anchored.
// IDLE: cycles through project titles every 4 s with a vertical slide.
// HOVER: immediately cross-fades to the hovered project's title.
// The outer <motion.div> controls base opacity (brighter when something is hovered).
// The inner AnimatePresence manages the y-slide when the title changes.

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";

const IDLE_MS  = 4000;
const EASE     = [0.22, 1, 0.36, 1] as const;

interface Props {
  hoveredId:         string | null;
  filteredProjects:  Project[];
  reduced:           boolean;
}

export function BackgroundWordmark({ hoveredId, filteredProjects, reduced }: Props) {
  const [idleIdx, setIdleIdx] = useState(0);

  // Advance idle cycle only when nothing is hovered
  useEffect(() => {
    if (hoveredId !== null || filteredProjects.length === 0) return;
    const id = setInterval(
      () => setIdleIdx((i) => (i + 1) % filteredProjects.length),
      IDLE_MS,
    );
    return () => clearInterval(id);
  }, [hoveredId, filteredProjects.length]);

  const activeProject = hoveredId
    ? filteredProjects.find((p) => p.slug === hoveredId)
    : filteredProjects[idleIdx % Math.max(filteredProjects.length, 1)];

  const title = activeProject?.title ?? "";

  return (
    // Outer: controls how visible the wordmark is (hover = slightly brighter)
    <motion.div
      className="absolute inset-0 flex items-end overflow-hidden pointer-events-none select-none"
      style={{ paddingBottom: "8vh", paddingLeft: "6vw", paddingRight: "6vw" }}
      animate={{ opacity: hoveredId ? 1 : 0.55 }}
      transition={{ duration: reduced ? 0.1 : 0.8, ease: EASE }}
      aria-hidden
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={title}
          className="font-[family-name:var(--font-sans)] leading-[0.86] whitespace-nowrap overflow-hidden text-ellipsis w-full"
          style={{
            fontSize:      "clamp(56px, 17vw, 210px)",
            fontWeight:    100,
            letterSpacing: "-0.04em",
            color:         "var(--fg)",
            opacity:       0.062,
          }}
          initial={{ y: reduced ? 0 : 44, opacity: 0 }}
          animate={{ y: 0, opacity: 0.062 }}
          exit={{   y: reduced ? 0 : -44, opacity: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.65, ease: EASE }}
        >
          {title}.
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
