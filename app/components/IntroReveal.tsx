"use client";

// Progressive reveal for the root entry screen.
// Identical interaction to AboutReveal but with an onComplete callback
// that fires ~1600ms after the '경험' keyword is clicked,
// triggering the transition to the work grid.

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type KId =
  | "daun" | "latency" | "moment" | "timing"
  | "uiux" | "graphic" | "advertising" | "xr" | "experience";

type Part =
  | { type: "text"; v: string }
  | { type: "kw"; id: KId; label: string };

type Block = { idx: number; lines: Part[][] };

const BLOCKS: Block[] = [
  {
    idx: 0,
    lines: [[
      { type: "text", v: "안녕하세요, 디자이너 " },
      { type: "kw", id: "daun", label: "다은" },
      { type: "text", v: "입니다." },
    ]],
  },
  {
    idx: 1,
    lines: [
      [{ type: "text", v: "저는 행동과 반응 사이의 시간을 디자인합니다." }],
      [{ type: "text", v: "단순히 어떻게 보이는지가 아니라, 언제 일어나는지에 집중합니다." }],
    ],
  },
  {
    idx: 2,
    lines: [
      [
        { type: "text", v: "저는 '" },
        { type: "kw", id: "latency", label: "LATENCY" },
        { type: "text", v: "'라는 관점으로 작업합니다." },
      ],
      [{ type: "text", v: "대부분의 디자이너가 화면을 바라본다면," }],
      [
        { type: "text", v: "저는 그 사이에 존재하는 " },
        { type: "kw", id: "moment", label: "순간" },
        { type: "text", v: "을 설계합니다." },
      ],
    ],
  },
  {
    idx: 3,
    lines: [[
      { type: "text", v: "빠른 것이 목표가 아니라, 정확한 " },
      { type: "kw", id: "timing", label: "타이밍" },
      { type: "text", v: "이 중요하다고 생각합니다." },
    ]],
  },
  {
    idx: 4,
    lines: [
      [{ type: "kw", id: "uiux", label: "UI/UX" }, { type: "text", v: "에서는 정보가 사용자에게 도달하는 순간을 설계하고," }],
      [{ type: "kw", id: "graphic", label: "GRAPHIC" }, { type: "text", v: " 디자인에서는 시각적 리듬과 여백을 통해 시선을 조율합니다." }],
      [{ type: "kw", id: "advertising", label: "ADVERTISING" }, { type: "text", v: "에서는 메시지가 전달되는 타이밍에 따라 전혀 다른 결과가 만들어지며," }],
      [{ type: "kw", id: "xr", label: "XR" }, { type: "text", v: "에서는 반응이 느껴지는 그 순간을 설계합니다." }],
    ],
  },
  {
    idx: 5,
    lines: [[
      { type: "text", v: "저는 " },
      { type: "kw", id: "experience", label: "경험" },
      { type: "text", v: "이 완성되는 순간을 설계합니다." },
    ]],
  },
];

const KW_BLOCK: Record<KId, number> = {
  daun: 0, latency: 2, moment: 2, timing: 3,
  uiux: 4, graphic: 4, advertising: 4, xr: 4, experience: 5,
};

const STAGGER_ORDER: KId[] = [
  "daun", "latency", "moment", "timing",
  "uiux", "graphic", "advertising", "xr", "experience",
];

type PosEffect = { id: string; kind: "dot" | "ripple"; x: number; y: number };

// ─────────────────────────────────────────────────────────────────────────────

