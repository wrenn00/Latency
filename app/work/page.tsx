"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, ALL_CATEGORIES, type Category } from "@/data/projects";
import { ProjectCard } from "@/app/components/ProjectCard";
import { CategoryFilter } from "@/app/components/CategoryFilter";
import { LiveClock } from "@/app/components/LiveClock";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── SOCIAL LINKS — SWAP: update href values ──────────────────────────────────
const SOCIAL = [
  { label: "twitter", href: "https://twitter.com/" },
  { label: "email",   href: "mailto:dan@latency.work" },
  { label: "are.na",  href: "https://are.na/" },
] as const;

export default function WorkPage() {
  const [selected, setSelected] = useState<Category | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of PROJECTS) {
      map[p.category] = (map[p.category] ?? 0) + 1;
    }
    return map;
  }, []);

  const filtered = useMemo(
    () => (selected ? PROJECTS.filter((p) => p.category === selected) : PROJECTS),
    [selected]
  );

  return (
    <>
      <div
        className="min-h-[100dvh] flex flex-col"
        style={{ background: "var(--bg)" }}
      >
        {/* ── NAV ────────────────────────────────────────────────────── */}
        <motion.nav
          className="flex items-center justify-between px-6 sm:px-10 pt-7 sm:pt-9 shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Link
            href="/"
            data-interactive="true"
            className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px] tracking-[0.18em] uppercase"
            style={{ color: "var(--fg)" }}
          >
            LATENCY
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)", animation: "glowPulse 2s ease-in-out infinite" }}
            />
          </Link>

          <div
            className="flex items-center gap-5 sm:gap-7 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px] tracking-[0.12em] uppercase"
          >
            <span
              className="border-b"
              style={{ color: "var(--fg)", borderColor: "var(--fg)" }}
            >
              work
            </span>
            <Link
              href="/#about"
              data-interactive="true"
              className="transition-opacity duration-150"
              style={{ color: "var(--fg-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
            >
              about
            </Link>
            <Link
              href="/#contact"
              data-interactive="true"
              className="transition-opacity duration-150"
              style={{ color: "var(--fg-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
            >
              contact
            </Link>
          </div>
        </motion.nav>

        {/* ── PAGE HEADER ────────────────────────────────────────────── */}
        <motion.div
          className="px-6 sm:px-10 pt-14 pb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
        >
          <p
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ color: "var(--fg-muted)", opacity: 0.4 }}
          >
            // selected work
          </p>
          <div className="flex items-baseline gap-3">
            <h1
              className="font-[family-name:var(--font-mono)] text-[22px] sm:text-[28px] tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              {selected ?? "All Projects"}
            </h1>
            <span
              className="font-[family-name:var(--font-mono)] text-[13px] tabular-nums"
              style={{ color: "var(--fg-muted)" }}
            >
              ({filtered.length})
            </span>
          </div>
        </motion.div>

        {/* ── MOBILE FILTER BAR ──────────────────────────────────────── */}
        <motion.div
          className="lg:hidden px-6 sm:px-10 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
        >
          <CategoryFilter
            categories={ALL_CATEGORIES}
            counts={counts}
            selected={selected}
            onSelect={setSelected}
            layout="bar"
          />
        </motion.div>

        {/* ── CONTENT: sidebar + grid ─────────────────────────────────── */}
        <div className="flex-1 flex gap-10 xl:gap-16 px-6 sm:px-10 pb-24">
          {/* Desktop filter sidebar */}
          <motion.aside
            className="hidden lg:block w-[160px] xl:w-[180px] shrink-0"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
          >
            <div className="sticky top-24">
              <CategoryFilter
                categories={ALL_CATEGORIES}
                counts={counts}
                selected={selected}
                onSelect={setSelected}
                layout="sidebar"
              />
            </div>
          </motion.aside>

          {/* Project grid */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected ?? "all"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10"
              >
                {filtered.map((project, i) => (
                  <ProjectCard key={project.slug} project={project} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>

            {filtered.length === 0 && (
              <p
                className="font-[family-name:var(--font-mono)] text-[13px] pt-8"
                style={{ color: "var(--fg-muted)" }}
              >
                no projects in this category.
              </p>
            )}
          </div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <footer
          className="shrink-0 flex items-center justify-between px-6 sm:px-10 pb-6 sm:pb-8 pt-5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <LiveClock />
          <div className="flex items-center gap-5 sm:gap-6 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] uppercase">
            {SOCIAL.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                data-interactive="true"
                className="transition-all duration-150"
                style={{ color: "var(--fg-muted)", opacity: 0.5 }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--fg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "var(--fg-muted)"; }}
              >
                {label}
              </a>
            ))}
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 4px rgba(0,81,255,0.35); }
          50%       { opacity: 1;   box-shadow: 0 0 10px rgba(0,81,255,0.6); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
