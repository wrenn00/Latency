"use client";

// Static SVG turbulence grain — fixed to viewport at 3% opacity.
// mix-blend-mode: overlay so it brightens light areas and darkens dark ones
// for a subtle film-stock texture without a visual color cast.

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9995] pointer-events-none select-none"
      style={{ opacity: 0.03, mixBlendMode: "overlay" }}
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
