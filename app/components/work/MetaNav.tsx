"use client";

// Bottom center strip — LATENCY brand + category filters + page links.
// Mirrors the voku.studio signature horizontal bar.

import Link from "next/link";
import { ALL_CATEGORIES } from "@/data/projects";
import { useWorkCanvas, type FilterCategory } from "./WorkCanvasContext";

const DOT = (
  <span aria-hidden style={{ color: "var(--fg-subtle)", margin: "0 7px" }}>
    ·
  </span>
);

export function MetaNav() {
  const { filterCategory, setFilter } = useWorkCanvas();

  const NavItem = ({
    label,
    value,
  }: {
    label: string;
    value: FilterCategory | null;
  }) => {
    const active = value !== null && filterCategory === value;
    return (
      <button
        onClick={() => value !== null && setFilter(value)}
        data-interactive="true"
        className="cursor-none focus:outline-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.04em]"
        style={{
          color:        "var(--fg-muted)",
          borderBottom: active ? "1px solid var(--fg-muted)" : "1px solid transparent",
          paddingBottom: "1px",
          transition:   "opacity 150ms",
          opacity:      active ? 1 : undefined,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = active ? "1" : "")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex items-center flex-wrap justify-center" style={{ gap: "0 2px" }}>
      {/* Brand */}
      <span
        className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.1em] uppercase"
        style={{ color: "var(--fg-muted)", opacity: 0.5 }}
      >
        LATENCY
      </span>
      {DOT}

      {/* Category filters */}
      {ALL_CATEGORIES.map((cat, i) => (
        <span key={cat} className="inline-flex items-center">
          <NavItem label={cat} value={cat as FilterCategory} />
          {i < ALL_CATEGORIES.length - 1 && DOT}
        </span>
      ))}
      {DOT}

      {/* Page links */}
      <Link
        href="/#about"
        data-interactive="true"
        className="cursor-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.04em] focus:outline-none"
        style={{ color: "var(--fg-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "")}
      >
        About
      </Link>
      {DOT}
      <Link
        href="/#contact"
        data-interactive="true"
        className="cursor-none font-[family-name:var(--font-mono)] text-[11px] tracking-[0.04em] focus:outline-none"
        style={{ color: "var(--fg-muted)" }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "")}
      >
        Contact
      </Link>
    </div>
  );
}
