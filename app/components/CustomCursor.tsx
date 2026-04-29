"use client";

// RAF-based custom cursor — zero React state on mousemove.
//
// Position is lerped toward the real cursor each frame.
// LERP_POS controls responsiveness: 1.0 = instant snap, lower = more smoothing.
// RAF loop auto-pauses when fully settled to save CPU, resumes on next move.

import { useEffect, useRef } from "react";

const LERP_POS    = 0.55;   // higher = snappier (was 0.18 — too laggy)
const LERP_SIZE   = 0.28;
const SIZE_DEFAULT = 16;
const SIZE_HOVERED = 24;
const SETTLE_EPS  = 0.08;   // stop RAF when delta is below this (px / size units)

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target  = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let targetSize  = SIZE_DEFAULT;
    let currentSize = SIZE_DEFAULT;
    let rafId: number | null = null;

    function tick() {
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const ds = targetSize - currentSize;

      current.x   += dx * LERP_POS;
      current.y   += dy * LERP_POS;
      currentSize += ds * LERP_SIZE;

      const el = dotRef.current;
      if (el) {
        const s = currentSize;
        el.style.transform = `translate3d(${current.x - s * 0.5}px, ${current.y - s * 0.5}px, 0)`;
        el.style.width     = `${s}px`;
        el.style.height    = `${s}px`;
      }

      // Keep looping until fully settled, then stop to save CPU
      const settled =
        Math.abs(dx) < SETTLE_EPS &&
        Math.abs(dy) < SETTLE_EPS &&
        Math.abs(ds) < SETTLE_EPS;

      if (!settled) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }

    function scheduleRaf() {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    }

    // Dev-only frame-gap monitor — logs warning when frames drop below 60fps
    // Remove this block once performance is confirmed stable
    let lastMoveTime = 0;
    let slowFrames = 0;
    let slowWindow = performance.now();
    const DEV = process.env.NODE_ENV !== "production";

    // Raw mousemove — only stores coords, triggers RAF if not running
    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      scheduleRaf();

      if (DEV) {
        const now = performance.now();
        const gap = now - lastMoveTime;
        if (lastMoveTime > 0 && gap > 16) slowFrames++;
        lastMoveTime = now;
        if (now - slowWindow >= 1000) {
          if (slowFrames >= 5) {
            console.warn(`[Cursor] ${slowFrames} slow frames (>16ms) in the last second`);
          }
          slowFrames = 0;
          slowWindow = now;
        }
      }
    }

    // Hover detection — capture phase prevents child-crossing flicker
    function onEnter(e: MouseEvent) {
      if (e.target instanceof Element && e.target.closest("[data-interactive]")) {
        targetSize = SIZE_HOVERED;
        const el = dotRef.current;
        if (el) {
          el.style.background  = "var(--accent)";
          el.style.borderColor = "var(--accent)";
        }
        scheduleRaf();
      }
    }

    function onLeave(e: MouseEvent) {
      const related = e.relatedTarget;
      if (!(related instanceof Element) || !related.closest("[data-interactive]")) {
        targetSize = SIZE_DEFAULT;
        const el = dotRef.current;
        if (el) {
          el.style.background  = "transparent";
          el.style.borderColor = "var(--fg)";
        }
        scheduleRaf();
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", onEnter, true);
    document.addEventListener("mouseleave", onLeave, true);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
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
        width:       SIZE_DEFAULT,
        height:      SIZE_DEFAULT,
        background:  "transparent",
        border:      "1.5px solid var(--fg)",
        borderColor: "var(--fg)",
        willChange:  "transform",
        transition:  "background 150ms ease, border-color 150ms ease",
      }}
    />
  );
}
