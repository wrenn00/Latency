/*
 * ─────────────────────────────────────────────────────────────────
 *  LATENCY — DAN  |  Personal Portfolio
 * ─────────────────────────────────────────────────────────────────
 *  SWAP GUIDE:
 *    Avatar image  → replace the <span className="w-8 h-8 …">D</span>
 *                    in components/InlineInteraction.tsx (DanWord)
 *                    with <img src="/avatar.jpg" … className="w-8 h-8 rounded-full object-cover" />
 *
 *    Social links  → search "SWAP: links" below and update href values
 *
 *    Selected Work → search "SWAP: projects" below and update the
 *                    PROJECTS array with real titles, years, and tags
 *
 *    Clock city    → open components/LiveClock.tsx and replace
 *                    "SEL" with your city code (e.g. "NYC", "TYO", "LON")
 * ─────────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DanWord,
  BetweenWord,
  TimingWord,
  LatencyWord,
  HatsWord,
  UiUxWord,
  LateWord,
  GraphicDesignWord,
  AdvertisingWord,
  ThingsWord,
  XrDesignWord,
  DiscomfortWord,
} from "./components/InlineInteraction";
import { CustomCursor } from "./components/CustomCursor";
import { LiveClock } from "./components/LiveClock";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── SWAP: projects ───────────────────────────────────────────────────────────
const PROJECTS = [
  { year: "2024", title: "Haptic Response System", tag: "XR / Interaction" },
  { year: "2023", title: "Interval — Temporal UI Kit", tag: "UI/UX / Design System" },
  { year: "2023", title: "Pause Campaign", tag: "Advertising / Motion" },
  { year: "2022", title: "Signal — Type in Time", tag: "Graphic Design / Editorial" },
];

// ─── HERO PARAGRAPH ───────────────────────────────────────────────────────────
function HeroParagraph() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="text-[14px] sm:text-[15px] leading-[1.85] text-[#111111] font-[family-name:var(--font-mono)]"
      initial={{ opacity: 0, y: 6 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {/* Paragraph 1 */}
      <p className="mb-5">
        {"Yo! I\u2019m\u00A0"}
        <span data-interactive="true"><DanWord /></span>
        {". I design the time\u00A0"}
        <span data-interactive="true"><BetweenWord /></span>
        {"\u00A0action and response. My background is in interaction design, but what I really obsess over is\u00A0"}
        <span data-interactive="true"><TimingWord /></span>
        {"\u00A0\u2014 not just how things look, but when they happen."}
      </p>

      {/* Paragraph 2 */}
      <p className="mb-5">
        {"I work under the name\u00A0"}
        <span data-interactive="true"><LatencyWord /></span>
        {". Most designers look at screens. I look at what\u2019s\u00A0"}
        <span data-interactive="true"><BetweenWord /></span>
        {"\u00A0them. Fast isn\u2019t the goal. The right timing is."}
      </p>

      {/* Paragraph 3 */}
      <p>
        {"I wear many different\u00A0"}
        <span data-interactive="true"><HatsWord /></span>
        {". In\u00A0"}
        <span data-interactive="true"><UiUxWord /></span>
        {", I think about when information arrives \u2014 exactly when you need it, not a beat too\u00A0"}
        <span data-interactive="true"><LateWord /></span>
        {". In\u00A0"}
        <span data-interactive="true"><GraphicDesignWord /></span>
        {", visual rhythm guides the eye through silence as much as form. In\u00A0"}
        <span data-interactive="true"><AdvertisingWord /></span>
        {", a perfectly-timed message and a mistimed one are two completely different\u00A0"}
        <span data-interactive="true"><ThingsWord /></span>
        {". In\u00A0"}
        <span data-interactive="true"><XrDesignWord /></span>
        {", latency between movement and response is the difference between immersion and\u00A0"}
        <span data-interactive="true"><DiscomfortWord /></span>
        {"."}
      </p>
    </motion.div>
  );
}

