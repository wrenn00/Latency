"use client";

// ─── RAF-based custom cursor ──────────────────────────────────────────────────
// Position + size state lives in refs — never React state — so mousemove
// never triggers a re-render. The RAF loop lerps toward target values and
// writes directly to the DOM element's style.
//
// Appearance: outlined circle (no fill). On hover of [data-interactive],
// fills with --accent and scales to SIZE_HOVERED. CSS transition handles
// the color change smoothly (200ms enter, 200ms exit) while RAF handles
// the position/size lerp.

import { useEffect, useRef } from "react";

const LERP_POS  = 0.18;
const LERP_SIZE = 0.22;
const SIZE_DEFAULT = 16;
const SIZE_HOVERED = 24;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target  = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let targetSize  = SIZE_DEFAULT;
    let currentSize = SIZE_DEFAULT;
    let rafId: number;

    // ── RAF tick ──────────────────────────────────────────────────────────
    const tick = () => {
      current.x += (target.x - current.x) * LERP_POS;
      current.y += (target.y - current.y) * LERP_POS;
      currentSize += (targetSize - currentSize) * LERP_SIZE;

      const el = dotRef.current;
      if (el) {
        const s = currentSize;
        el.style.transform = `translate3d(${current.x - s * 0.5}px, ${current.y - s * 0.5}px, 0)`;
        el.style.width  = `${s}px`;
        el.style.height = `${s}px`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // ── Mouse position ────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ── Hover detection (capture phase = no child-crossing flicker) ───────
    const onEnter = (e: MouseEvent) => {
      if ((e.target as Element)?.closest("[data-interactive]")) {
        targetSize = SIZE_HOVERED;
        const el = dotRef.current;
        if (el) {
          el.style.background   = "var(--accent)";
          el.style.borderColor  = "var(--accent)";
        }
      }
    };
    const onLeave = (e: MouseEvent) => {
      const related = (e as MouseEvent & { relatedTarget: EventTarget | null }).relatedTarget;
      if (!(related instanceof Element) || !related.closest("[data-interactive]")) {
        targetSize = SIZE_DEFAULT;
        const el = dotRef.current;
        if (el) {
          el.style.background  = "transparent";
          el.style.borderColor = "var(--fg)";
        }
      }
    };
    document.addEventListener("mouseenter", onEnter, true);
    document.addEventListener("mouseleave", onLeave, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter, true);
      document.removeEventListener("mouseleave", onLeave, true);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
      style={{
        width:  SIZE_DEFAULT,
        height: SIZE_DEFAULT,
        background:  "transparent",
        border:      "1.5px solid var(--fg)",
        borderColor: "var(--fg)",
        transition:  "background 200ms ease, border-color 200ms ease",
      }}
    />
  );
}
