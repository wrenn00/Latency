"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LiveClock } from "./components/LiveClock";

const EASE = [0.22, 1, 0.36, 1] as const;

const PARAGRAPHS = [
  "안녕하세요, 디자이너 다은입니다.",
  "저는 행동과 반응 사이의 시간을 디자인합니다.\n단순히 어떻게 보이는지가 아니라, 언제 일어나는지에 집중합니다.",
  "저는 'LATENCY'라는 관점으로 작업합니다.\n대부분의 디자이너가 화면을 바라본다면, 저는 그 사이에 존재하는 순간을 설계합니다.\n빠른 것이 목표가 아니라, 정확한 타이밍이 중요하다고 생각합니다.",
  "UI/UX에서는 정보가 사용자에게 도달하는 '순간'을 설계하고,\n그래픽 디자인에서는 시각적 리듬과 여백을 통해 시선을 조율합니다.\n광고에서는 메시지가 전달되는 타이밍에 따라 전혀 다른 결과가 만들어지며,\nXR에서는 반응이 느껴지는 그 순간을 설계합니다.",
  "저는 경험이 완성되는 순간을 설계합니다.",
];

function HeroParagraph() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div
        className="flex flex-col"
        style={{ gap: "1.6em" }}
      >
        {PARAGRAPHS.map((text, i) => (
          <p
            key={i}
            className="text-[17px] sm:text-[19px] leading-[1.78]"
            style={{
              color:         i === PARAGRAPHS.length - 1 ? "var(--fg)" : "var(--fg-muted)",
              letterSpacing: "-0.01em",
              whiteSpace:    "pre-line",
            }}
          >
            {text}
          </p>
        ))}
      </div>

      <p
        className="mt-10 text-[11px] tracking-[0.06em]"
        style={{ color: "var(--fg-muted)", opacity: 0.45, animation: "gentlePulse 3s ease-in-out infinite" }}
      >
        스크롤하여 둘러보기
      </p>
    </motion.div>
  );
}

export default function Page() {
  return (
    <>
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
          <div
            className="flex items-center gap-1.5 text-[11px] sm:text-[12px] tracking-[0.04em] uppercase"
            style={{ color: "var(--fg)" }}
          >
            LATENCY
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)", animation: "glowPulse 2s ease-in-out infinite" }}
            />
          </div>

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
                className="cursor-none transition-all duration-150 focus:outline-none"
                style={{ color: "var(--fg-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.nav>

        {/* Hero copy */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 overflow-hidden">
          <div className="w-full max-w-[760px]">
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
          <div className="flex items-center gap-5 sm:gap-6 text-[10px] tracking-[0.06em] uppercase">
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
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--fg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = "var(--fg-muted)"; }}
              >
                {label}
              </a>
            ))}
          </div>
        </motion.footer>
      </section>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 0.25; }
        }
      `}</style>
    </>
  );
}
