import Link from "next/link";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MetaRow {
  label: string;  // e.g. "ROLE", "CLIENT", "YEAR", "AWARD"
  value: string;
}

export interface CaseStudyProps {
  categoryLabel: string;   // e.g. "GRAPHIC DESIGN"
  year:          string;
  title:         string;
  subtitle?:     string;
  image?:        { src: string; alt: string; width: number; height: number };
  youtubeId?:    string;   // for video works — renders iframe instead of image
  description:   string;   // single prose paragraph
  meta:          MetaRow[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CaseStudy({
  categoryLabel,
  year,
  title,
  subtitle,
  image,
  youtubeId,
  description,
  meta,
}: CaseStudyProps) {
  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)" }}>

        {/* NAV */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-7 sm:pt-9">
          <Link
            href="/"
            data-interactive="true"
            className="cs-logo flex items-center gap-1.5 text-[11px] sm:text-[12px] tracking-[0.04em] uppercase cursor-none"
          >
            LATENCY
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)", animation: "glowPulse 2s ease-in-out infinite" }}
            />
          </Link>
          <div className="flex items-center gap-5 sm:gap-7 text-[11px] sm:text-[12px] tracking-[0.04em] uppercase">
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
        <div className="px-6 sm:px-10" style={{ maxWidth: 840 }}>

          {/* Back */}
          <div className="pt-8">
            <Link href="/work" data-interactive="true" className="cs-back inline-flex items-center gap-2 text-[12px] cursor-none">
              ← Back to Work
            </Link>
          </div>

          {/* Header */}
          <header className="pt-10 pb-12">
            <p
              className="text-[11px] tracking-[0.06em] uppercase mb-4"
              style={{ color: "var(--accent)" }}
            >
              {categoryLabel} · {year}
            </p>
            <h1
              className="text-[28px] sm:text-[38px] leading-[1.15] tracking-tight mb-2"
              style={{ fontWeight: 600 }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "var(--fg-muted)" }}
              >
                {subtitle}
              </p>
            )}
          </header>

          {/* Media — image or YouTube embed */}
          {youtubeId ? (
            <div className="mb-8" style={{ maxWidth: 800 }}>
              <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                />
              </div>
              <p className="mt-3 text-[11px]" style={{ color: "var(--fg-muted)", opacity: 0.45 }}>
                <a
                  href={`https://youtu.be/${youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-interactive="true"
                  className="cs-back cursor-none"
                >
                  Watch on YouTube ↗
                </a>
              </p>
            </div>
          ) : image ? (
            <div className="mb-8" style={{ maxWidth: 600 }}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="w-full h-auto"
                sizes="(max-width: 640px) 100vw, 600px"
                priority
              />
            </div>
          ) : null}

          {/* Description */}
          <p
            className="text-[15px] leading-[1.75] mb-12"
            style={{ maxWidth: 680, color: "var(--fg-muted)" }}
          >
            {description}
          </p>

          {/* Meta rows */}
          <div
            className="flex flex-col gap-0 mb-24"
            style={{ maxWidth: 680, borderTop: "1px solid var(--border)" }}
          >
            {meta.map(({ label, value }) => (
              <div
                key={label}
                className="flex gap-6 py-3 text-[13px]"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <span
                  className="w-16 shrink-0 text-[10px] tracking-[0.08em] uppercase"
                  style={{ color: "var(--fg-muted)", opacity: 0.45, paddingTop: 2 }}
                >
                  {label}
                </span>
                <span style={{ color: "var(--fg)" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pb-16" style={{ borderTop: "1px solid var(--border)", paddingTop: "2.5rem" }}>
            <Link href="/work" data-interactive="true" className="cs-back text-[12px] cursor-none">
              ← Back to Work
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
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
