"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Work } from "@/lib/db";
import { useWorkCanvas } from "./WorkCanvasContext";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  works: Work[];
}

export function WorkGrid({ works }: Props) {
  const { selectWork } = useWorkCanvas();

  if (works.length === 0) {
    return (
      <div className="pt-4">
        <p
          className="font-[family-name:var(--font-mono)] text-[13px] tracking-[0.06em]"
          style={{ color: "var(--fg-muted)", opacity: 0.35 }}
        >
          No works yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {works.map((work, i) => (
        <WorkCard
          key={work.id}
          work={work}
          index={i}
          // Only first card is above-the-fold — eager load it for LCP
          eager={i === 0}
          onSelect={selectWork}
        />
      ))}
    </div>
  );
}

interface CardProps {
  work:     Work;
  index:    number;
  eager:    boolean;
  onSelect: (id: string) => void;
}

// memo prevents re-render when sibling cards change (e.g. hover state in parent)
const WorkCard = memo(function WorkCard({ work, index, eager, onSelect }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: EASE }}
    >
      <button
        onClick={() => onSelect(work.id)}
        data-interactive="true"
        className="group block w-full text-left cursor-none focus:outline-none"
      >
        {/* Thumbnail */}
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4 / 5", background: work.accentColor || "#111" }}
        >
          {work.thumbnail && (
            <Image
              src={work.thumbnail}
              alt={work.title}
              fill
              // Use transform-based scale — GPU composited, no layout cost
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              // Priority (eager) only on first card; rest lazy-load
              priority={eager}
              loading={eager ? undefined : "lazy"}
            />
          )}
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.15)" }}
          />
        </div>

        {/* Meta */}
        <div className="mt-3 text-left">
          <p
            className="font-[family-name:var(--font-mono)] text-[13px] tracking-[-0.01em] transition-opacity duration-200 group-hover:opacity-70"
            style={{ color: "var(--fg)" }}
          >
            {work.title}
          </p>
          <p
            className="font-[family-name:var(--font-mono)] text-[11px] mt-0.5"
            style={{ color: "var(--fg-muted)", opacity: 0.4 }}
          >
            {work.year}
          </p>
        </div>
      </button>
    </motion.div>
  );
});
