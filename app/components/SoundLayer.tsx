"use client";

import { useEffect, useSyncExternalStore } from "react";
import { initSound, isSoundEnabled, play, setSoundEnabled, subscribeSound } from "../lib/sound";

// Global UI sounds: a soft tap on every click. Hover ticks are opt-in only
// (data-sound="hover" or "row"), so the page never feels noisy.
// data-sound="none" silences an element entirely.
export default function SoundLayer() {
  const enabled = useSyncExternalStore(subscribeSound, isSoundEnabled, () => true);

  useEffect(() => {
    const cleanup = initSound();
    const canHover = window.matchMedia("(hover: hover)").matches;
    let hovered: Element | null = null;

    const target = (e: Event) =>
      (e.target as Element | null)?.closest?.("a, button, [data-sound]") ?? null;

    const onOver = (e: PointerEvent) => {
      if (!canHover || e.pointerType !== "mouse") return;
      const el = target(e);
      if (el === hovered) return;
      hovered = el;
      const kind = (el as HTMLElement | null)?.dataset.sound;
      if (kind === "row" || kind === "hover") play(kind);
    };

    const onClick = (e: MouseEvent) => {
      const el = target(e);
      if (!el || (el as HTMLElement).dataset.sound === "none") return;
      play("click");
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      cleanup();
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return (
    <button
      type="button"
      data-sound="none"
      onClick={() => setSoundEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute sound effects" : "Turn sound effects on"}
      className="fixed bottom-5 right-5 z-[65] flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white mix-blend-difference sm:bottom-6 sm:right-8"
    >
      <span aria-hidden className="flex h-3 items-end gap-[2px]">
        {[0.55, 1, 0.7, 0.4].map((h, i) => (
          <span
            key={i}
            className="w-[2px] origin-bottom bg-current"
            style={{
              height: "100%",
              transform: `scaleY(${enabled ? h : 0.15})`,
              animation: enabled ? `sound-bar 0.9s ${i * 0.12}s ease-in-out infinite alternate` : "none",
              transition: "transform 0.3s ease",
            }}
          />
        ))}
      </span>
      Sound {enabled ? "on" : "off"}
    </button>
  );
}
