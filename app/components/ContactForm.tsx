"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lockScroll } from "../lib/smoothScroll";

const BG = "#111111";
const FG = "#E9E9E3";
const EASE = [0.76, 0, 0.24, 1] as const;

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full border-b border-[#111111]/20 bg-transparent py-3 text-[clamp(18px,2.2vw,26px)] font-light outline-none transition-colors placeholder:text-[#111111]/30 focus:border-[#111111]";

// The white "Let's talk" circle grows from its own position into a full-screen
// contact form (clip-path circle), and shrinks back into it on close.
const noopSubscribe = () => () => {};

export default function ContactForm({
  open,
  origin,
  onClose,
}: {
  open: boolean;
  /** Centre of the "Let's talk" circle, kept after close so it shrinks back into it */
  origin: { x: number; y: number; r: number };
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const { x, y, r } = origin;
  // A real circle centred on the button, scaled from the button's size up to the
  // distance of the farthest viewport corner (transform-only, so it stays smooth).
  const fullR = mounted
    ? Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)))
    : 1;
  const closedScale = Math.min(r / fullR, 1);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const focus = window.setTimeout(() => firstFieldRef.current?.focus(), 650);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focus);
    };
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence onExitComplete={() => setStatus("idle")}>
      {open && (
        <div
          key="contact-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Contact form"
          className="fixed inset-0 z-[70] overflow-hidden"
          style={{ color: BG }}
        >
          <motion.div
            aria-hidden
            className="absolute rounded-full"
            style={{
              left: x - fullR,
              top: y - fullR,
              width: fullR * 2,
              height: fullR * 2,
              backgroundColor: FG,
              willChange: "transform",
            }}
            initial={{ scale: closedScale }}
            animate={{ scale: 1, transition: { duration: 0.9, ease: EASE } }}
            exit={{ scale: closedScale, transition: { duration: 0.8, delay: 0.15, ease: EASE } }}
          />

          <div data-lenis-prevent className="absolute inset-0 overflow-y-auto">
          <motion.div
            className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-6 pb-10 pt-20 sm:px-8 sm:pt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.7, ease: EASE } }}
            exit={{ opacity: 0, y: 0, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start justify-between gap-6">
              <h2 className="text-[clamp(40px,8vw,96px)] font-light leading-[0.95]">
                Tell me about<br />your project.
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close contact form"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#111111]/20 text-xl transition-colors hover:bg-[#111111] hover:text-[#E9E9E3]"
              >
                ×
              </button>
            </div>

            {status === "sent" ? (
              <div className="mt-16 flex flex-1 flex-col items-start gap-6">
                <p className="text-[clamp(22px,3vw,34px)] font-light">Thanks — your message is on its way. I&apos;ll get back to you soon.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-[#111111] px-6 py-3 text-sm font-medium text-[#E9E9E3]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-12 grid flex-1 content-start gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-x-10">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#111111]/50">First name</span>
                  <input ref={firstFieldRef} name="firstName" required maxLength={80} autoComplete="given-name" className={inputClass} placeholder="John" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#111111]/50">Last name</span>
                  <input name="lastName" required maxLength={80} autoComplete="family-name" className={inputClass} placeholder="Doe" />
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#111111]/50">Email</span>
                  <input name="email" type="email" required maxLength={200} autoComplete="email" className={inputClass} placeholder="john@example.com" />
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#111111]/50">Message</span>
                  <textarea name="message" required maxLength={5000} rows={4} className={`${inputClass} resize-none`} placeholder="Hello Abdenour, I'd like to…" />
                </label>

                <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex h-[clamp(96px,9vw,130px)] w-[clamp(96px,9vw,130px)] items-center justify-center rounded-full bg-[#111111] text-[13px] font-semibold text-[#E9E9E3] transition-transform hover:scale-105 disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Send"}
                  </button>
                  {status === "error" && (
                    <p className="text-sm text-[#111111]/60">
                      Something went wrong. Email me directly at{" "}
                      <a href="mailto:akrourabdenour9@gmail.com" className="underline underline-offset-4">akrourabdenour9@gmail.com</a>
                    </p>
                  )}
                </div>
              </form>
            )}
          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
