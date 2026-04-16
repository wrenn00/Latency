"use client";

// Live cursor coordinate display — bottom-center of viewport.
// Direct DOM writes on mousemove, no React state, no re-renders.

import { useEffect, useRef } from "react";

export function CursorTracker() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const x = String(Math.min(Math.round(e.clientX), 9999)).padStart(4, "0");
      const y = String(Math.min(Math.round(e.clientY), 9999)).padStart(4, "0");
      el.textContent = `X ${x}  Y ${y}`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] pointer-events-none
                 font-[family-name:var(--font-mono)] text-[10px] tabular-nums tracking-[0.1em]
                 select-none"
      style={{ color: "var(--fg-muted)", opacity: 0.5 }}
    >
      X 0000  Y 0000
    </span>
  );
}
