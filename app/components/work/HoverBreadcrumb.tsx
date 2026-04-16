"use client";

// Top-left breadcrumb that appears when a project is hovered.
// Shows: category / project title (underlined) / adjacent titles (muted).

import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  hoveredId: string | null;
  projects:  Project[];
  reduced:   boolean;
}

export function HoverBreadcrumb({ hoveredId, projects, reduced }: Props) {
  const idx     = hoveredId ? projects.findIndex((p) => p.slug === hoveredId) : -1;
  const project = idx >= 0 ? projects[idx] : null;
  const prev    = idx > 0 ? projects[idx - 1] : null;
  const next    = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.slug}
          className="flex flex-col gap-[3px]"
          initial={{ opacity: 0, y: reduced ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{   opacity: 0, y: reduced ? 0 : -4 }}
          transition={{ duration: reduced ? 0.1 : 0.4, ease: EASE }}
        >
          {/* Category */}
          <span
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            {project.category}
          </span>

          {/* Current project title — underlined */}
          <span
            className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.04em]"
            style={{
              color:          "var(--fg)",
              borderBottom:   "1px solid var(--fg-muted)",
              paddingBottom:  "2px",
            }}
          >
            {project.title}.
          </span>

          {/* Adjacent projects — subtle */}
          {prev && (
            <span
              className="font-[family-name:var(--font-mono)] text-[11px]"
              style={{ color: "var(--fg-muted)", opacity: 0.45 }}
            >
              ↑ {prev.title}.
            </span>
          )}
          {next && (
            <span
              className="font-[family-name:var(--font-mono)] text-[11px]"
              style={{ color: "var(--fg-muted)", opacity: 0.45 }}
            >
              ↓ {next.title}.
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
