import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CaseStudyMeta {
  category: string;        // e.g. "Graphic Design"
  year: string;
  titleKo: string;         // Korean (or primary) title — large heading
  titleEn: string;         // English subtitle — muted, smaller
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  imageCaption: string;
}

interface Props {
  meta:     CaseStudyMeta;
  children: ReactNode;     // Section components from the calling page
}

// ── Layout ────────────────────────────────────────────────────────────────────

export function CaseStudyLayout({ meta, children }: Props) {
  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)" }}>

        {/* NAV */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-7 sm:pt-9">
          <Link
            href="/"
            data-interactive="true"
            className="cs-logo flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px] tracking-[0.18em] uppercase cursor-none"
          >
            LATENCY
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)", animation: "glowPulse 2s ease-in-out infinite" }}
            />
          </Link>
          <div className="flex items-center gap-5 sm:gap-7 font-[family-name:var(--font-mono)] text-[11px] sm:text-[12px] tracking-[0.12em] uppercase">
            {(["work", "about", "contact"] as const).map((label) => (
              <Link
                key={label}
                href={label === "work" ? "/work" : `/#${label}`}
                data-interactive="true"
                className="cs-nav-link cursor-none"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* CONTENT */}
        <div className="px-6 sm:px-10" style={{ maxWidth: 880 }}>

          {/* Back */}
          <div className="pt-8">
            <Link href="/work" data-interactive="true" className="cs-back inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.06em] cursor-none">
              ← Back to Work
            </Link>
          </div>

          {/* Header */}
          <header className="pt-10 pb-14">
            <p
              className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] uppercase mb-4"
              style={{ color: "var(--accent)" }}
            >
              {meta.category} · {meta.year}
            </p>
            <h1
              className="font-[family-name:var(--font-sans)] text-[30px] sm:text-[42px] leading-[1.1] tracking-tight mb-3"
              style={{ fontWeight: 500 }}
            >
              {meta.titleKo}
            </h1>
            <p
              className="font-[family-name:var(--font-mono)] text-[13px] tracking-[0.04em]"
              style={{ color: "var(--fg-muted)" }}
            >
              {meta.titleEn}
            </p>
          </header>

          {/* Main image */}
          <div className="mb-6" style={{ maxWidth: 600 }}>
            <Image
              src={meta.imageSrc}
              alt={meta.imageAlt}
              width={meta.imageWidth}
              height={meta.imageHeight}
              className="w-full h-auto"
              priority
            />
          </div>
          <p
            className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] mb-20"
            style={{ color: "var(--fg-muted)", opacity: 0.45 }}
          >
            {meta.imageCaption}
          </p>

          {/* Body — sections injected by each page */}
          <div className="pb-28 flex flex-col gap-14" style={{ maxWidth: 640 }}>
            {children}
          </div>

          {/* Footer */}
          <div className="pb-16" style={{ borderTop: "1px solid var(--border)", paddingTop: "2.5rem" }}>
            <Link href="/work" data-interactive="true" className="cs-back font-[family-name:var(--font-mono)] text-[12px] tracking-[0.06em] cursor-none">
              ← Back to Work
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 4px rgba(0,81,255,0.35); }
          50%       { opacity: 1;   box-shadow: 0 0 10px rgba(0,81,255,0.6); }
        }
        .cs-logo       { color: var(--fg); }
        .cs-nav-link   { color: var(--fg-muted); transition: color 150ms; }
        .cs-nav-link:hover { color: var(--fg); }
        .cs-back       { color: var(--fg-muted); transition: opacity 150ms; }
        .cs-back:hover { opacity: 0.8; }
      `}</style>
    </>
  );
}

// ── Section — shared across all case study pages ──────────────────────────────

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2
        className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em] uppercase mb-4"
        style={{ color: "var(--fg-muted)", opacity: 0.4 }}
      >
        {title}
      </h2>
      <div
        className="font-[family-name:var(--font-mono)] text-[14px] leading-[1.85]"
        style={{ color: "var(--fg-muted)" }}
      >
        {children}
      </div>
    </section>
  );
}

// ── BulletList — dashed list used in Design Decisions etc. ───────────────────

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span style={{ color: "var(--accent)", opacity: 0.7, flexShrink: 0 }}>—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── MetaTable — key/value rows used in Information Design etc. ────────────────

export function MetaTable({ rows }: { rows: [string, string][] }) {
  return (
    <div style={{ borderTop: "1px solid var(--border)" }}>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex items-baseline gap-6 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] uppercase shrink-0 w-24"
            style={{ color: "var(--fg-muted)", opacity: 0.4 }}
          >
            {label}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[13px]">{value}</span>
        </div>
      ))}
    </div>
  );
}
