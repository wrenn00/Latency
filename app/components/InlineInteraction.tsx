"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── EASE ────────────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── BASE PILL ───────────────────────────────────────────────────────────────
interface PillProps {
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
  "data-hovered"?: boolean;
}

function Pill({ children, className = "", onMouseEnter, onMouseLeave, style, ...rest }: PillProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      className={`inline-flex items-center gap-0.5 px-1.5 rounded border font-[inherit] text-[inherit] leading-[inherit] relative select-none ${className}`}
      style={{
        background: hovered ? "#111111" : "#F0F0F0",
        borderColor: hovered ? "#111111" : "#E5E5E5",
        color: hovered ? "#FAFAFA" : "#111111",
        borderRadius: "4px",
        paddingLeft: "6px",
        paddingRight: "6px",
        transition: "background 150ms, border-color 150ms, color 150ms",
        ...style,
      }}
      onMouseEnter={() => { setHovered(true); onMouseEnter?.(); }}
      onMouseLeave={() => { setHovered(false); onMouseLeave?.(); }}
      {...(rest as any)}
    >
      {children}
    </motion.span>
  );
}

// ─── DAN — avatar tooltip (fixed-position so it never clips) ─────────────────
export function DanWord() {
  const [hovered, setHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const pillRef = useRef<HTMLSpanElement>(null);

  const measure = useCallback(() => {
    if (!pillRef.current) return;
    const r = pillRef.current.getBoundingClientRect();
    setCoords({ x: r.left + r.width / 2, y: r.top });
  }, []);

  return (
    <>
      {/* Tooltip rendered in the fixed layer — never clipped by section overflow */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="fixed pointer-events-none z-[9999] -translate-x-1/2"
            style={{ left: coords.x, top: coords.y - 56 }}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.18, ease: EASE }}
          >
            <span className="flex flex-col items-center gap-1">
              {/*
               * SWAP: replace the <span> below with:
               *   <img src="/avatar.jpg" className="w-9 h-9 rounded-full object-cover border border-[#E5E5E5]" />
               */}
              <span className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center text-[#FAFAFA] text-[11px] tracking-widest font-[family-name:var(--font-mono)] border border-[#333]">
                DAN
              </span>
              {/* caret */}
              <svg width="8" height="5" viewBox="0 0 8 5" className="text-[#111]">
                <path d="M0 0 L4 5 L8 0Z" fill="currentColor" />
              </svg>
            </span>
          </motion.span>
        )}
      </AnimatePresence>

      <span ref={pillRef} className="inline-flex">
        <Pill onMouseEnter={() => { measure(); setHovered(true); }} onMouseLeave={() => setHovered(false)}>
          DAN
        </Pill>
      </span>
    </>
  );
}

// ─── BETWEEN — letter spread ─────────────────────────────────────────────────
// Each letter fans out from centre symmetrically. Multiplier *3.5 gives ±10.5px
// on outermost letters — legible but clearly feels like space opening up.
// On leave the stagger reverses (delay from the outside in) so letters close
// like a shutter rather than snapping back all at once.
const BETWEEN_LETTERS = "BETWEEN".split("");
const B_CENTER = (BETWEEN_LETTERS.length - 1) / 2; // 3

export function BetweenWord() {
  const [hovered, setHovered] = useState(false);

  return (
    <Pill onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {BETWEEN_LETTERS.map((l, i) => {
        const offset = (i - B_CENTER) * 3.5;
        // on enter: stagger left-to-right; on leave: stagger outside-in (mirror)
        const delayEnter = i * 0.028;
        const delayLeave = (Math.abs(i - B_CENTER) / B_CENTER) * 0.06;
        return (
          <motion.span
            key={i}
            animate={{ x: hovered ? offset : 0 }}
            transition={{
              duration: 0.32,
              delay: hovered ? delayEnter : delayLeave,
              ease: EASE,
            }}
            className="inline-block"
          >
            {l}
          </motion.span>
        );
      })}
    </Pill>
  );
}

