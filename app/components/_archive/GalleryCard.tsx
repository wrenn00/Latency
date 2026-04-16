"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

interface GalleryCardProps {
  project: Project;
  delay?: number;
  onOpen: (project: Project) => void;
}

export function GalleryCard({ project, delay = 0, onOpen }: GalleryCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      layout
      className="relative block w-full text-left overflow-hidden cursor-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
      style={{
        aspectRatio: "3 / 4",
        background: project.accentColor,
        // Accent glow border on hover instead of dark overlay
        boxShadow: hovered
          ? "inset 0 0 0 1px var(--accent), 0 0 24px var(--accent-glow)"
          : "inset 0 0 0 0px transparent",
        transition: hovered
          ? "box-shadow 200ms ease"
          : "box-shadow 600ms ease",
      }}
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(project)}
      data-interactive="true"
      aria-label={`Open ${project.title}`}
    >
      {/* Thumbnail */}
      <Image
        src={project.images[0]}
        alt={project.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
        className="object-cover"
        style={{
          transform: hovered ? "scale(1.03)" : "scale(1)",
          transition: "transform 400ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Hover info — slides up from bottom */}
      <motion.div
        className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-8 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
        }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <p
          className="font-[family-name:var(--font-mono)] text-[12px] leading-snug truncate"
          style={{ color: "var(--fg)" }}
        >
          {project.title}
        </p>
        <p
          className="font-[family-name:var(--font-mono)] text-[10px] mt-0.5"
          style={{ color: "rgba(242,242,242,0.55)" }}
        >
          {project.year} · {project.category}
        </p>
        {/* Accent underline under title */}
        <motion.div
          className="mt-1.5 h-[1px] rounded-full"
          style={{ background: "var(--accent)" }}
          animate={{ width: hovered ? "40%" : "0%" }}
          transition={{ duration: 0.3, delay: 0.05, ease: EASE }}
        />
      </motion.div>
    </motion.button>
  );
}