// ─── PROJECT ROW ──────────────────────────────────────────────────────────────
function ProjectRow({
  year,
  title,
  tag,
  index,
}: {
  year: string;
  title: string;
  tag: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex items-baseline gap-4 sm:gap-8 py-3.5 border-b border-[#E5E5E5]"
      data-interactive="true"
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-[11px] opacity-35 tabular-nums w-9 shrink-0 font-[family-name:var(--font-mono)]">
        {year}
      </span>
      <motion.span
        className="text-[13px] font-[family-name:var(--font-mono)] flex-1"
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ duration: 0.18, ease: EASE }}
      >
        {title}
      </motion.span>
      <span className="text-[11px] opacity-35 font-[family-name:var(--font-mono)] hidden sm:block shrink-0">
        {tag}
      </span>
      <motion.span
        className="text-[11px] font-[family-name:var(--font-mono)] shrink-0 w-4"
        animate={{ opacity: hovered ? 0.5 : 0 }}
        transition={{ duration: 0.15 }}
      >
        ↗
      </motion.span>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <CustomCursor />

      {/* ── HERO — full viewport, no scroll ────────────────────────── */}
      <section className="h-[100dvh] flex flex-col bg-[#FAFAFA] overflow-hidden">

        {/* Top navigation */}
        <motion.nav
          className="flex items-center justify-between px-6 sm:px-10 pt-7 sm:pt-9 shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {/* Logo mark */}
          <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#111]">
            LATENCY
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#0051FF]"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          </div>

          {/* Nav links — SWAP: links */}
          <div className="flex items-center gap-5 sm:gap-7 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px]">
            {(["work", "about", "contact"] as const).map((item) => (
              <a
                key={item}
                href={`#${item}`}
                data-interactive="true"
                className="text-[#111] opacity-40 hover:opacity-100 transition-opacity duration-150"
              >
                {item}
              </a>
            ))}
          </div>
        </motion.nav>

        {/* Hero copy — vertically centered in remaining space */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 overflow-hidden">
          <div className="w-full max-w-[720px]">
            <HeroParagraph />
          </div>
        </div>

        {/* Bottom footer strip */}
        <motion.footer
          className="shrink-0 flex items-center justify-between px-6 sm:px-10 pb-6 sm:pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.25, ease: EASE }}
        >
          <LiveClock />

          {/* SWAP: links — update href values */}
          <div className="flex items-center gap-5 sm:gap-6 font-[family-name:var(--font-mono)] text-[11px] tracking-wider">
            {[
              { label: "twitter", href: "https://twitter.com/" },
              { label: "email",   href: "mailto:dan@latency.work" },
              { label: "are.na",  href: "https://are.na/" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                data-interactive="true"
                className="text-[#111] opacity-40 hover:opacity-100 transition-opacity duration-150"
              >
                {label}
              </a>
            ))}
          </div>
        </motion.footer>
      </section>

      {/* ── SELECTED WORK — scrollable below fold ───────────────────── */}
      <section
        id="work"
        className="bg-[#FAFAFA] px-6 sm:px-10 pt-20 pb-28 flex justify-center"
      >
        <div className="w-full max-w-[720px]">
          <motion.p
            className="text-[10px] sm:text-[11px] font-[family-name:var(--font-mono)] opacity-30 tracking-[0.2em] mb-10 uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            // selected work
          </motion.p>

          <div className="border-t border-[#E5E5E5]">
            {PROJECTS.map((p, i) => (
              <ProjectRow key={p.title} {...p} index={i} />
            ))}
          </div>

          <motion.p
            className="mt-20 text-[10px] font-[family-name:var(--font-mono)] opacity-20 text-center tracking-[0.15em]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
          >
            LATENCY &copy; {new Date().getFullYear()}
          </motion.p>
        </div>
      </section>

      {/* Blink keyframe for logo dot */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </>
  );
}
