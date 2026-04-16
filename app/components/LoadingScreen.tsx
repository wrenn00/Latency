"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface LoadingScreenProps {
  onDone: () => void;
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [progress, setProgress] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Kick off the fill line shortly after mount
    const t1 = setTimeout(() => setProgress(true), 60);
    // At 1.5s, begin exit fade (400ms) then call onDone
    const t2 = setTimeout(() => setExiting(true), 1500);
    const t3 = setTimeout(onDone, 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
          style={{ background: "#000000" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {/* Wordmark */}
          <motion.p
            className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.3em] uppercase"
            style={{ color: "var(--fg)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          >
            LATENCY
          </motion.p>

          {/* Progress bar */}
          <div
            className="relative mt-5"
            style={{ width: 120, height: 1, background: "var(--fg-subtle)" }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full"
              style={{ background: "var(--accent)" }}
              initial={{ width: "0%" }}
              animate={{ width: progress ? "100%" : "0%" }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          {/* "loading." label */}
          <motion.p
            className="mt-4 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.18em]"
            style={{ color: "var(--fg-muted)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
          >
            loading
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            >
              .
            </motion.span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
