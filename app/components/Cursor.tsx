"use client";
import { useEffect, useRef, useState } from "react";

type Mode = "default" | "hover" | "text" | "view";

const TEXT_TAGS = new Set([
  "p","h1","h2","h3","h4","h5","h6","span","li","label","em","strong","blockquote",
]);

export default function Cursor() {
  const wrapRef       = useRef<HTMLDivElement>(null);
  const labelWrapRef  = useRef<HTMLDivElement>(null);
  const ballRef       = useRef<HTMLDivElement>(null);
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

      const tf = `translate(${lerpPos.current.x}px, ${lerpPos.current.y}px)`;
      if (wrapRef.current)      wrapRef.current.style.transform      = tf;
      if (labelWrapRef.current) labelWrapRef.current.style.transform = tf;

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

  const size = mode === "view" ? 88 : mode === "hover" ? 40 : mode === "text" ? 60 : 12;

  return (
    <>
      <style>{`
        @keyframes cursor-pulse-view {
          0%   { transform: translate(-50%,-50%) scale(1);    opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(1.55); opacity: 0;   }
        }
        @keyframes cursor-pulse-hover {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.5; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0;   }
        }
      `}</style>

      {/* Cursor with mix-blend-mode: difference — inverts everything beneath */}
      <div
        ref={wrapRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ mixBlendMode: "difference" }}
      >
        {/* Pulse ring — view */}
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

        {/* Pulse ring — hover */}
        <div
          ref={hoverPulseRef}
          style={{
            position:     "absolute",
            width:         40,
            height:        40,
            top:          "50%",
            left:         "50%",
            borderRadius: "50%",
            border:       "1.5px solid #ffffff",
            opacity:       mode === "hover" ? 1 : 0,
            animation:     mode === "hover" ? "cursor-pulse-hover 0.9s ease-out infinite" : "none",
            transition:    "opacity 0.25s ease",
          }}
        />

        {/* Main ball — always white, difference blend inverts background */}
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
              "left 0.4s cubic-bezier(0.34,1,0.64,1)",
          }}
        />
      </div>

      {/* "View ↗" label — separate wrapper, no blend mode so text remains lisible */}
      <div
        ref={labelWrapRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width:          88,
          height:         88,
          marginTop:     -44,
          marginLeft:    -44,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          opacity:        mode === "view" ? 1 : 0,
          transition:     "opacity 0.25s ease",
        }}
      >
        <span style={{
          fontSize:      "0.75rem",
          fontWeight:    600,
          letterSpacing: "0.08em",
          whiteSpace:    "nowrap",
          userSelect:    "none",
          color:         "#ffffff",
          mixBlendMode:  "difference",
        }}>
          View ↗
        </span>
      </div>
    </>
  );
}
