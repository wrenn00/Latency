"use client";

// No Framer Motion — motion.button + animate/whileHover created per-item
// subscriptions that fired on every hover. Plain button with direct DOM
// style writes has zero JS overhead after initial render.

import { useWorkCanvas } from "./WorkCanvasContext";

export function CategoryStack() {
  const { categories, filterCategory, setFilter } = useWorkCanvas();

  const items = [
    { label: "All Works", value: "ALL" },
    ...categories.map((c) => ({ label: c.name, value: c.id })),
  ];

  return (
    <nav className="flex flex-col gap-[6px]" aria-label="Filter works by category">
      {items.map(({ label, value }) => {
        const active = filterCategory === value;
        return (
          <button
            key={value}
            onClick={() => setFilter(value)}
            data-interactive="true"
            className="text-left cursor-none font-[family-name:var(--font-mono)] text-[12px] tracking-[0.06em] focus:outline-none"
            style={{
              color:         "var(--fg)",
              opacity:       active ? 1 : 0.38,
              borderBottom:  active ? "1px solid var(--fg-muted)" : "1px solid transparent",
              paddingBottom: "1px",
              transition:    "opacity 150ms ease",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.opacity = "0.75"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = active ? "1" : "0.38"; }}
            aria-pressed={active}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
