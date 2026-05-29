"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextReveal from "./TextReveal";

const links = [
  { label: "About",        href: "#about" },
  { label: "Work",         href: "#work" },
  { label: "Process",      href: "#process" },
  { label: "Drop me a line", href: "#contact" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Turn name white when contact section is visible
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnDark(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 md:px-24 py-5"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.span
          className="text-sm font-medium"
          animate={{ color: onDark ? "#E9E9E3" : "var(--color-foreground)" }}
          transition={{ duration: 0.3 }}
        >
          Abdenour Akrour
        </motion.span>

        <div className="flex items-center gap-8">
          {/* Nav links — visible at top, hidden on scroll */}
          <AnimatePresence>
            {!scrolled && (
              <motion.nav
                key="links"
                className="flex items-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {links.map((l, i) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    className="text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                  >
                    <TextReveal text={l.label} duration={600} />
                  </motion.a>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Hamburger — appears on scroll */}
          <AnimatePresence>
            {scrolled && (
              <motion.button
                key="burger"
                onClick={() => setOpen((o) => !o)}
                className="flex flex-col items-end justify-center"
                style={{ width: 40, height: 40, gap: 7, background: "none", border: "none", padding: 0 }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.25, ease: EASE }}
                aria-label="Menu"
              >
                <motion.span
                  className="block bg-foreground"
                  style={{ height: 1.5, borderRadius: 2 }}
                  animate={open ? { width: 24, rotate: 45, y: 8.5 } : { width: 28, rotate: 0, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
                <motion.span
                  className="block bg-foreground"
                  style={{ height: 1.5, borderRadius: 2 }}
                  animate={open ? { width: 24, rotate: -45, y: -8.5 } : { width: 20, rotate: 0, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed top-0 right-0 h-full z-50 flex flex-col justify-between py-10 px-10"
            style={{ backgroundColor: "#2C2C28", color: "#E9E9E3", width: "clamp(280px, 35vw, 480px)" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Close button */}
            <div className="flex justify-end">
              <button
                onClick={close}
                className="w-9 h-9 rounded-full border flex items-center justify-center"
                style={{ borderColor: "rgba(233,233,227,0.2)" }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#E9E9E3" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M1 1l10 10M11 1L1 11" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-1">
              {links.map((l, i) => (
                <div key={l.label} style={{ overflow: "hidden" }}>
                  <motion.a
                    href={l.href}
                    onClick={close}
                    className="block font-medium leading-tight tracking-tight hover:opacity-50 transition-opacity"
                    style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.45, ease: EASE, delay: i * 0.06 }}
                  >
                    <TextReveal text={l.label} duration={700} />
                  </motion.a>
                </div>
              ))}
            </nav>

            {/* Footer */}
            <motion.div
              className="flex flex-col gap-1 text-xs"
              style={{ color: "rgba(233,233,227,0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <span>Abdenour Akrour</span>
              <span>Portfolio 2025</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
