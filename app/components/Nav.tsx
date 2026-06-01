"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import TextReveal from "./TextReveal";

const links = [
  { label: "About",          href: "#about" },
  { label: "Work",           href: "#work" },
  { label: "Process",        href: "#process" },
  { label: "Drop me a line", href: "#contact" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Nav() {
  const [scrolled, setScrolled]           = useState(false);
  const [onDark, setOnDark]               = useState(false);
  const [open, setOpen]                   = useState(false);
  const [burgerHovered, setBurgerHovered] = useState(false);

  /* ── Magnetic spring ── */
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const springX = useSpring(magnetX, { stiffness: 160, damping: 14, mass: 0.6 });
  const springY = useSpring(magnetY, { stiffness: 160, damping: 14, mass: 0.6 });
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contact = document.getElementById("contact");
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      if (contact) {
        // true only when the dark section's top edge reaches the navbar (~64px)
        setOnDark(contact.getBoundingClientRect().top < 64);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!scrolled) {
      magnetX.set(0);
      magnetY.set(0);
      setBurgerHovered(false);
    }
  }, [scrolled, magnetX, magnetY]);

  const close = () => setOpen(false);

  const handleMagnetMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoneRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    magnetX.set(dx * 0.38);
    magnetY.set(dy * 0.38);
    setBurgerHovered(true);
  };

  const handleMagnetLeave = () => {
    magnetX.set(0);
    magnetY.set(0);
    setBurgerHovered(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-12 md:px-24 py-5"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.span
          className="text-sm font-medium"
          animate={{ color: onDark ? "#E9E9E3" : "#111111" }}
          transition={{ duration: 0.4 }}
        >
          Abdenour Akrour
        </motion.span>

        <div className="flex items-center gap-8" style={{ position: "relative" }}>

          {/* Nav links — crossfade out on scroll */}
          <motion.nav
            className="flex items-center gap-8"
            animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? -6 : 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ pointerEvents: scrolled ? "none" : "auto" }}
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

          {/* ── Magnetic burger zone ── */}
          <div
            ref={zoneRef}
            onMouseMove={handleMagnetMove}
            onMouseLeave={handleMagnetLeave}
            onClick={() => setOpen((o) => !o)}
            style={{
              position: "absolute",
              right: 0,
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              cursor: "pointer",
              pointerEvents: scrolled ? "auto" : "none",
            }}
          >
            <motion.div
              style={{
                x: springX,
                y: springY,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                gap: 7,
              }}
              animate={{ opacity: scrolled ? 1 : 0, scale: scrolled ? 1 : 0.8 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              whileTap={{ scale: 0.88 }}
            >
              <motion.span
                style={{ display: "block", height: 1.5, borderRadius: 2, backgroundColor: onDark ? "#E9E9E3" : "#111111" }}
                animate={
                  open            ? { width: 22, rotate: 45,  y: 4.25 }
                  : burgerHovered ? { width: 32, rotate: 0,   y: 0    }
                  :                 { width: 26, rotate: 0,   y: 0    }
                }
                transition={{ duration: 0.35, ease: EASE }}
              />
              <motion.span
                style={{ display: "block", height: 1.5, borderRadius: 2, backgroundColor: onDark ? "#E9E9E3" : "#111111" }}
                animate={
                  open            ? { width: 22, rotate: -45, y: -4.25 }
                  : burgerHovered ? { width: 22, rotate: 0,   y: 0     }
                  :                 { width: 18, rotate: 0,   y: 0     }
                }
                transition={{ duration: 0.35, ease: EASE }}
              />
            </motion.div>
          </div>

        </div>
      </motion.header>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(17,17,17,0.15)" }}
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
            className="fixed top-0 right-0 h-full z-[55] flex flex-col justify-between py-10 px-10"
            style={{
              backgroundColor: "#E9E9E3",
              color: "#111111",
              borderLeft: "1px solid #DDDDD7",
              width: "clamp(280px, 35vw, 480px)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div style={{ height: 64 }} />

            <nav className="flex flex-col gap-1">
              {links.map((l, i) => (
                <div key={l.label} style={{ overflow: "hidden" }}>
                  <motion.a
                    href={l.href}
                    onClick={close}
                    className="block font-medium leading-tight tracking-tight"
                    style={{ fontSize: "clamp(28px, 4vw, 52px)", color: "#111111" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.3")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
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

            <motion.div
              className="flex flex-col gap-1 text-xs"
              style={{ color: "#888888" }}
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