// ─── TIMING — metronome ──────────────────────────────────────────────────────
// Arm + bob share a single <motion.g> so they rotate as one rigid body.
// Transition: duration 1.4s, easeInOut, infinite — feels like a real pendulum.
export function TimingWord() {
  const [hovered, setHovered] = useState(false);
  return (
    <span className="inline-flex items-center gap-1">
      <Pill onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        TIMING
      </Pill>
      <AnimatePresence>
        {hovered && (
          <motion.svg
            width="14"
            height="19"
            viewBox="0 0 14 19"
            className="inline-block pointer-events-none shrink-0"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15, ease: EASE }}
          >
            {/* static pivot dot */}
            <circle cx="7" cy="2.5" r="1.5" fill="currentColor" />
            {/* arm + bob rotate together around the pivot */}
            <motion.g
              style={{ transformOrigin: "7px 2.5px" }}
              animate={{ rotate: [-26, 26, -26] }}
              transition={{
                duration: 1.4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            >
              <line
                x1="7" y1="2.5"
                x2="7" y2="14.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="7" cy="14.5" r="2.5" fill="currentColor" />
            </motion.g>
            {/* base rail */}
            <line x1="2" y1="18" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </motion.svg>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── LATENCY — waveform fill / collapse ──────────────────────────────────────
// Each bar is always mounted; scaleY animates between 0 ↔ 1 driven by `hovered`.
// This lets Framer Motion run the reverse (collapse) animation on mouse-leave
// instead of unmounting everything instantly.
const WAVEFORM_BARS = [3, 7, 5, 9, 4, 8, 6, 10, 5, 7];

export function LatencyWord() {
  const [hovered, setHovered] = useState(false);

  return (
    <span className="inline-flex items-center gap-1.5">
      <Pill onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        LATENCY
      </Pill>
      {/* Container stays mounted; opacity fades the whole waveform in/out */}
      <motion.span
        className="inline-flex items-end gap-px pointer-events-none"
        style={{ height: 10 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.15, ease: EASE }}
        aria-hidden
      >
        {WAVEFORM_BARS.map((h, i) => (
          <motion.span
            key={i}
            className="inline-block w-[2px] bg-[#111] rounded-sm"
            animate={{
              scaleY: hovered ? 1 : 0.08,
              // subtle idle shimmer while hovered — bars pulse slightly out of phase
              opacity: hovered ? 1 : 0,
            }}
            transition={{
              scaleY: {
                duration: hovered ? 0.4 : 0.25,
                delay: hovered ? i * 0.035 : (WAVEFORM_BARS.length - 1 - i) * 0.025,
                ease: EASE,
              },
              opacity: {
                duration: 0.15,
                delay: hovered ? i * 0.03 : 0,
              },
            }}
            style={{ height: h, transformOrigin: "bottom" }}
          />
        ))}
      </motion.span>
    </span>
  );
}

// ─── HATS — cycling emoji ─────────────────────────────────────────────────────
// Key strategy: the AnimatePresence key must change on EVERY content transition,
// including the initial "HATS" → first emoji swap. Using a compound key
// `${hovered ? "hat" : "label"}-${idx}` ensures enter animations fire on all
// transitions, not just subsequent idx increments.
const HATS_LIST = ["🎩", "🧢", "⛑️", "🎓"];

export function HatsWord() {
  const [hovered, setHovered] = useState(false);
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleEnter = () => {
    setHovered(true);
    setIdx(0); // restart cycle from first hat on each hover
    intervalRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % HATS_LIST.length);
    }, 380);
  };

  const handleLeave = () => {
    setHovered(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const animKey = hovered ? `hat-${idx}` : "label";

  return (
    <Pill onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={animKey}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.14, ease: EASE }}
          className="inline-block"
          // prevent layout shift from emoji width change
          style={{ minWidth: "3ch", textAlign: "center" }}
        >
          {hovered ? HATS_LIST[idx] : "HATS"}
        </motion.span>
      </AnimatePresence>
    </Pill>
  );
}

// ─── UI/UX — wireframe sketch-in ─────────────────────────────────────────────
// Each path draws itself via stroke-dashoffset so the wireframe feels like it's
// being sketched rather than appearing all at once.
// stroke-dasharray = total path length; dashoffset animates 1→0 (fully drawn).
// Lengths are pre-measured for the 28×20 viewBox paths below.
function SketchLine({
  d,
  len,
  delay,
  strokeWidth = 0.75,
}: {
  d: string;
  len: number;
  delay: number;
  strokeWidth?: number;
}) {
  return (
    <motion.path
      d={d}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeDasharray={len}
      initial={{ strokeDashoffset: len }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ duration: 0.22, delay, ease: EASE }}
    />
  );
}

