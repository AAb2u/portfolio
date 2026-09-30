"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lockScroll } from "../lib/smoothScroll";
import { play } from "../lib/sound";
import type { OverlayOrigin } from "../lib/overlays";

const EASE = [0.76, 0, 0.24, 1] as const;
const noopSubscribe = () => () => {};

// A real circle centred on the clicked button, scaled from the button's size up
// to the farthest viewport corner (transform-only, so it stays smooth). The
// content fades in once the circle has nearly covered the screen, and fades out
// before the circle shrinks back into the button.
export default function CircleOverlay({
  open,
  origin,
  onClose,
  label,
  color = "#E9E9E3",
  onExitComplete,
  children,
}: {
  open: boolean;
  origin: OverlayOrigin;
  onClose: () => void;
  label: string;
  color?: string;
  onExitComplete?: () => void;
  children: React.ReactNode;
}) {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const { x, y, r } = origin;
  const fullR = mounted
    ? Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)))
    : 1;
  const closedScale = Math.min(r / fullR, 1);

  // Whoosh in time with the circle growing / shrinking (not on first mount)
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open !== wasOpen.current) play(open ? "open" : "close");
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <div
          key="circle-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-[70] overflow-hidden"
          style={{ color: "#111111" }}
        >
          <motion.div
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: x - fullR,
              top: y - fullR,
              width: fullR * 2,
              height: fullR * 2,
              backgroundColor: color,
              // Edge + soft shadow so the circle still reads over light sections (Hero)
              boxShadow: "0 0 0 1px rgba(17,17,17,0.08), 0 40px 120px -30px rgba(17,17,17,0.35)",
              willChange: "transform",
            }}
            initial={{ scale: closedScale }}
            animate={{ scale: 1, transition: { duration: 0.9, ease: EASE } }}
            exit={{ scale: closedScale, transition: { duration: 0.8, delay: 0.15, ease: EASE } }}
          />

          <div data-lenis-prevent className="absolute inset-0 overflow-y-auto">
            <motion.div
              className="min-h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.7, ease: EASE } }}
              exit={{ opacity: 0, y: 0, transition: { duration: 0.2 } }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#111111]/20 text-xl transition-colors hover:bg-[#111111] hover:text-[#E9E9E3]"
    >
      ×
    </button>
  );
}
