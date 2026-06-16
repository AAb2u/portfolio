"use client";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const links = [
  { label: "About",          href: "#about" },
  { label: "Work",           href: "#work" },
  { label: "Process",        href: "#process" },
  { label: "Drop me a line", href: "#contact" },
];

const EASE = [0.76, 0, 0.24, 1] as const;
const MOBILE_QUERY = "(max-width: 767px)";
const MORPH_DISTANCE = 34;

const navVariants = {
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.18 },
  },
  compact: {
    transition: { staggerChildren: 0.035, staggerDirection: -1 },
  },
};

const navLinkVariants = {
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scaleX: 1,
    filter: "blur(0px)",
    transition: { duration: 0.46, ease: EASE },
  },
  compact: (index: number) => ({
    opacity: 0,
    x: MORPH_DISTANCE * (links.length - index),
    y: index % 2 === 0 ? -1 : 1,
    scaleX: 0.06,
    filter: "blur(5px)",
    transition: { duration: 0.46, ease: EASE },
  }),
};

function subscribeToMobileNav(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getMobileNavSnapshot() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;
}

function MagneticNavLink({
  label,
  href,
  index,
}: {
  label: string;
  href: string;
  index: number;
}) {
  const linkX = useMotionValue(0);
  const linkY = useMotionValue(0);
  const springLinkX = useSpring(linkX, { stiffness: 210, damping: 14, mass: 0.45 });
  const springLinkY = useSpring(linkY, { stiffness: 210, damping: 14, mass: 0.45 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    linkX.set(dx * 0.48);
    linkY.set(dy * 0.62);
  };

  const handleLeave = () => {
    linkX.set(0);
    linkY.set(0);
  };

  return (
    <motion.span
      custom={index}
      variants={navLinkVariants}
      style={{ display: "inline-block", transformOrigin: "right center", willChange: "transform, opacity, filter" }}
    >
      <motion.a
        href={href}
        className="-mx-4 -my-3 block px-4 py-3 text-sm"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ x: springLinkX, y: springLinkY, willChange: "transform" }}
        whileHover={{ scale: 1.09 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {label}
      </motion.a>
    </motion.span>
  );
}

export default function Nav() {
  const [scrolled, setScrolled]           = useState(false);
  const [open, setOpen]                   = useState(false);
  const [showBurger, setShowBurger]       = useState(false);
  const [burgerHovered, setBurgerHovered] = useState(false);
  const mobileNav                         = useSyncExternalStore(subscribeToMobileNav, getMobileNavSnapshot, () => false);

  /* ── Magnetic spring ── */
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const springX = useSpring(magnetX, { stiffness: 160, damping: 14, mass: 0.6 });
  const springY = useSpring(magnetY, { stiffness: 160, damping: 14, mass: 0.6 });
  const zoneRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (mobileNav) {
      const frame = requestAnimationFrame(() => setShowBurger(true));
      return () => cancelAnimationFrame(frame);
    }

    if (scrolled) {
      const id = window.setTimeout(() => setShowBurger(true), 430);
      return () => window.clearTimeout(id);
    }

    const frame = requestAnimationFrame(() => setShowBurger(false));
    return () => cancelAnimationFrame(frame);
  }, [mobileNav, scrolled]);

  useEffect(() => {
    if (!scrolled) {
      const frame = requestAnimationFrame(() => {
        magnetX.set(0);
        magnetY.set(0);
        setBurgerHovered(false);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [scrolled, magnetX, magnetY]);

  const close = () => setOpen(false);

  const handleMagnetMove = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        className="fixed top-0 left-0 right-0 z-[60] flex w-screen items-center justify-between px-5 py-5 text-white sm:px-8 md:px-24"
        style={{ mixBlendMode: "difference" }}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.span className="text-sm font-medium">
          Abdenour Akrour
        </motion.span>

        <div className="flex items-center gap-8" style={{ position: "relative" }}>

          {/* Nav links — compress toward the burger on scroll */}
          <motion.nav
            className="hidden items-center gap-8 md:flex"
            variants={navVariants}
            initial="visible"
            animate={scrolled ? "compact" : "visible"}
            style={{ pointerEvents: scrolled ? "none" : "auto" }}
          >
            {links.map((l, i) => (
              <MagneticNavLink
                key={l.label}
                label={l.label}
                href={l.href}
                index={i}
              />
            ))}
          </motion.nav>

          {/* ── Magnetic burger zone ── */}
          <button
            type="button"
            ref={zoneRef}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-hidden={!showBurger}
            tabIndex={showBurger ? 0 : -1}
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
              padding: 0,
              border: 0,
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
              pointerEvents: showBurger ? "auto" : "none",
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
              animate={{
                opacity: showBurger ? 1 : 0,
                scale: showBurger ? 1 : 0.72,
                x: showBurger ? 0 : 10,
              }}
              transition={{ duration: 0.32, ease: EASE }}
              whileTap={{ scale: 0.88 }}
            >
              <motion.span
                style={{ display: "block", height: 1.5, borderRadius: 2, backgroundColor: "currentColor" }}
                animate={
                  open            ? { width: 22, rotate: 45,  y: 4.25 }
                  : burgerHovered ? { width: 32, rotate: 0,   y: 0    }
                  :                 { width: 26, rotate: 0,   y: 0    }
                }
                transition={{ duration: 0.35, ease: EASE }}
              />
              <motion.span
                style={{ display: "block", height: 1.5, borderRadius: 2, backgroundColor: "currentColor" }}
                animate={
                  open            ? { width: 22, rotate: -45, y: -4.25 }
                  : burgerHovered ? { width: 22, rotate: 0,   y: 0     }
                  :                 { width: 18, rotate: 0,   y: 0     }
                }
                transition={{ duration: 0.35, ease: EASE }}
              />
            </motion.div>
          </button>

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
                    {l.label}
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
