// ─────────────────────────────────────────────────────────────────────────────
//  SWAP GUIDE
//  - Replace picsum.photos URLs with your own hosted images or /public paths.
//  - When using real images with next/image, add a blurDataURL to each entry
//    and set placeholder="blur" in the Image components.
//  - Update slug, title, year, category, client, role, description per project.
//  - accentColor is used as placeholder background in the gallery grid.
// ─────────────────────────────────────────────────────────────────────────────

export type Category =
  | "UI/UX"
  | "XR Design"
  | "Graphic Design"
  | "Advertising"
  | "Interaction";

export interface Project {
  slug: string;
  title: string;
  year: string;
  category: Category;
  client: string;
  role: string;
  description: string;
  accentColor: string;
  /** First image is used as the hero and cover card thumbnail. */
  images: string[];
  // ── Media fields (WorkCanvas) ─────────────────────────────────────────────
  /** Vimeo/MP4 URL for fullscreen ambient background. One-line swap when ready. */
  videoUrl?: string;
  /** Fallback poster image for the video element. */
  posterUrl?: string;
  /** Client/subject name, displayed separately from studio name. */
  clientName?: string;
}

// Deterministic picsum seeds so images stay consistent across builds.
const pic = (seed: number, w = 1400, h = 900) =>
  `https://picsum.photos/seed/ltcy${seed}/${w}/${h}`;

