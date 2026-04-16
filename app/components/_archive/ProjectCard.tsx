"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
      data-interactive="true"
    >
      <Link
        href={`/work/${project.slug}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "4 / 3",
            background: project.accentColor,
            boxShadow: hovered
              ? "inset 0 0 0 1px var(--accent)"
              : "inset 0 0 0 0px transparent",
            transition: hovered ? "box-shadow 200ms ease" : "box-shadow 600ms ease",
          }}
        >
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            style={{
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 500ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />

          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span
              className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] uppercase px-2 py-1 backdrop-blur-sm"
              style={{
                background: "rgba(5,5,5,0.7)",
                border: "1px solid var(--border)",
                color: "var(--fg-muted)",
              }}
            >
              {project.category}
            </span>
          </div>

          {/* Arrow on hover */}
          <motion.div
            className="absolute bottom-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent)" }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <span
              className="text-[11px] leading-none"
              style={{ color: "var(--bg)" }}
            >
              ↗
            </span>
          </motion.div>
        </div>

        {/* Meta row */}
        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <motion.p
              className="font-[family-name:var(--font-mono)] text-[13px] leading-snug truncate"
              style={{ color: "var(--fg)" }}
              animate={{ x: hovered ? 3 : 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              {project.title}
            </motion.p>
            <p
              className="font-[family-name:var(--font-mono)] text-[11px] mt-0.5"
              style={{ color: "var(--fg-muted)" }}
            >
              {project.client}
            </p>
          </div>
          <span
            className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums shrink-0 pt-[1px]"
            style={{ color: "var(--fg-muted)" }}
          >
            {project.year}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
