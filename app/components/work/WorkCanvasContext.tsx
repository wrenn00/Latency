"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Work, PortfolioCategory } from "@/lib/db";

export type FilterCategory = string;
export type ViewMode = "grid" | "split" | "fullscreen";

export interface WorkCanvasCtx {
  works:           Work[];
  categories:      PortfolioCategory[];
  filterCategory:  FilterCategory;
  viewMode:        ViewMode;
  selectedWorkId:  string | null;
  setFilter:       (cat: FilterCategory) => void;
  selectWork:      (id: string) => void;
  closeWork:       () => void;
  enterFullscreen: () => void;
  exitFullscreen:  () => void;
}

const Ctx = createContext<WorkCanvasCtx | null>(null);

export function WorkCanvasProvider({
  children, works, categories,
}: {
  children: ReactNode;
  works: Work[];
  categories: PortfolioCategory[];
}) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("ALL");
  const [viewMode,       setViewMode]        = useState<ViewMode>("grid");
  const [selectedWorkId, setSelectedWorkId]  = useState<string | null>(null);

  const setFilter = useCallback((cat: FilterCategory) => {
    setFilterCategory(cat);
    setViewMode("grid");
    setSelectedWorkId(null);
  }, []);

  const selectWork = useCallback((id: string) => {
    setSelectedWorkId(id);
    setViewMode("split");
  }, []);

  const closeWork = useCallback(() => {
    setViewMode("grid");
    setSelectedWorkId(null);
  }, []);

  const enterFullscreen = useCallback(() => setViewMode("fullscreen"), []);
  const exitFullscreen  = useCallback(() => setViewMode("split"),      []);

  return (
    <Ctx.Provider value={{
      works, categories,
      filterCategory, viewMode, selectedWorkId,
      setFilter, selectWork, closeWork, enterFullscreen, exitFullscreen,
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
