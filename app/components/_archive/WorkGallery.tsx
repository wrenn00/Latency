"use client";

/*
 * WorkGallery
 * ─────────────────────────────────────────────────────────────
 * WHERE TO ADD REAL THUMBNAILS:
 *   Place images in public/placeholders/ then update the
 *   `images` array and `accentColor` in data/projects.ts.
 *
 * HOW TO ADD A NEW PROJECT:
 *   Edit data/projects.ts — push a new entry to PROJECTS.
 *   The gallery, filter counts, and /work pages auto-update.
 *
 * MODAL → ROUTE REFACTOR:
 *   In WorkGallery, swap the `onOpen` handler on <GalleryCard>
 *   for `router.push(\`/work/\${project.slug}\`)` and remove the
 *   <ProjectModal> render. Then delete ProjectModal.tsx.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, type Category } from "@/data/projects";
import { GalleryCard } from "./GalleryCard";
import { ProjectModal } from "./ProjectModal";
import type { Project } from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;
const COLS_DESKTOP = 7;

const FILTERS: { display: string; value: Category | null }[] = [
  { display: "ALL",     value: null },
  { display: "UI/UX",   value: "UI/UX" },
  { display: "GRAPHIC", value: "Graphic Design" },
  { display: "XR",      value: "XR Design" },
  { display: "AD",      value: "Advertising" },
  { display: "INT",     value: "Interaction" },
];

interface CategoryLabelProps {
  display: string;
  active: boolean;
  count: number;
  onClick: () => void;
}

function CategoryLabel({ display, active, count, onClick }: CategoryLabelProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-interactive="true"
      className="relative block text-left leading-[0.92] select-none cursor-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
      style={{
        fontSize: "clamp(44px, 5.5vw, 88px)",
        fontWeight: 800,
        fontFamily: "var(--font-sans), Inter, sans-serif",
        // Active: solid fill. Inactive: outlined stroke.
        color:             active ? "var(--fg)"        : "transparent",
        WebkitTextStroke:  active ? "0px"              : "1.5px var(--fg-subtle)",
        opacity:           active ? 1 : hovered ? 0.65 : 0.38,
        transition:        "opacity 200ms, color 200ms, -webkit-text-stroke 200ms",
      }}
      animate={{ x: hovered && !active ? 4 : 0 }}
      transition={{ duration: 0.18, ease: EASE }}
      aria-pressed={active}
    >
      {display}
      <span
        className="absolute top-[0.15em] -right-[0.6em] font-[family-name:var(--font-mono)] text-[10px] tabular-nums"
        style={{
          color:           "var(--fg)",
          WebkitTextStroke:"0px",
          fontWeight:      400,
          opacity:         active ? 0.45 : 0.22,
        }}
      >
        {count}
      </span>
    </motion.button>
  );
}

export function WorkGallery() {
  const [selected, setSelected] = useState<Category | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of PROJECTS) {
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    map["__all__"] = PROJECTS.length;
    return map;
  }, []);

  const filtered = useMemo(
    () => (selected ? PROJECTS.filter((p) => p.category === selected) : PROJECTS),
    [selected]
  );

  function handleSelect(value: Category | null) {
    setSelected((prev) => (prev === value ? null : value));
  }

  return (
    <section id="work" className="w-full overflow-hidden" style={{ background: "var(--bg)" }}>

      {/* ── SECTION TOP BAR ──────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 sm:px-10 py-5"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span
          className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] select-none"
          style={{ color: "var(--fg-subtle)" }}
        >
          +×
        </span>
        <span
          className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.22em] uppercase"
          style={{ color: "var(--fg-muted)", opacity: 0.5 }}
        >
          // selected work
        </span>
        {/* Decorative hamburger */}
        <button
          data-interactive="true"
          className="flex flex-col gap-[4px] cursor-none focus:outline-none"
          style={{ opacity: 0.2 }}
          aria-label="Menu (decorative)"
          tabIndex={-1}
        >
          <span className="block w-[18px] h-[1.5px]" style={{ background: "var(--fg)" }} />
          <span className="block w-[12px] h-[1.5px]" style={{ background: "var(--fg)" }} />
        </button>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────── */}
      <div className="flex">

        {/* Desktop sticky category labels */}
        <aside className="hidden lg:flex flex-col justify-start gap-0 pl-6 sm:pl-10 pt-6 pb-10 sticky top-0 self-start w-[18%] xl:w-[16%] shrink-0">
          {FILTERS.map(({ display, value }) => (
            <CategoryLabel
              key={display}
              display={display}
              active={selected === value}
              count={value === null ? counts["__all__"] ?? 0 : counts[value] ?? 0}
              onClick={() => handleSelect(value)}
            />
          ))}
        </aside>

        {/* Mobile filter bar */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-6 sm:px-10 pb-4 scrollbar-none w-full">
          {FILTERS.map(({ display, value }) => (
            <button
              key={display}
              onClick={() => handleSelect(value)}
              data-interactive="true"
              className="shrink-0 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.12em] uppercase px-3 py-1 cursor-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
              style={{
                background:  selected === value ? "var(--fg)"    : "var(--bg-elevated)",
                border:      `1px solid ${selected === value ? "var(--fg)" : "var(--border)"}`,
                color:       selected === value ? "var(--bg)"    : "var(--fg-muted)",
                transition:  "background 150ms, border-color 150ms, color 150ms",
              }}
            >
              {display}
              <span className="ml-1.5 tabular-nums" style={{ opacity: 0.45 }}>
                {value === null ? counts["__all__"] ?? 0 : counts[value] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Grid — gap shows as --bg (black lines between tiles) */}
        <div className="flex-1 min-w-0 lg:pr-10">
          <AnimatePresence mode="popLayout">
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-[4px]"
              style={{ background: "var(--bg)" }}
            >
              {filtered.map((project, i) => {
                const col = i % COLS_DESKTOP;
                const row = Math.floor(i / COLS_DESKTOP);
                return (
                  <GalleryCard
                    key={project.slug}
                    project={project}
                    delay={(col + row) * 0.028}
                    onOpen={setOpenProject}
                  />
                );
              })}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p
              className="font-[family-name:var(--font-mono)] text-[12px] p-8"
              style={{ color: "var(--fg-muted)" }}
            >
              no projects in this category.
            </p>
          )}
        </div>

        {/* Right decorative rail */}
        <div
          className="hidden xl:flex flex-col justify-between items-center w-10 shrink-0 py-6 sticky top-0 self-start h-screen ml-2"
          style={{ borderLeft: "1px solid var(--border)" }}
        >
          <span
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.1em] select-none"
            style={{ color: "var(--fg-subtle)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            w.
          </span>
          <span
            className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.18em] uppercase select-none"
            style={{ color: "var(--fg-subtle)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Honors
          </span>
        </div>
      </div>

      {/* Copyright */}
      <p
        className="font-[family-name:var(--font-mono)] text-[10px] text-center tracking-[0.15em] uppercase py-10"
        style={{ color: "var(--fg-muted)", opacity: 0.3 }}
      >
        LATENCY &copy; {new Date().getFullYear()}
      </p>

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}
