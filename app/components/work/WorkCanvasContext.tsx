"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Category } from "@/data/projects";

export type FilterCategory = Category | "ALL";

export interface WorkCanvasCtx {
  hoveredId:      string | null;
  activeId:       string | null;   // committed (clicked)
  filterCategory: FilterCategory;
  isSoundOn:      boolean;
  setHovered:     (id: string | null) => void;
  commit:         (id: string) => void;
  close:          () => void;
  setFilter:      (cat: FilterCategory) => void;
  toggleSound:    () => void;
}

const Ctx = createContext<WorkCanvasCtx | null>(null);

export function WorkCanvasProvider({ children }: { children: ReactNode }) {
  const [hoveredId,      setHoveredId]      = useState<string | null>(null);
  const [activeId,       setActiveId]       = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("ALL");
  const [isSoundOn,      setIsSoundOn]      = useState(false);

  const setHovered = useCallback((id: string | null) => {
    // When a project is committed, hovering others doesn't clear to null
    // (background stays locked to activeId via displayId in WorkCanvas)
    setHoveredId(id);
  }, []);

  const commit = useCallback((id: string) => {
    setActiveId(id);
    setHoveredId(id);
    window.history.pushState(null, "", `/work/${id}`);
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
    setHoveredId(null);
    window.history.pushState(null, "", "/work");
  }, []);

  const setFilter = useCallback((cat: FilterCategory) => {
    setFilterCategory(cat);
    setHoveredId(null);
    setActiveId(null);
  }, []);

  const toggleSound = useCallback(() => setIsSoundOn((s) => !s), []);

  return (
    <Ctx.Provider value={{
      hoveredId, activeId, filterCategory, isSoundOn,
      setHovered, commit, close, setFilter, toggleSound,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWorkCanvas(): WorkCanvasCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkCanvas must be inside WorkCanvasProvider");
  return ctx;
}
