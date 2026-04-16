"use client";

// AppShell — client-side wrapper mounted once in layout.tsx.
// Owns: loading screen (first-visit only), grain overlay, cursor tracker,
// and the custom cursor (consolidated here so there's exactly one instance).

import { useState, useEffect, useCallback } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { GrainOverlay } from "./GrainOverlay";
import { CursorTracker } from "./CursorTracker";
import { CustomCursor } from "./CustomCursor";

const SESSION_KEY = "latency_loaded";

export function AppShell({ children }: { children: React.ReactNode }) {
  // showLoader: true only on first visit (sessionStorage check in useEffect)
  const [showLoader, setShowLoader] = useState(false);
  // contentVisible: false during first-visit load, true otherwise
  const [contentVisible, setContentVisible] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setShowLoader(true);
      setContentVisible(false);
    }
  }, []);

  const handleLoaderDone = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setShowLoader(false);
    setContentVisible(true);
  }, []);

  return (
    <>
      {/* First-visit loading screen */}
      {showLoader && <LoadingScreen onDone={handleLoaderDone} />}

      {/* Page-global overlays */}
      <GrainOverlay />
      <CursorTracker />
      <CustomCursor />

      {/* Main content — fades in after loader exits */}
      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: contentVisible ? "opacity 600ms 200ms ease" : "none",
        }}
      >
        {children}
      </div>
    </>
  );
}
