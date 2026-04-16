"use client";

import { useEffect, useState } from "react";

// Formats the current time as "SEL HH:MM:SS"
// SWAP: replace "SEL" with your city code — "NYC", "TYO", "LON", etc.
function formatTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `SEL ${hh}:${mm}:${ss}`;
}

export function LiveClock() {
  // Initialize synchronously with current time — no empty-string flash on mount.
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    // Align the interval to the next full second so the display ticks in sync
    // with the system clock rather than drifting by the component's mount offset.
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

  return (
    <span
      className="font-[family-name:var(--font-mono)] text-[11px] tracking-wider tabular-nums"
      style={{ opacity: 0.5 }}
    >
      {time}
    </span>
  );
}
