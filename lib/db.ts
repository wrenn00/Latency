// ─── lib/db.ts (read-only) ────────────────────────────────────────────────────
// Reads data/portfolio.json synchronously at server request time.
//
// HOW TO ADD A WORK:
//   1. Add an entry to data/portfolio.json → works array
//   2. Create app/work/[your-slug]/page.tsx for the case study
//   3. git push → Vercel rebuilds automatically
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "fs";
import { join } from "path";

export interface PortfolioCategory {
  id: string;
  name: string;
  order: number;
}

export interface Work {
  id: string;
  /** Same as id — used in URL paths and component lookups. */
  slug: string;
  title: string;
  categoryId: string;
  /** Display name, joined from categories at read time. */
  category: string;
  thumbnail?: string;
  year: string;
  order: number;
  accentColor: string;
  /** Grid column span. 1 = portrait (default), 2 = landscape. */
  spanCols: 1 | 2;
  description?: string;
  role?: string;
  client?: string;
  type?: string;        // "video" for embedded video works (YouTube)
  youtubeId?: string;
  video?: string;       // mp4 path for card hover-preview
  videoUrl?: string;
  posterUrl?: string;
}

interface RawWork {
  id: string;
  title: string;
  categoryId: string;
  thumbnail?: string;
  year: string;
  order: number;
  accentColor?: string;
  spanCols?: 1 | 2;
  description?: string;
  role?: string;
  client?: string;
  type?: string;
  youtubeId?: string;
  video?: string;
  videoUrl?: string;
  posterUrl?: string;
  [key: string]: unknown;
}

interface PortfolioData {
  categories: PortfolioCategory[];
  works: RawWork[];
}

function readData(): PortfolioData {
  const raw = readFileSync(join(process.cwd(), "data", "portfolio.json"), "utf-8");
  return JSON.parse(raw) as PortfolioData;
}

export function getWorks(): Work[] {
  const { categories, works } = readData();
  return works
    .sort((a, b) => a.order - b.order)
    .map((w) => ({
      id:          w.id,
      slug:        w.id,
      title:       w.title,
      categoryId:  w.categoryId,
      category:    categories.find((c) => c.id === w.categoryId)?.name ?? "Uncategorized",
      thumbnail:   w.thumbnail,
      year:        w.year,
      order:       w.order,
      accentColor:  w.accentColor ?? "#B8D4F1",
      spanCols:     w.spanCols ?? 1,
      description:  w.description,
      role:         w.role,
      client:       w.client,
      type:         w.type,
      youtubeId:    w.youtubeId,
      video:        w.video,
      videoUrl:     w.videoUrl,
      posterUrl:    w.posterUrl,
    }));
}

export function getWorkById(id: string): Work | null {
  return getWorks().find((w) => w.id === id) ?? null;
}

export function getCategories(): PortfolioCategory[] {
  return readData().categories.sort((a, b) => a.order - b.order);
}