export function UiUxWord() {
  const [hovered, setHovered] = useState(false);

  return (
    <span className="inline-flex items-center gap-1">
      <Pill onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        UI/UX
      </Pill>
      <AnimatePresence>
        {hovered && (
          <motion.svg
            width="28"
            height="20"
            viewBox="0 0 28 20"
            className="inline-block pointer-events-none shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {/* outer box — perimeter ≈ 88 */}
            <SketchLine d="M2 1 H26 Q27 1 27 2 V18 Q27 19 26 19 H2 Q1 19 1 18 V2 Q1 1 2 1" len={88} delay={0} strokeWidth={1} />
            {/* nav divider — length = 26 */}
            <SketchLine d="M1 5.5 H27" len={26} delay={0.06} />
            {/* sidebar divider — length = 13.5 */}
            <SketchLine d="M8.5 5.5 V19" len={13.5} delay={0.1} />
            {/* content row 1 — length ≈ 10 */}
            <SketchLine d="M10.5 8 H20.5" len={10} delay={0.15} />
            {/* content row 2 — length ≈ 7 */}
            <SketchLine d="M10.5 12 H17.5" len={7} delay={0.18} />
            {/* content row 3 — length ≈ 12 */}
            <SketchLine d="M10.5 16 H22.5" len={12} delay={0.21} />
          </motion.svg>
        )}
      </AnimatePresence>
    </span>
  );
}

// ─── LATE — fall + bounce ────────────────────────────────────────────────────
// Spring on enter: low damping (12) so it overshoots y=4 then settles back — the
// word genuinely "arrives late" with a little wobble. Return is a fast tween so
// it snaps back crisply rather than slowly spring-rising.
export function LateWord() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      className="inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ y: hovered ? 5 : 0 }}
      transition={
        hovered
          ? { type: "spring", stiffness: 280, damping: 12, mass: 0.6 }
          : { type: "tween", duration: 0.18, ease: EASE }
      }
    >
      <Pill>LATE</Pill>
    </motion.span>
  );
}

// ─── GRAPHIC DESIGN — grid overlay ──────────────────────────────────────────
// The grid renders BEHIND the pill via z-index layering. The pill sits at z:1
// and the grid expands slightly beyond the pill bounds (inset: -3px) so the
// grid is visible as a thin halo. overflow:hidden on the wrapper clips it to
// the pill shape via the shared border-radius.
export function GraphicDesignWord() {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="relative inline-flex"
      style={{ borderRadius: 4, overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* grid sits at z:0, behind the pill (z:1) */}
      <motion.span
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          zIndex: 0,
          borderRadius: 4,
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,0.07) 4px,rgba(0,0,0,0.07) 5px)," +
            "repeating-linear-gradient(90deg,transparent,transparent 4px,rgba(0,0,0,0.07) 4px,rgba(0,0,0,0.07) 5px)",
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2, ease: EASE }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>
        <Pill>GRAPHIC DESIGN</Pill>
      </span>
    </span>
  );
}

