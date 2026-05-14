import Link from "next/link";
import { Logo } from "@/app/components/Logo";
import { PastelMetaballGraphic } from "@/components/about/PastelMetaballGraphic";

export const metadata = {
  title: "About — LATENCY",
  description: "행동과 반응 사이의 시간을 디자인합니다.",
};

const PASTEL_LINE = "rgba(184,212,241,0.15)";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col md:flex-row gap-6 md:gap-16 py-12 md:py-16"
      style={{ borderTop: `1px solid ${PASTEL_LINE}` }}
    >
      <div className="md:w-40 shrink-0 flex items-start gap-2">
        <span
          style={{
            display: "inline-block",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#B8D4F1",
            marginTop: 3,
            flexShrink: 0,
          }}
        />
        <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color: "var(--fg-muted)" }}>
          {label}
        </span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--fg)" }}>

        {/* NAV */}
        <nav className="flex items-center justify-between px-6 sm:px-10 pt-7 sm:pt-9">
          <Logo size="md" href="/" />
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

        {/* HERO — pastel graphic */}
        <div className="flex flex-col items-center py-24 md:py-32 px-6">
          <PastelMetaballGraphic />
          <p
            className="mt-8 text-center"
            style={{
              color: "#B8D4F1",
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "0.01em",
            }}
          >
            행동과 반응 사이의 시간을 디자인합니다.
          </p>
        </div>

        {/* CONTENT */}
        <div className="px-6 sm:px-10 md:px-16 pb-24" style={{ maxWidth: 1100, margin: "0 auto" }}>

          <Row label="Intro">
            <div className="flex flex-col gap-4 text-[16px] sm:text-[18px] leading-[1.72]" style={{ color: "var(--fg-muted)" }}>
              <p style={{ color: "var(--fg)", fontWeight: 500 }}>안녕하세요, 디자이너 다은입니다.</p>
              <p>
                저는 행동과 반응 사이의 시간을 디자인합니다.<br />
                단순히 어떻게 보이는지가 아니라, 언제 일어나는지에 집중합니다.
              </p>
            </div>
          </Row>

          <Row label="Perspective">
            <p className="text-[16px] sm:text-[18px] leading-[1.72]" style={{ color: "var(--fg-muted)" }}>
              저는 'LATENCY'라는 관점으로 작업합니다.<br />
              대부분의 디자이너가 화면을 바라본다면,<br />
              저는 그 사이에 존재하는 순간을 설계합니다.<br />
              빠른 것이 목표가 아니라, 정확한 타이밍이 중요하다고 생각합니다.
            </p>
          </Row>

          <Row label="Practice">
            <div className="flex flex-col gap-5">
              {[
                { title: "UI/UX",        desc: "정보가 사용자에게 도달하는 순간을 설계합니다." },
                { title: "GRAPHIC",      desc: "시각적 리듬과 여백을 통해 시선을 조율합니다." },
                { title: "ADVERTISING",  desc: "메시지가 전달되는 타이밍에 따라 전혀 다른 결과가 만들어집니다." },
                { title: "XR",           desc: "반응이 느껴지는 그 순간을 설계합니다." },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-6 text-[16px] sm:text-[17px] leading-[1.65]">
                  <span className="shrink-0 w-32 text-[13px] font-medium" style={{ color: "var(--fg)" }}>
                    {title}
                  </span>
                  <span style={{ color: "var(--fg-muted)" }}>{desc}</span>
                </div>
              ))}
            </div>
          </Row>

          <div className="py-16 md:py-20" style={{ borderTop: `1px solid ${PASTEL_LINE}` }}>
            <p
              className="text-[28px] sm:text-[40px] leading-[1.2] tracking-tight"
              style={{ fontWeight: 600 }}
            >
              저는 경험이 완성되는 순간을 설계합니다.
            </p>
          </div>

        </div>

        {/* CONTACT */}
        <section
          className="flex flex-col items-center text-center px-6 py-20 md:py-32"
          style={{ borderTop: `1px solid ${PASTEL_LINE}` }}
        >
          <p className="text-[12px] tracking-[0.08em] uppercase mb-5" style={{ color: "var(--fg-muted)" }}>
            For collaborations and inquiries
          </p>
          <a
            href="mailto:hello@latency.kr"
            data-interactive="true"
            className="about-mail cursor-none text-[20px] sm:text-[26px] tracking-tight"
            style={{ color: "var(--fg)", fontWeight: 500 }}
          >
            hello@latency.kr
          </a>
        </section>

        {/* FOOTER */}
        <footer
          className="px-6 sm:px-10 py-7 flex items-center justify-between"
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
        .about-nav { transition: color 150ms, opacity 150ms; }
        .about-nav:hover { color: var(--fg) !important; opacity: 1 !important; }
        .about-mail { transition: opacity 150ms; }
        .about-mail:hover { opacity: 0.7; }
      `}</style>
    </>
  );
}
