/*
 * ─────────────────────────────────────────────────────────────────
 *  LATENCY — DAN  |  Personal Portfolio
 * ─────────────────────────────────────────────────────────────────
 *  SWAP GUIDE:
 *    Avatar image  → replace the <span>DAN</span> in DanWord
 *                    (components/InlineInteraction.tsx) with a real image
 *
 *    Social links  → search "SWAP: links" below and update href values
 *
 *    Clock city    → open components/LiveClock.tsx and replace
 *                    "SEL" with your city code (e.g. "NYC", "TYO", "LON")
 * ─────────────────────────────────────────────────────────────────
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DanWord, BetweenWord, TimingWord, LatencyWord, HatsWord,
  UiUxWord, LateWord, GraphicDesignWord, AdvertisingWord,
  ThingsWord, XrDesignWord, DiscomfortWord,
} from "./components/InlineInteraction";
import { LiveClock } from "./components/LiveClock";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── HERO PARAGRAPH ───────────────────────────────────────────────────────────
function HeroParagraph() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="text-[14px] sm:text-[15px] leading-[1.85] font-[family-name:var(--font-mono)]"
      style={{ color: "var(--fg)" }}
      initial={{ opacity: 0, y: 6 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <p className="mb-5">
        {"Yo! I\u2019m\u00A0"}
        <span data-interactive="true"><DanWord /></span>
        {". I design the time\u00A0"}
        <span data-interactive="true"><BetweenWord /></span>
        {"\u00A0action and response. My background is in interaction design, but what I really obsess over is\u00A0"}
        <span data-interactive="true"><TimingWord /></span>
        {"\u00A0\u2014 not just how things look, but when they happen."}
      </p>

      <p className="mb-5">
        {"I work under the name\u00A0"}
        <span data-interactive="true"><LatencyWord /></span>
        {". Most designers look at screens. I look at what\u2019s\u00A0"}
        <span data-interactive="true"><BetweenWord /></span>
        {"\u00A0them. Fast isn\u2019t the goal. The right timing is."}
      </p>

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

      {/* "Scroll or drag" hint — gently pulses */}
      <p
        className="mt-8 text-[11px] tracking-[0.12em]"
        style={{ color: "var(--fg-muted)", animation: "gentlePulse 3s ease-in-out infinite" }}
      >
        scroll or drag to explore
      </p>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* ── HERO — full viewport ──────────────────────────────────────── */}
      <section
        className="relative h-[100dvh] flex flex-col overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* Navigation */}
        <motion.nav
          className="flex items-center justify-between px-6 sm:px-10 pt-7 sm:pt-9 shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {/* Logo */}
          <div
            className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px] tracking-[0.18em] uppercase"
            style={{ color: "var(--fg)" }}
          >
            LATENCY
            {/* Dot: accent glow pulse instead of step blink */}
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--accent)",
                animation: "glowPulse 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Nav links — SWAP: update href values */}
          <div className="flex items-center gap-5 sm:gap-7 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px] tracking-[0.12em] uppercase">
            {(["work", "about", "contact"] as const).map((item) => (
              <a
                key={item}
                href={`#${item}`}
                data-interactive="true"
                className="transition-opacity duration-150"
                style={{ color: "var(--fg-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
              >
                {item}
              </a>
            ))}
          </div>
        </motion.nav>

        {/* Hero copy — centered in remaining space */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 overflow-hidden">
          <div className="w-full max-w-[720px]">
            <HeroParagraph />
          </div>
        </div>

        {/* Footer strip */}
        <motion.footer
          className="shrink-0 flex items-center justify-between px-6 sm:px-10 pb-6 sm:pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.25, ease: EASE }}
        >
          <LiveClock />

          {/* SWAP: links — update href values */}
          <div className="flex items-center gap-5 sm:gap-6 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] uppercase">
            {[
              { label: "twitter", href: "https://twitter.com/" },
              { label: "email",   href: "mailto:dan@latency.work" },
              { label: "are.na",  href: "https://are.na/" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                data-interactive="true"
                className="transition-all duration-150"
                style={{ color: "var(--fg-muted)", opacity: 0.5 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.color = "var(--fg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.5";
                  e.currentTarget.style.color = "var(--fg-muted)";
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </motion.footer>
      </section>

      {/* ── WORK LINK ─────────────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center py-16"
        style={{ background: "var(--bg)" }}
      >
        <motion.a
          href="/work"
          data-interactive="true"
          className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] uppercase cursor-none"
          style={{ color: "var(--fg-muted)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: EASE }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
        >
          → selected work
        </motion.a>
      </div>
    </>
  );
}
