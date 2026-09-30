"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import CircleOverlay, { CloseButton } from "./CircleOverlay";
import { closeOverlay, getOverlayState, subscribeOverlay } from "../lib/overlays";
import { play, preloadTyping } from "../lib/sound";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full border-b border-[#111111]/20 bg-transparent py-3 text-[clamp(18px,2.2vw,26px)] font-light outline-none transition-colors placeholder:text-[#111111]/30 focus:border-[#111111]";

// Opened by "Let's talk" (Contact) and "Or have chat" (Hero): the button grows
// into this full-screen form and shrinks back into it on close.
export default function ContactForm() {
  const { kind, origin } = useSyncExternalStore(subscribeOverlay, getOverlayState, getOverlayState);
  const open = kind === "contact";
  const [status, setStatus] = useState<Status>("idle");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    preloadTyping();
    const focus = window.setTimeout(() => firstFieldRef.current?.focus(), 900);
    return () => window.clearTimeout(focus);
  }, [open]);

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
      play(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
      play("error");
    }
  };

  // Typewriter feedback while writing the message (typing keys only)
  const typewriterSound = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag !== "INPUT" && tag !== "TEXTAREA") return;
    if (e.key === " ") play("space");
    else if (e.key === "Enter") play("return");
    else if (e.key === "Backspace" || e.key === "Delete") play("backspace");
    else if (e.key.length === 1) play("key");
  };

  return (
    <CircleOverlay open={open} origin={origin} onClose={closeOverlay} label="Contact form" onExitComplete={() => setStatus("idle")}>
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-6 pb-10 pt-20 sm:px-8 sm:pt-16">
        <div className="flex items-start justify-between gap-6">
          <h2 className="text-[clamp(40px,8vw,96px)] font-light leading-[0.95]">
            Tell me about<br />your project.
          </h2>
          <CloseButton onClick={closeOverlay} />
        </div>

        {status === "sent" ? (
          <div className="mt-16 flex flex-1 flex-col items-start gap-6">
            <p className="text-[clamp(22px,3vw,34px)] font-light">Thanks — your message is on its way. I&apos;ll get back to you soon.</p>
            <button
              type="button"
              onClick={closeOverlay}
              className="rounded-full bg-[#111111] px-6 py-3 text-sm font-medium text-[#E9E9E3]"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} onKeyDown={typewriterSound} className="mt-12 grid flex-1 content-start gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-x-10">
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
      </div>
    </CircleOverlay>
  );
}
