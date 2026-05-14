"use client";

import { useRef, useState } from "react";

const STARS = [
  { cx: 160, cy: 140, scale: 1.0, delay: "0s",    id: "s0" },
  { cx: 420, cy: 230, scale: 0.65, delay: "2.6s",  id: "s1" },
  { cx: 200, cy: 430, scale: 0.78, delay: "5.3s",  id: "s2" },
];

// 4-point star path centered at origin, radius ~100
const STAR_PATH =
  "M 0,-100 C 28,-28 28,-28 100,0 C 28,28 28,28 0,100 C -28,28 -28,28 -100,0 C -28,-28 -28,-28 0,-100 Z";

export function PastelMetaballGraphic() {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 600 600"
      width="480"
      height="480"
      style={{
        maxWidth: "100%",
        filter: hovered ? "saturate(1.15)" : "saturate(1.0)",
        transition: "filter 600ms ease",
        display: "block",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      <defs>
        {STARS.map((s) => (
          <radialGradient
            key={s.id}
            id={`grad-${s.id}`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%"   stopColor="#B8D4F1" stopOpacity="0.95" />
            <stop offset="55%"  stopColor="#8FB2D9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#5B7FA3" stopOpacity="0" />
          </radialGradient>
        ))}

        {/* soft outer glow filter */}
        <filter id="starGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>{`
          @keyframes breathe0 {
            0%,100% { transform: translate(160px,140px) scale(1.0); }
            50%      { transform: translate(160px,140px) scale(1.03); }
          }
          @keyframes breathe1 {
            0%,100% { transform: translate(420px,230px) scale(0.65); }
            50%      { transform: translate(420px,230px) scale(0.67); }
          }
          @keyframes breathe2 {
            0%,100% { transform: translate(200px,430px) scale(0.78); }
            50%      { transform: translate(200px,430px) scale(0.805); }
          }
          @media (prefers-reduced-motion: reduce) {
            .star-0, .star-1, .star-2 { animation: none !important; }
          }
        `}</style>
      </defs>

      {/* connector lines forming a triangle */}
      {[
        [STARS[0], STARS[1]],
        [STARS[1], STARS[2]],
        [STARS[2], STARS[0]],
      ].map(([a, b], i) => (
        <line
          key={i}
          x1={a.cx} y1={a.cy}
          x2={b.cx} y2={b.cy}
          stroke="rgba(184,212,241,0.3)"
          strokeWidth="1"
        />
      ))}

      {/* stars */}
      {STARS.map((s, i) => (
        <g
          key={s.id}
          className={`star-${i}`}
          style={{
            animation: `breathe${i} 8s ease-in-out ${s.delay} infinite`,
            transformOrigin: `${s.cx}px ${s.cy}px`,
          }}
          filter="url(#starGlow)"
        >
          <path
            d={STAR_PATH}
            transform={`translate(${s.cx},${s.cy}) scale(${s.scale})`}
            fill={`url(#grad-${s.id})`}
          />
        </g>
      ))}
    </svg>
  );
}
