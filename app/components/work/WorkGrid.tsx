"use client";

import { memo } from "react";
import Image from "next/image";
import type { Work } from "@/lib/db";
import { useWorkCanvas } from "./WorkCanvasContext";

// No Framer Motion on cards — CSS-only hover and entry animation.
// Framer Motion subscriptions on each card were adding JS overhead per-hover.

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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work, i) => (
          <WorkCard
            key={work.id}
            work={work}
            index={i}
            eager={i === 0}
            onSelect={selectWork}
          />
        ))}
      </div>

      {/* CSS entry animation — no JS, no Framer Motion subscription */}
      <style>{`
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .wg-card {
          opacity: 0;
          animation: cardEnter 320ms ease forwards;
        }
        /* CSS-only hover: scale image, dim overlay */
        .wg-thumb-img {
          transition: transform 280ms ease;
          will-change: transform;
        }
        .wg-card:hover .wg-thumb-img {
          transform: scale(1.025);
        }
        .wg-thumb-overlay {
          opacity: 0;
          transition: opacity 220ms ease;
        }
        .wg-card:hover .wg-thumb-overlay {
          opacity: 1;
        }
        .wg-title {
          transition: opacity 180ms ease;
        }
        .wg-card:hover .wg-title {
          opacity: 0.65;
        }
      `}</style>
    </>
  );
}

interface CardProps {
  work:     Work;
  index:    number;
  eager:    boolean;
  onSelect: (id: string) => void;
}

// memo: prevents sibling-card re-renders from propagating here
const WorkCard = memo(function WorkCard({ work, index, eager, onSelect }: CardProps) {
  return (
    <div
      className="wg-card"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <button
        onClick={() => onSelect(work.id)}
        data-interactive="true"
        className="block w-full text-left cursor-none focus:outline-none"
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
              className="object-cover wg-thumb-img"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={eager}
              loading={eager ? undefined : "lazy"}
            />
          )}
          {/* Hover overlay — CSS-only, no JS */}
          <div
            className="wg-thumb-overlay absolute inset-0 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.14)" }}
          />
        </div>

        {/* Meta */}
        <div className="mt-3">
          <p
            className="wg-title font-[family-name:var(--font-mono)] text-[13px] tracking-[-0.01em]"
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
    </div>
  );
});
