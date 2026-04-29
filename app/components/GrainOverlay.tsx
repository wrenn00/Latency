"use client";

// Static SVG fractalNoise grain — fixed, pointer-events-none.
//
// mix-blend-mode was removed: it forces the browser to demote GPU compositor
// layers and repaint the entire viewport on CPU every time any transform
// animation runs underneath (e.g. card scale on hover). At 0.03 opacity the
// visual difference is imperceptible.

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9995] pointer-events-none select-none"
      style={{ opacity: 0.05 }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <filter id="latency-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.68"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#latency-grain)" />
      </svg>
    </div>
  );
}