export const PROJECTS: Project[] = [
  {
    slug: "haptic-response-system",
    title: "Haptic Response System",
    year: "2024",
    category: "XR Design",
    client: "Internal R&D",
    role: "Lead Interaction Designer",
    accentColor: "#556B6B",
    description:
      "An explorative system mapping temporal delay between physical gesture and virtual feedback in mixed-reality environments. Research focused on the 11–17ms window within which haptic response is perceived as synchronous with visual stimulus — and what happens when that window is intentionally broken.",
    images: [pic(10, 1400, 900), pic(11, 1200, 800), pic(12, 900, 1200)],
  },
  {
    slug: "interval-ui-kit",
    title: "Interval — Temporal UI Kit",
    year: "2023",
    category: "UI/UX",
    client: "Open Source",
    role: "Design System Lead",
    accentColor: "#3D5A80",
    description:
      "A component library where timing is a first-class design token. Transitions, delays, and durations are named semantic variables — not just easing functions, but moments: enter, linger, exit. Every component has an opinion about its own pacing.",
    images: [pic(20, 1400, 900), pic(21, 1200, 800), pic(22, 1200, 800)],
  },
  {
    slug: "pause-campaign",
    title: "Pause Campaign",
    year: "2023",
    category: "Advertising",
    client: "Confidential",
    role: "Art Director",
    accentColor: "#E8E4D9",
    description:
      "A brand campaign built on a single constraint: no animation faster than 600ms. Every transition required to be perceptible, to make the viewer aware of the interval. The slowness was the message — in a medium where everything accelerates, deliberate pause became the differentiator.",
    images: [pic(30, 1400, 900), pic(31, 1200, 800), pic(32, 1400, 800)],
  },
  {
    slug: "signal-type",
    title: "Signal — Type in Time",
    year: "2022",
    category: "Graphic Design",
    client: "Self-initiated",
    role: "Designer",
    accentColor: "#1A1AFF",
    description:
      "A typeface experiment where letterform weight is modulated by playback position — letters thicken as a phrase completes, like a voice gaining confidence. Weight is not a style decision; it is a timestamp. The typeface records its own performance.",
    images: [pic(40, 1400, 900), pic(41, 1200, 800), pic(42, 800, 1200)],
  },
  {
    slug: "threshold",
    title: "Threshold",
    year: "2022",
    category: "Interaction",
    client: "Gallery Commission",
    role: "Interaction Designer",
    accentColor: "#4A4A4A",
    description:
      "An installation where a doorway sensor measures a visitor's crossing speed. Text responds in kind — rushed visitors receive a fragment; slow visitors receive the complete text. Patience is the only input. The system cannot be gamed; it can only be inhabited.",
    images: [pic(50, 1400, 900), pic(51, 1200, 800), pic(52, 900, 1200)],
  },
  {
    slug: "drift-identity",
    title: "Drift Identity System",
    year: "2022",
    category: "Graphic Design",
    client: "Drift Studio",
    role: "Brand Designer",
    accentColor: "#8B7355",
    description:
      "A visual identity where the logo mark shifts 2px per day across all digital applications. After a year the mark has drifted one full screen-width from its origin. The brand accumulates its own history. No two days look identical; no update is ever broadcast.",
    images: [pic(60, 1400, 900), pic(61, 1200, 800), pic(62, 1200, 800)],
  },
  {
    slug: "ambient-ui",
    title: "Ambient UI",
    year: "2021",
    category: "UI/UX",
    client: "Research",
    role: "UX Researcher & Designer",
    accentColor: "#0051FF",
    description:
      "Interfaces that respond to ambient environmental data — light levels, room acoustics, and proximity — and shift their own timing accordingly. A UI that slows down in quiet rooms and accelerates in loud ones. Attention is not a setting; it is a reading.",
    images: [pic(70, 1400, 900), pic(71, 1200, 800), pic(72, 1200, 800)],
  },
  {
    slug: "echo-xr",
    title: "Echo",
    year: "2021",
    category: "XR Design",
    client: "Studio Commission",
    role: "XR Designer",
    accentColor: "#2C2C2C",
    description:
      "A virtual reality experience where every action the user takes is replayed with a 3-second delay, layered over their current movement. Users navigate a space populated by their own recent past. The work asks: when does a trace become a ghost?",
    images: [pic(80, 1400, 900), pic(81, 1200, 800), pic(82, 900, 1200)],
  },
  {
    slug: "delay-fm",
    title: "Delay.fm",
    year: "2024",
    category: "UI/UX",
    client: "Self-initiated",
    role: "Product Designer",
    accentColor: "#FF4500",
    description:
      "A music streaming interface built around intentional temporal displacement. Tracks are served with variable pre-buffer delays, each tuned to the genre's natural listening rhythm. The wait is part of the experience. You feel the music before you hear it.",
    images: [pic(90, 1400, 900), pic(91, 1200, 800), pic(92, 1200, 800)],
  },
  {
    slug: "metronome-identity",
    title: "Metronome Identity",
    year: "2023",
    category: "Graphic Design",
    client: "Metronome Records",
    role: "Brand Designer",
    accentColor: "#C8B89A",
    description:
      "A record label identity where every design element is derived from BPM — the grid is set at 120 divisions, type sizes follow note durations, and the logo pulses in promotional materials at exactly 60 BPM. The brand is a score.",
    images: [pic(100, 1400, 900), pic(101, 1200, 800), pic(102, 1200, 800)],
  },
  {
    slug: "persistence-of-vision",
    title: "Persistence of Vision",
    year: "2024",
    category: "XR Design",
    client: "Museum Commission",
    role: "Experience Designer",
    accentColor: "#2C3E50",
    description:
      "An AR installation that exploits the 1/15th-second persistence of human vision. Digital objects are flashed at the threshold frequency — half-seen, never fully resolved. The viewer's own visual system completes the image. The work exists only in the gap between frames.",
    images: [pic(110, 1400, 900), pic(111, 1200, 800), pic(112, 900, 1200)],
  },
  {
    slug: "dead-air",
    title: "Dead Air Campaign",
    year: "2022",
    category: "Advertising",
    client: "Broadcasting Client",
    role: "Creative Director",
    accentColor: "#D4380D",
    description:
      "A broadcast campaign that weaponized silence. Thirty-second spots with twenty-two seconds of silence, eight seconds of product. In a medium addicted to filling every moment, the dead air was louder than any call to action. Recall scores were 3× the category average.",
    images: [pic(120, 1400, 900), pic(121, 1200, 800), pic(122, 1400, 800)],
  },
  {
    slug: "cue-spatial-audio",
    title: "Cue — Spatial Audio UI",
    year: "2023",
    category: "UI/UX",
    client: "Spatial Audio Lab",
    role: "Interaction Designer",
    accentColor: "#3D3530",
    description:
      "An interface for spatial audio composition where the visual timeline is the room itself. Sound objects are placed in three-dimensional space; their position encodes both location and delay. The UI collapses the gap between composer, space, and listener.",
    images: [pic(130, 1400, 900), pic(131, 1200, 800), pic(132, 1200, 800)],
  },
  {
    slug: "still-frame",
    title: "Still Frame",
    year: "2021",
    category: "Graphic Design",
    client: "Self-initiated",
    role: "Designer / Publisher",
    accentColor: "#F0EDE8",
    description:
      "A zine series printed on thermal paper that fades completely within six months of purchase. Each issue is designed to be read once with full attention, then watched disappear. The impermanence is the argument against archiving everything.",
    images: [pic(140, 1400, 900), pic(141, 1200, 800), pic(142, 800, 1200)],
  },
  {
    slug: "reflex",
    title: "Reflex",
    year: "2024",
    category: "Interaction",
    client: "Research / Exhibition",
    role: "Lead Designer",
    accentColor: "#6B5B45",
    description:
      "A reaction-time study turned interactive installation. Visitors trigger stimuli and their biological response latency is displayed in real time, compared against population data. The work makes personal timing visible — the body as a clock with a clock.",
    images: [pic(150, 1400, 900), pic(151, 1200, 800), pic(152, 900, 1200)],
  },
  {
    slug: "ghost-type",
    title: "Ghost Type",
    year: "2023",
    category: "Graphic Design",
    client: "Type Foundry",
    role: "Type Designer",
    accentColor: "#111111",
    description:
      "A variable typeface where the optical weight axis is labeled in milliseconds — 0ms is hairline, 500ms is ultra-black. The naming makes explicit what weight has always implied: that heavier type demands more of the viewer's time. Every typographic choice is a temporal one.",
    images: [pic(160, 1400, 900), pic(161, 1200, 800), pic(162, 1200, 800)],
  },
];

export const ALL_CATEGORIES: Category[] = [
  "UI/UX",
  "XR Design",
  "Graphic Design",
  "Advertising",
  "Interaction",
];