// ─── ADVERTISING — flash invert ──────────────────────────────────────────────
// Two sharp flashes: the `times` array controls when each keyframe is hit.
// Pairing fast on/off intervals (0→0.15→0.3→0.55→0.7→1) makes the second
// flash feel slightly slower — like a strobe that almost steadies itself.
// `key` on the motion.span is bumped on each re-enter so Framer re-runs the
// animation even if the user quickly leaves and re-enters.
export function AdvertisingWord() {
  const [flashKey, setFlashKey] = useState(0);
  const [active, setActive] = useState(false);

  const handleEnter = () => {
    setFlashKey((k) => k + 1);
    setActive(true);
  };

  return (
    <motion.span
      key={flashKey}
      className="inline-block"
      animate={
        active
          ? {
              filter: [
                "invert(0%)",
                "invert(100%)",
                "invert(0%)",
                "invert(100%)",
                "invert(0%)",
              ],
            }
          : { filter: "invert(0%)" }
      }
      transition={{
        duration: 0.38,
        times: [0, 0.18, 0.36, 0.62, 1],
        ease: "linear",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setActive(false)}
      onAnimationComplete={() => setActive(false)}
    >
      <Pill>ADVERTISING</Pill>
    </motion.span>
  );
}

// ─── THINGS — echo/duplicate ─────────────────────────────────────────────────
// The ghost is absolutely positioned to exactly match the pill's text position,
// then animates to a slight offset. It uses the same pill padding (px: 6px) so
// it starts perfectly behind the real label before drifting up-right.
// `pointer-events:none` and `user-select:none` keep it purely decorative.
export function ThingsWord() {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            aria-hidden
            className="absolute inset-0 pointer-events-none select-none flex items-center justify-center"
            style={{
              fontFamily: "inherit",
              fontSize: "inherit",
              lineHeight: "inherit",
              color: "rgba(17,17,17,0.3)",
              borderRadius: 4,
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: 6, y: -4, opacity: 1 }}
            exit={{ x: 0, y: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            THINGS
          </motion.span>
        )}
      </AnimatePresence>
      <Pill>THINGS</Pill>
    </span>
  );
}

// ─── XR DESIGN — 3D tilt ────────────────────────────────────────────────────
// CSS `perspective` on an element affects its *children*, not the element itself.
// Framer Motion's `transformPerspective` injects `perspective(Npx)` into the
// element's own transform chain, which is what we need for self-3D rotation.
export function XrDesignWord() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      className="inline-block"
      animate={
        hovered
          ? { rotateX: 14, rotateY: -20, scale: 1.04 }
          : { rotateX: 0, rotateY: 0, scale: 1 }
      }
      transition={{ duration: 0.28, ease: EASE }}
      style={{ transformPerspective: 400, display: "inline-block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Pill>XR DESIGN</Pill>
    </motion.span>
  );
}

// ─── DISCOMFORT — glitch shake ────────────────────────────────────────────────
// `x` and `skewX` must have the same number of keyframes so Framer pairs them
// correctly. Using `times` pins each keyframe to an exact point in the timeline,
// giving a fast initial jolt that decays — the sensation of something going wrong
// and then almost recovering. `key` increments on re-enter so the animation
// always re-fires cleanly.
export function DiscomfortWord() {
  const [shakeKey, setShakeKey] = useState(0);
  const [active, setActive] = useState(false);

  const handleEnter = () => {
    setShakeKey((k) => k + 1);
    setActive(true);
  };

  return (
    <motion.span
      key={shakeKey}
      className="inline-block"
      animate={
        active
          ? {
              x:      [0, -4,  4, -3,  3, -1,  1, 0],
              skewX:  [0, -3,  3, -2,  2, -1,  1, 0],
            }
          : { x: 0, skewX: 0 }
      }
      transition={{
        duration: 0.42,
        times:    [0, 0.1, 0.22, 0.36, 0.5, 0.65, 0.82, 1],
        ease:     "linear",
      }}
      onMouseEnter={handleEnter}
      onAnimationComplete={() => setActive(false)}
    >
      <Pill>DISCOMFORT</Pill>
    </motion.span>
  );
}
