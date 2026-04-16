"use client";

import { motion } from "framer-motion";
import { ALL_CATEGORIES } from "@/data/projects";
import { useWorkCanvas, type FilterCategory } from "./WorkCanvasContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const ITEMS: { label: string; value: FilterCategory }[] = [
  { label: "All Works", value: "ALL" },
  ...ALL_CATEGORIES.map((c) => ({ label: c, value: c as FilterCategory })),
];

export function CategoryStack() {
  const { filterCategory, setFilter } = useWorkCanvas();

  return (
    <nav className="flex flex-col gap-[6px]" aria-label="Filter projects by category">
      {ITEMS.map(({ label, value }) => {
        const active = filterCategory === value;
        return (
          <motion.button
            key={value}
            onClick={() => setFilter(value)}
            data-interactive="true"
            className="text-left cursor-none font-[family-name:var(--font-mono)] text-[12px] tracking-[0.06em] focus:outline-none"
            style={{
              color:          "var(--fg)",
              borderBottom:   active ? "1px solid var(--fg-muted)" : "1px solid transparent",
              paddingBottom:  "1px",
            }}
            animate={{ opacity: active ? 1 : 0.38 }}
            whileHover={{ opacity: active ? 1 : 0.75 }}
            transition={{ duration: 0.2, ease: EASE }}
            aria-pressed={active}
          >
            {label}
          </motion.button>
        );
      })}
    </nav>
  );
}
