"use client";
import { useEffect, useRef, useState } from "react";

type Mode = "default" | "hover" | "view";

// Walk up the DOM from (x,y), find the first opaque background, return its luminance [0–1]
function luminanceAt(x: number, y: number): number {
  let el = document.elementFromPoint(x, y) as HTMLElement | null;
  while (el && el !== document.body) {
    const bg = window.getComputedStyle(el).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
      const parts = bg.match(/[\d.]+/g);
      if (parts && parts.length >= 3) {
        const [r, g, b] = parts.map(Number);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }
    }
    el = el.parentElement;
  }
  // Fall back to body background
  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  const m = bodyBg.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    const [r, g, b] = m.map(Number);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  return 1; // assume light
}

export default function Cursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const rawPos  = useRef({ x: -200, y: -200 });
  const lerpPos = useRef({ x: -200, y: -200 });
  const raf     = useRef<number>(0);
  const [mode, setMode] = useState<Mode>("default");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY };
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-cursor='view']"))  setMode("view");
      else if (t.closest("a, button"))        setMode("hover");
      else                                    setMode("default");
    };

    const out = () => setMode("default");

    const loop = () => {
      lerpPos.current.x += (rawPos.current.x - lerpPos.current.x) * 0.15;
      lerpPos.current.y += (rawPos.current.y - lerpPos.current.y) * 0.15;

      if (wrapRef.current) {
        wrapRef.current.style.transform =
          `translate(${lerpPos.current.x}px, ${lerpPos.current.y}px)`;
      }

      // Detect real background luminance → choose cursor color
      const lum     = luminanceAt(rawPos.current.x, rawPos.current.y);
      const isDark  = lum < 0.5;
      const ballClr = isDark ? "#ffffff" : "#000000";
      const textClr = isDark ? "#000000" : "#ffffff";

      if (ballRef.current) ballRef.current.style.backgroundColor = ballClr;
      if (textRef.current) textRef.current.style.color = textClr;

      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const size = mode === "view" ? 88 : mode === "hover" ? 22 : 10;

  return (
    <div
      ref={wrapRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
    >
      {/* Ball */}
      <div
        ref={ballRef}
        style={{
          position:     "absolute",
          width:         size,
          height:        size,
          top:          -size / 2,
          left:         -size / 2,
          borderRadius: "50%",
          backgroundColor: "#000000",
          transition:
            "width 0.4s cubic-bezier(0.34,1,0.64,1)," +
            "height 0.4s cubic-bezier(0.34,1,0.64,1)," +
            "top 0.4s cubic-bezier(0.34,1,0.64,1)," +
            "left 0.4s cubic-bezier(0.34,1,0.64,1)," +
            "background-color 0.25s ease",
        }}
      />

      {/* "View ↗" label — couche séparée */}
      <div
        style={{
          position: "absolute",
          width:  88,
          height: 88,
          top:   -44,
          left:  -44,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          opacity:    mode === "view" ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        <span
          ref={textRef}
          style={{
            fontSize:      "0.7rem",
            fontWeight:    500,
            letterSpacing: "0.05em",
            whiteSpace:    "nowrap",
            userSelect:    "none",
            color:         "#ffffff",
            transition:    "color 0.25s ease",
          }}
        >
          View ↗
        </span>
      </div>
    </div>
  );
}
