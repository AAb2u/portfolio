"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "../lib/smoothScroll";

export default function SmoothScroll() {
  useEffect(() => {
    // Respect users who ask the OS for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      autoRaf: true,
    });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
