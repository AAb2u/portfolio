"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const duration = 5000;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(p);

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = "";
        }, 300);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-foreground text-background flex flex-col"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Top label */}
          <div className="flex justify-between items-center px-24 pt-10">
            <span className="text-xs tracking-widest uppercase text-background/50">
              Portfolio
            </span>
            <span className="text-xs tracking-widest uppercase text-background/50">
              Loading
            </span>
          </div>

          {/* Large counter */}
          <div className="flex-1 flex items-end px-24 pb-10">
            <span className="text-[clamp(80px,14vw,200px)] font-light leading-none tabular-nums">
              {progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="mx-24 mb-12 h-px bg-background/20 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-background"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
