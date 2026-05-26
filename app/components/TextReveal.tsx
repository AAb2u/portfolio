"use client";
import { useRef, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#%*+-?/\\|$&";

export default function TextReveal({
  text,
  className = "",
  duration = 900,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef<number>(0);

  const start = useCallback(() => {
    const t0 = Date.now();
    const nonSpaceCount = text.split("").filter((c) => c !== " ").length;
    let nonSpaceIndex = 0;

    const tick = () => {
      if (!ref.current) return;
      const elapsed = Date.now() - t0;
      const progress = Math.min(elapsed / duration, 1);
      // First 30% = full scramble, then resolve left to right
      const resolveProgress = Math.max(0, (progress - 0.3) / 0.7);
      nonSpaceIndex = 0;

      ref.current.textContent = text
        .split("")
        .map((char) => {
          if (char === " ") return " ";
          const idx = nonSpaceIndex++;
          if (idx / nonSpaceCount <= resolveProgress) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  }, [text, duration]);

  const reset = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (ref.current) ref.current.textContent = text;
  }, [text]);

  return (
    <span ref={ref} className={className} onMouseEnter={start} onMouseLeave={reset}>
      {text}
    </span>
  );
}
