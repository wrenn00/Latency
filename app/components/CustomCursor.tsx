"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);

    // Capture-phase mouseenter/mouseleave on the document.
    // Unlike mouseover/mouseout, these do NOT bubble through child elements,
    // so moving between children of an interactive element no longer flickers.
    const onEnter = (e: MouseEvent) => {
      if ((e.target as Element)?.closest("[data-interactive]")) setHovered(true);
    };
    const onLeave = (e: MouseEvent) => {
      // Only clear if the new target is outside any interactive zone
      const related = (e as MouseEvent & { relatedTarget: EventTarget | null }).relatedTarget;
      if (!(related instanceof Element) || !related.closest("[data-interactive]")) {
        setHovered(false);
      }
    };

    // useCapture: true so we intercept before the element receives the event
    document.addEventListener("mouseenter", onEnter, true);
    document.addEventListener("mouseleave", onLeave, true);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter, true);
      document.removeEventListener("mouseleave", onLeave, true);
    };
  }, []);

  // Size/offset: the dot is centred on the cursor position
  const size = hovered ? 22 : 12;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
      animate={{
        x: pos.x - size / 2,
        y: pos.y - size / 2,
        width: size,
        height: size,
      }}
      transition={{ type: "spring", stiffness: 520, damping: 36, mass: 0.28 }}
      style={{ background: "#111111" }}
    />
  );
}
