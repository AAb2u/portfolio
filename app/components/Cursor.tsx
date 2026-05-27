"use client";
import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "hover" | "view";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const [mode, setMode] = useState<CursorMode>("default");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const update = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor='view']")) {
        setMode("view");
      } else if (target.closest("a, button")) {
        setMode("hover");
      } else {
        setMode("default");
      }
    };

    const onLeave = () => setMode("default");

    const loop = () => {
      current.current.x += (pos.current.x - current.current.x) * 0.15;
      current.current.y += (pos.current.y - current.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      }

      if (ballRef.current) {
        const el = document.elementFromPoint(pos.current.x, pos.current.y);
        const isDark = !!el?.closest("[data-cursor-theme='dark']");
        ballRef.current.style.backgroundColor = isDark ? "#ffffff" : "#111111";
        ballRef.current.style.color = isDark ? "#111111" : "#ffffff";
      }

      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", update);
    window.addEventListener("mouseout", onLeave);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", update);
      window.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const size = mode === "view" ? 88 : mode === "hover" ? 22 : 10;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
    >
      <div
        ref={ballRef}
        className="rounded-full flex items-center justify-center overflow-hidden"
        style={{
          width: size,
          height: size,
          backgroundColor: "#111111",
          color: "#ffffff",
          transition: "width 0.4s cubic-bezier(0.34,1,0.64,1), height 0.4s cubic-bezier(0.34,1,0.64,1), background-color 0.5s ease, color 0.5s ease",
        }}
      >
        <span
          style={{
            fontSize: mode === "view" ? "0.7rem" : "0",
            opacity: mode === "view" ? 1 : 0,
            transition: "font-size 0.3s cubic-bezier(0.34,1,0.64,1), opacity 0.3s ease",
            fontWeight: 500,
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          View ↗
        </span>
      </div>
    </div>
  );
}
