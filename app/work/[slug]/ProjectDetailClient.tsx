"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Work } from "@/lib/db";
import { LiveClock } from "@/app/components/LiveClock";

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── SOCIAL LINKS — SWAP: update href values ──────────────────────────────────
const SOCIAL = [
  { label: "twitter", href: "https://twitter.com/" },
  { label: "email",   href: "mailto:dan@latency.work" },
  { label: "are.na",  href: "https://are.na/" },
] as const;

interface Props {
  work: Work;
  nextWork: Work;
}

// ── Scroll-reveal image ────────────────────────────────────────────────────────
function RevealImage({ src, alt, index }: { src: string; alt: string; index: number }) {
  return (
    <motion.div
      className="w-full overflow-hidden"
      style={{
        aspectRatio: index % 3 === 2 ? "3/4" : "16/9",
        background: "var(--bg-elevated)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <Image
        src={src}
        alt={alt}
        fill={false}
        width={1200}
        height={index % 3 === 2 ? 1600 : 800}
        className="w-full h-full object-cover"
        sizes="(max-width: 768px) 100vw, 70vw"
      />
    </motion.div>
  );
}

// ── Meta row ───────────────────────────────────────────────────────────────────
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col gap-0.5 py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span
        className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] uppercase"
        style={{ color: "var(--fg-muted)" }}
      >
        {label}
      </span>
      <span
        className="font-[family-name:var(--font-mono)] text-[13px]"
        style={{ color: "var(--fg)" }}
      >
        {value}
      </span>
    </div>
  );
}

export function ProjectDetailClient({ work, nextWork }: Props) {
  const [nextHovered, setNextHovered] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="min-h-[100dvh] flex flex-col"
        style={{ background: "var(--bg)" }}
      >
        {/* ── NAV ──────────────────────────────────────────────────── */}
        {/* relative z-10 creates a stacking context above the hero's position:relative layer */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-7 sm:pt-9 shrink-0 pointer-events-auto">
          <Link
            href="/"
            data-interactive="true"
            className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px] tracking-[0.18em] uppercase cursor-none"
            style={{ color: "var(--fg)" }}
          >
            LATENCY
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)", animation: "glowPulse 2s ease-in-out infinite" }}
            />
          </Link>
          <div className="flex items-center gap-5 sm:gap-7 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px] tracking-[0.12em] uppercase">
            {[
              { label: "work",    href: "/work" },
              { label: "about",   href: "/#about" },
              { label: "contact", href: "/#contact" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                data-interactive="true"
                className="cursor-none transition-opacity duration-150"
                style={{ color: "var(--fg-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* ── BACK LINK ────────────────────────────────────────────── */}
        <div className="relative z-10 px-6 sm:px-10 pt-8 pb-0">
          <Link
            href="/work"
            data-interactive="true"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[13px] transition-opacity duration-150"
            style={{ color: "var(--fg-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
          >
            <span>←</span>
            <span>all work</span>
          </Link>
        </div>

        {/* ── HERO IMAGE ───────────────────────────────────────────── */}
        <div
          className="relative w-full mt-8 overflow-hidden"
          style={{
            aspectRatio: "16 / 9",
            maxHeight: "80vh",
            background: work.accentColor || "var(--bg-elevated)",
          }}
        >
          {work.images[0] && (
            <Image
              src={work.images[0]}
              alt={work.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
            }}
          />
          {/* Title — bottom-left */}
          <div className="absolute bottom-0 left-0 px-8 sm:px-12 pb-10 sm:pb-14">
            <motion.h1
              className="font-[family-name:var(--font-sans)] leading-none tracking-tight"
              style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 700, color: "var(--fg)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            >
              {work.title}
            </motion.h1>
            <motion.p
              className="font-[family-name:var(--font-mono)] text-[13px] sm:text-[14px] mt-3 tracking-[0.08em]"
              style={{ color: "rgba(242,242,242,0.6)" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22, ease: EASE }}
            >
              {work.year} · {work.category} · {work.client ?? ""}
            </motion.p>
          </div>
        </div>

        {/* ── BODY — two-column on desktop ─────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 px-6 sm:px-10 pt-14 pb-0">
          {/* Left sticky column */}
          <motion.aside
            className="lg:w-[28%] xl:w-[26%] shrink-0"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          >
            <div className="lg:sticky lg:top-24">
              <MetaRow label="role"     value={work.role} />
              <MetaRow label="year"     value={work.year} />
              <MetaRow label="client"   value={work.client ?? ""} />
              <MetaRow label="category" value={work.category} />
            </div>
          </motion.aside>

          {/* Right scrolling column */}
          <motion.div
            className="flex-1 min-w-0 pb-24"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
          >
            <p
              className="font-[family-name:var(--font-mono)] text-[14px] sm:text-[15px] leading-[1.85] mb-16 max-w-[640px]"
              style={{ color: "var(--fg)" }}
            >
              {work.description}
            </p>

            {/* Images (skip the hero) */}
            <div className="flex flex-col" style={{ gap: 80 }}>
              {work.images.slice(1).map((src, i) => (
                <RevealImage
                  key={src}
                  src={src}
                  alt={`${work.title} — image ${i + 2}`}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── NEXT PROJECT ─────────────────────────────────────────── */}
        <div
          className="px-6 sm:px-10 pt-20 pb-14 mt-16"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--fg-muted)", opacity: 0.4 }}
          >
            next project
          </p>
          <Link
            href={`/work/${nextWork.id}`}
            data-interactive="true"
            className="inline-flex items-center gap-4 group"
            onMouseEnter={() => setNextHovered(true)}
            onMouseLeave={() => setNextHovered(false)}
          >
            <motion.span
              className="font-[family-name:var(--font-mono)] text-[18px] sm:text-[22px] tracking-tight"
              style={{ color: "var(--fg)" }}
              animate={{ x: nextHovered ? 4 : 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              {nextWork.title}
            </motion.span>
            <motion.span
              className="font-[family-name:var(--font-mono)] text-[18px] sm:text-[22px]"
              style={{ color: "var(--accent)" }}
              animate={{ x: nextHovered ? 6 : 0, opacity: nextHovered ? 1 : 0.3 }}
              transition={{ duration: 0.2, ease: EASE }}
            >
              →
            </motion.span>
          </Link>
          <p
            className="font-[family-name:var(--font-mono)] text-[11px] mt-2"
            style={{ color: "var(--fg-muted)", opacity: 0.35 }}
          >
            {nextWork.year} · {nextWork.category}
          </p>
        </div>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
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
      </motion.div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 4px rgba(0,81,255,0.35); }
          50%       { opacity: 1;   box-shadow: 0 0 10px rgba(0,81,255,0.6); }
        }
      `}</style>
    </>
  );
}
