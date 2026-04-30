import Link from "next/link";
import { AboutReveal } from "@/app/components/AboutReveal";

export const metadata = {
  title: "About — LATENCY",
  description: "행동과 반응 사이의 시간을 디자인합니다.",
};

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)" }}>

        {/* NAV */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 pt-7 sm:pt-9">
          <Link
            href="/"
            data-interactive="true"
            className="flex items-center gap-1.5 text-[11px] sm:text-[12px] tracking-[0.04em] uppercase cursor-none"
            style={{ color: "var(--fg)" }}
          >
            LATENCY
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)", animation: "glowPulse 2s ease-in-out infinite" }}
            />
          </Link>
          <div className="flex items-center gap-5 sm:gap-7 text-[11px] sm:text-[12px] tracking-[0.04em] uppercase">
            {[
              { label: "work",    href: "/work" },
              { label: "about",   href: "/about" },
              { label: "contact", href: "/#contact" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                data-interactive="true"
                className="about-nav cursor-none"
                style={{ color: label === "about" ? "var(--fg)" : "var(--fg-muted)" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Progressive reveal body */}
        <AboutReveal />

        {/* Contact */}
        <section
          className="flex flex-col items-center text-center px-6 py-24 md:py-36"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p
            className="text-[12px] tracking-[0.08em] uppercase mb-6"
            style={{ color: "var(--fg-muted)" }}
          >
            For collaborations and inquiries
          </p>
          <a
            href="mailto:hello@latency.kr"
            data-interactive="true"
            className="about-mail cursor-none text-[22px] sm:text-[28px] tracking-tight"
            style={{ color: "var(--fg)", fontWeight: 500 }}
          >
            hello@latency.kr
          </a>
        </section>

        {/* Footer */}
        <footer
          className="px-6 sm:px-10 py-8 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[11px] tracking-[0.06em]" style={{ color: "var(--fg-muted)", opacity: 0.4 }}>
            © 2025 LATENCY
          </span>
          <Link
            href="/work"
            data-interactive="true"
            className="about-nav cursor-none text-[11px] tracking-[0.04em]"
            style={{ color: "var(--fg-muted)", opacity: 0.4 }}
          >
            Work →
          </Link>
        </footer>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        .about-nav { transition: color 150ms, opacity 150ms; }
        .about-nav:hover { color: var(--fg) !important; opacity: 1 !important; }
        .about-mail { transition: opacity 150ms; }
        .about-mail:hover { opacity: 0.7; }
      `}</style>
    </>
  );
}
