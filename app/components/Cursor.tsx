"use client";
import { useEffect, useRef, useState } from "react";

type Mode = "default" | "hover" | "text" | "view";

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
  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  const m = bodyBg.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    const [r, g, b] = m.map(Number);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  return 1;
}

const TEXT_TAGS = new Set(["p","h1","h2","h3","h4","h5","h6","span","li","label","em","strong","blockquote"]);

export default function Cursor() {
  const wrapRef       = useRef<HTMLDivElement>(null);
  const ballRef       = useRef<HTMLDivElement>(null);
  const textRef       = useRef<HTMLSpanElement>(null);
  const viewPulseRef  = useRef<HTMLDivElement>(null);
  const hoverPulseRef = useRef<HTMLDivElement>(null);
  const rawPos        = useRef({ x: -200, y: -200 });
  const lerpPos       = useRef({ x: -200, y: -200 });
  const raf           = useRef<number>(0);
  const modeRef       = useRef<Mode>("default");
  const [mode, setMode] = useState<Mode>("default");

  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY };
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-cursor='view']"))            setMode("view");
      else if (t.closest("a, button"))                  setMode("hover");
      else if (TEXT_TAGS.has(t.tagName?.toLowerCase())) setMode("text");
      else                                              setMode("default");
    };

    const out = () => setMode("default");

    const loop = () => {
      lerpPos.current.x += (rawPos.current.x - lerpPos.current.x) * 0.15;
      lerpPos.current.y += (rawPos.current.y - lerpPos.current.y) * 0.15;

      if (wrapRef.current) {
        wrapRef.current.style.transform =
          `translate(${lerpPos.current.x}px, ${lerpPos.current.y}px)`;
      }

      const lum     = luminanceAt(rawPos.current.x, rawPos.current.y);
      const isDark  = lum < 0.5;
      const clr     = isDark ? "#ffffff" : "#000000";
      const textClr = isDark ? "#000000" : "#ffffff";

      if (ballRef.current) {
        const isHollow = modeRef.current === "text" || modeRef.current === "view" || modeRef.current === "hover";
        if (isHollow) {
          ballRef.current.style.backgroundColor = "transparent";
          ballRef.current.style.border = `1.5px solid ${clr}`;
        } else {
          ballRef.current.style.backgroundColor = clr;
          ballRef.current.style.border = "none";
        }
      }
      if (viewPulseRef.current)  viewPulseRef.current.style.borderColor  = clr;
      if (hoverPulseRef.current) hoverPulseRef.current.style.borderColor = clr;
      if (textRef.current)       textRef.current.style.color = textClr;

      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout",  out);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout",  out);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const size = mode === "view" ? 88 : mode === "hover" ? 22 : mode === "text" ? 30 : 10;

  return (
    <>
      <style>{`
        @keyframes cursor-pulse-view {
          0%   { transform: translate(-50%, -50%) scale(1);    opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.55); opacity: 0;   }
        }
        @keyframes cursor-pulse-hover {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0;   }
        }
      `}</style>

      <div
        ref={wrapRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
      >
        {/* Pulse ring — view mode */}
        <div
          ref={viewPulseRef}
          style={{
            position:     "absolute",
            width:         88,
            height:        88,
            top:          "50%",
            left:         "50%",
            borderRadius: "50%",
            border:       "1.5px solid #ffffff",
            opacity:       mode === "view" ? 1 : 0,
            animation:     mode === "view" ? "cursor-pulse-view 1.2s ease-out infinite" : "none",
            transition:    "opacity 0.25s ease",
          }}
        />

        {/* Pulse ring — hover mode */}
        <div
          ref={hoverPulseRef}
          style={{
            position:     "absolute",
            width:         22,
            height:        22,
            top:          "50%",
            left:         "50%",
            borderRadius: "50%",
            border:       "1.5px solid #ffffff",
            opacity:       mode === "hover" ? 1 : 0,
            animation:     mode === "hover" ? "cursor-pulse-hover 0.9s ease-out infinite" : "none",
            transition:    "opacity 0.25s ease",
          }}
        />

        {/* Main ball */}
        <div
          ref={ballRef}
          style={{
            position:        "absolute",
            width:            size,
            height:           size,
            top:             -size / 2,
            left:            -size / 2,
            borderRadius:    "50%",
            backgroundColor: "#ffffff",
            transition:
              "width 0.4s cubic-bezier(0.34,1,0.64,1)," +
              "height 0.4s cubic-bezier(0.34,1,0.64,1)," +
              "top 0.4s cubic-bezier(0.34,1,0.64,1)," +
              "left 0.4s cubic-bezier(0.34,1,0.64,1)," +
              "background-color 0.2s ease," +
              "border 0.2s ease",
          }}
        />

        {/* "View ↗" label */}
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
              fontSize:      "0.75rem",
              fontWeight:    600,
              letterSpacing: "0.08em",
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
    </>
  );
}