export function IntroReveal({ onComplete }: { onComplete?: () => void }) {
  const [revealed,   setRevealed]   = useState<Set<number>>(new Set());
  const [clicked,    setClicked]    = useState<Set<KId>>(new Set());
  const [effects,    setEffects]    = useState<Record<string, boolean>>({});
  const [posEffects, setPosEffects] = useState<PosEffect[]>([]);
  const [pageFlash,  setPageFlash]  = useState(false);
  const [allDone,    setAllDone]    = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (clicked.size === STAGGER_ORDER.length) {
      setTimeout(() => setAllDone(true), 1200);
    }
  }, [clicked.size]);

  const triggerEffect = useCallback((id: KId) => {
    if (reducedMotion.current) return;
    setEffects(p => ({ ...p, [id]: true }));
    setTimeout(() => setEffects(p => ({ ...p, [id]: false })), 900);
  }, []);

  const addPosEffect = useCallback((kind: "dot" | "ripple", x: number, y: number) => {
    if (reducedMotion.current) return;
    const eid = String(Date.now());
    setPosEffects(p => [...p, { id: eid, kind, x, y }]);
    setTimeout(() => setPosEffects(p => p.filter(e => e.id !== eid)), 600);
  }, []);

  const handleKeyword = useCallback((id: KId, e: React.MouseEvent) => {
    if (clicked.has(id)) return;
    setClicked(p => new Set(p).add(id));
    triggerEffect(id);

    const cx = e.clientX, cy = e.clientY;
    if (id === "moment") addPosEffect("dot",    cx, cy);
    if (id === "uiux")   addPosEffect("ripple", cx, cy);

    const delay = reducedMotion.current ? 0 : 350;
    setTimeout(() => {
      setRevealed(p => {
        const n = new Set(p);
        n.add(KW_BLOCK[id]);
        if (id === "experience") [0, 1, 2, 3, 4, 5].forEach(i => n.add(i));
        return n;
      });

      if (id === "experience") {
        if (!reducedMotion.current) {
          setPageFlash(true);
          setTimeout(() => setPageFlash(false), 700);
        }
        // Transition to work grid after full reveal sequence
        setTimeout(() => onComplete?.(), 1600 - delay);
      }
    }, delay);
  }, [clicked, triggerEffect, addPosEffect, onComplete]);

  return (
    <>
      <AnimatePresence>
        {pageFlash && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[9998]"
            style={{ background: "#fff" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {posEffects.map(e => (
        <div key={e.id} className={`pos-effect pos-effect--${e.kind}`} style={{ left: e.x, top: e.y }} />
      ))}

      {/* Text body — padded to clear fixed nav (header ~72px) + breathing room */}
      <div
        className="px-6 sm:px-10 mx-auto w-full"
        style={{ maxWidth: 720, paddingTop: "clamp(96px, 14vh, 160px)", paddingBottom: "clamp(80px, 10vh, 120px)" }}
      >
        <div className="flex flex-col" style={{ gap: "1.4em" }}>
          {BLOCKS.map(block => {
            const isRevealed = revealed.has(block.idx);
            return (
              <div key={block.idx} style={{ lineHeight: 0 }}>
                {block.lines.map((line, li) => (
                  <p
                    key={li}
                    style={{
                      fontSize: "clamp(18px, 2.2vw, 24px)",
                      lineHeight: 1.7,
                      letterSpacing: "-0.01em",
                      marginBottom: li < block.lines.length - 1 ? "0.1em" : 0,
                    }}
                  >
                    {line.map((part, pi) => {
                      if (part.type === "text") {
                        return (
                          <span key={pi} style={{
                            filter:     isRevealed ? "blur(0px)" : "blur(6px)",
                            color:      isRevealed ? "var(--fg)" : "rgba(255,255,255,0.35)",
                            transition: reducedMotion.current ? "none" : "filter 600ms ease-out, color 600ms ease-out",
                          }}>
                            {part.v}
                          </span>
                        );
                      }
                      const kw = part;
                      return (
                        <Capsule
                          key={pi}
                          id={kw.id} label={kw.label}
                          isClicked={clicked.has(kw.id)}
                          isAnimating={!!effects[kw.id]}
                          staggerIdx={STAGGER_ORDER.indexOf(kw.id)}
                          allDone={allDone}
                          onClick={(e) => handleKeyword(kw.id, e)}
                        />
                      );
                    })}
                  </p>
                ))}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-[11px] tabular-nums tracking-[0.06em]" style={{ color: "var(--fg-muted)", opacity: 0.3 }}>
          {clicked.size} / {STAGGER_ORDER.length} 공개됨
        </div>
      </div>

      <style>{`
        @keyframes capEnter { from { opacity:0; transform:translateY(-3px); } to { opacity:1; transform:translateY(0); } }
        @keyframes capStretch { 0%{transform:scaleX(1);} 50%{transform:scaleX(1.13);} 100%{transform:scaleX(1);} }
        @keyframes letterIn { from{opacity:0.2;transform:translateY(-3px);} to{opacity:1;transform:translateY(0);} }
        @keyframes metro { 0%{transform:translateX(0);} 25%{transform:translateX(-7px);} 75%{transform:translateX(7px);} 100%{transform:translateX(0);} }
        @keyframes gridIn { 0%{opacity:0;} 30%{opacity:1;} 70%{opacity:1;} 100%{opacity:0;} }
        @keyframes redSweepIn { 0%{transform:scaleX(0);transform-origin:left center;} 50%{transform:scaleX(1);transform-origin:left center;} 50.1%{transform:scaleX(1);transform-origin:right center;} 100%{transform:scaleX(0);transform-origin:right center;} }
        @keyframes xrTilt { 0%{transform:perspective(200px) rotateY(0deg);} 40%{transform:perspective(200px) rotateY(15deg);} 100%{transform:perspective(200px) rotateY(0deg);} }
        @keyframes dotFlash { 0%{width:4px;height:4px;opacity:1;} 100%{width:28px;height:28px;opacity:0;} }
        @keyframes rippleExp { 0%{width:0;height:0;opacity:0.35;} 100%{width:90px;height:90px;opacity:0;} }

        .eff-daun { animation: capStretch 600ms ease-in-out; }
        .eff-latency .lat-letter { animation: letterIn 150ms ease-out both; animation-delay: calc(var(--i) * 80ms); }
        .metro-dot { animation: metro 600ms ease-in-out; }
        .grid-cell { animation: gridIn 500ms ease-in-out both; }
        .advert-bar { position:absolute; inset:0; border-radius:inherit; background:#ff4d3d; pointer-events:none; animation: redSweepIn 500ms ease-in-out; }
        .eff-xr { animation: xrTilt 500ms ease-in-out; }
        .pos-effect { position:fixed; pointer-events:none; z-index:9990; transform:translate(-50%,-50%); }
        .pos-effect--dot { background:white; border-radius:50%; animation: dotFlash 250ms ease-out forwards; }
        .pos-effect--ripple { border:1px solid rgba(255,255,255,0.6); border-radius:50%; animation: rippleExp 500ms ease-out forwards; }
      `}</style>
    </>
  );
}

function Capsule({ id, label, isClicked, isAnimating, staggerIdx, allDone, onClick }: {
  id: KId; label: string; isClicked: boolean; isAnimating: boolean;
  staggerIdx: number; allDone: boolean; onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      data-interactive="true"
      disabled={isClicked}
      className={`kw-cap ${isAnimating ? `eff-${id}` : ""}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: id === "timing" ? 5 : 0,
        position: "relative",
        border: `1px solid ${allDone && id !== "latency" ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.6)"}`,
        borderRadius: "100px", padding: "2px 11px",
        background: "transparent", color: "var(--fg)",
        cursor: isClicked ? "default" : "pointer",
        fontSize: "inherit", lineHeight: 1, verticalAlign: "middle",
        margin: "0 2px",
        transition: "border-color 1s ease, background 150ms",
        animation: `capEnter 400ms ease-out ${staggerIdx * 100}ms both`,
        overflow: "hidden",
      }}
      onMouseEnter={(e) => { if (!isClicked) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {id === "latency" ? (
        <span className={isAnimating ? "eff-latency" : ""} style={{ letterSpacing: "0.04em" }}>
          {"LATENCY".split("").map((ch, i) => (
            <span key={i} className="lat-letter" style={{ "--i": i } as React.CSSProperties}>{ch}</span>
          ))}
        </span>
      ) : id === "timing" ? (
        <>
          {label}
          {isAnimating && <>
            <span className="metro-dot" style={{ width:4, height:4, borderRadius:"50%", background:"white", display:"inline-block" }} />
            <span className="metro-dot" style={{ width:4, height:4, borderRadius:"50%", background:"white", display:"inline-block", animationDelay:"80ms" }} />
          </>}
        </>
      ) : id === "graphic" ? (
        <>
          {label}
          {isAnimating && (
            <span aria-hidden style={{ position:"absolute", inset:0, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gridTemplateRows:"repeat(3,1fr)", padding:4, gap:1, pointerEvents:"none" }}>
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} className="grid-cell" style={{ background:"rgba(255,255,255,0.25)", borderRadius:1, animationDelay:`${i*20}ms` }} />
              ))}
            </span>
          )}
        </>
      ) : id === "advertising" ? (
        <>{label}{isAnimating && <span className="advert-bar" aria-hidden />}</>
      ) : label}
    </button>
  );
}
