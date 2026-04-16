"use client";

import { useEffect, useState } from "react";

// Formats as "SEL // HH:MM:SS"
// SWAP: replace "SEL" with your city code — "NYC", "TYO", "LON", etc.
function formatTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `SEL // ${hh}:${mm}:${ss}`;
}

export function LiveClock() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const msUntilNextSecond = 1000 - (Date.now() % 1000);
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      setTime(formatTime(new Date()));
      intervalId = setInterval(() => setTime(formatTime(new Date())), 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  // The "//" separator renders in --accent so the clock has a single brand accent
  const parts = time.split("//");

  return (
    <span
      className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] tabular-nums"
      style={{ color: "var(--fg-muted)" }}
    >
      {parts[0]}
      <span style={{ color: "var(--accent)" }}>//</span>
      {parts[1]}
    </span>
  );
}
