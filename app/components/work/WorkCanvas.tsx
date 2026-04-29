"use client";

/*
 * WorkCanvas — three-view portfolio layout
 * ══════════════════════════════════════════
 * grid       → card thumbnails (default)
 * split      → 60/40 image + info panel
 * fullscreen → image fills entire screen
 *
 * Sidebar (categories + clock) stays visible in grid + split.
 * Fullscreen overlays everything.
 * ══════════════════════════════════════════
 */

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { WorkCanvasProvider, useWorkCanvas } from "./WorkCanvasContext";
import { CategoryStack } from "./CategoryStack";
import { WorkGrid } from "./WorkGrid";
import { SplitView } from "./SplitView";
import { LiveClock } from "@/app/components/LiveClock";
import type { Work, PortfolioCategory } from "@/lib/db";

const EASE = [0.22, 1, 0.36, 1] as const;

interface WorkCanvasProps {
  works:      Work[];
  categories: PortfolioCategory[];
}

export function WorkCanvas({ works, categories }: WorkCanvasProps) {
  return (
    <WorkCanvasProvider works={works} categories={categories}>
      <WorkCanvasInner />
    </WorkCanvasProvider>
  );
}

function WorkCanvasInner() {
  const {
    works, filterCategory,
    viewMode, selectedWorkId,
    exitFullscreen,
  } = useWorkCanvas();

  const filteredWorks = useMemo<Work[]>(() => {
    if (filterCategory === "ALL") return works;
    return works.filter((w) => w.categoryId === filterCategory);
  }, [works, filterCategory]);

  const selectedWork = selectedWorkId
    ? works.find((w) => w.id === selectedWorkId) ?? null
    : null;

  // Fullscreen Esc key
  useEffect(() => {
    if (viewMode !== "fullscreen") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") exitFullscreen(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewMode, exitFullscreen]);

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "var(--bg)" }} role="main">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-8 sm:px-10 pt-7 sm:pt-9 pb-5">
        <Link
          href="/"
          data-interactive="true"
          className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] uppercase cursor-none focus:outline-none"
          style={{ color: "var(--fg)" }}
        >
          LATENCY
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--accent)", animation: "glowPulse 2s ease-in-out infinite" }}
          />
        </Link>
        <nav className="flex items-center gap-5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.12em] uppercase">
          {[
            { label: "work",    href: "/work" },
            { label: "about",   href: "/#about" },
            { label: "contact", href: "/#contact" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              data-interactive="true"
              className="wc-nav cursor-none focus:outline-none"
              style={{ color: "var(--fg-muted)" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      {/* ── BODY ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0" style={{ borderTop: "1px solid var(--border)" }}>

        {/* LEFT: category sidebar */}
        <aside
          className="shrink-0 flex flex-col px-8 sm:px-10 pt-6 pb-8"
          style={{
            width: "clamp(150px, 16vw, 210px)",
            borderRight: "1px solid var(--border)",
          }}
        >
          <CategoryStack />
          <div className="flex-1" />
          <LiveClock />
        </aside>

        {/* RIGHT: view area */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" && (
            <motion.main
              key="grid"
              className="flex-1 min-w-0 overflow-y-auto px-8 sm:px-10 pt-6 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <WorkGrid works={filteredWorks} />
              {filteredWorks.length > 0 && (
                <p
                  className="mt-12 font-[family-name:var(--font-mono)] text-[10px] tabular-nums"
                  style={{ color: "var(--fg-muted)", opacity: 0.28 }}
                >
                  {filteredWorks.length} {filteredWorks.length === 1 ? "work" : "works"}
                </p>
              )}
            </motion.main>
          )}

          {(viewMode === "split" || viewMode === "fullscreen") && selectedWork && (
            <SplitView
              key={`split-${selectedWork.id}`}
              work={selectedWork}
              filteredWorks={filteredWorks}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── FULLSCREEN OVERLAY ─────────────────────────────────────── */}
      <AnimatePresence>
        {viewMode === "fullscreen" && selectedWork?.thumbnail && (
          <motion.div
            className="fixed inset-0 z-[9000] flex items-center justify-center"
            style={{ background: "#000" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <Image
              src={selectedWork.thumbnail}
              alt={selectedWork.title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            {/* Collapse button */}
            <button
              onClick={exitFullscreen}
              data-interactive="true"
              aria-label="Exit fullscreen"
              className="absolute top-6 right-8 cursor-none font-[family-name:var(--font-mono)] text-[12px] tracking-[0.08em] flex items-center gap-1.5 transition-opacity duration-150 z-10"
              style={{ color: "var(--fg-muted)", opacity: 0.55 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
            >
              ↙ <span>collapse</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 4px rgba(0,81,255,0.35); }
          50%       { opacity: 1;   box-shadow: 0 0 10px rgba(0,81,255,0.6); }
        }
        .wc-nav { transition: color 150ms; }
        .wc-nav:hover { color: var(--fg) !important; }
      `}</style>
    </div>
  );
}
