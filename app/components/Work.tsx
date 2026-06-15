"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextReveal from "./TextReveal";

const HOVER_BZ = "cubic-bezier(0.7, 0, 0.3, 1)";
const EXPAND_BZ = "cubic-bezier(0.34, 1, 0.64, 1)";
const COLLAPSE_BZ = "cubic-bezier(0.36, 0, 0.66, 0)";

const projects = [
  {
    name: "EasySave",
    desc: ".NET backup program",
    tags: "C#, .NET, Software Engineering",
    year: "/26",
    href: "https://github.com/RamiMohamed12/EasySave-Groupe1",
    image: "/projects/EasySave.png",
  },
  {
    name: "Alina",
    desc: "Digital agency — design, development & strategy",
    tags: "Web Design, Next.js, Vercel",
    year: "/25",
    href: "https://alina-web-site-six.vercel.app",
    image: "/api/screenshot?url=https://alina-web-site-six.vercel.app",
  },
  {
    name: "PV Solution",
    desc: "Business solutions website",
    tags: "Web Design, Web Development",
    year: "/25",
    href: "https://pv-solution.com",
    image: "/api/screenshot?url=https://pv-solution.com",
  },
  {
    name: "Portfolio",
    desc: "This personal portfolio site",
    tags: "TypeScript, Next.js, Tailwind CSS",
    year: "/25",
    href: "https://portfolio-gilt-five-45.vercel.app/",
    image: "/projects/portfolio.png",
  },
];

export default function Work() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const rawPos = useRef({ x: 0, y: 0 });
  const lerpPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawPos.current = { x: e.clientX, y: e.clientY };
    };

    const detectHover = () => {
      const el = document.elementFromPoint(rawPos.current.x, rawPos.current.y);
      if (!el) return;
      const anchor = (el as HTMLElement).closest("[data-project-index]");
      if (anchor) {
        const idx = parseInt((anchor as HTMLElement).dataset.projectIndex ?? "-1");
        lerpPos.current = { ...rawPos.current };
        setHoveredIndex(idx);
      } else {
        setHoveredIndex(null);
      }
    };

    const loop = () => {
      lerpPos.current.x += (rawPos.current.x - lerpPos.current.x) * 0.083;
      lerpPos.current.y += (rawPos.current.y - lerpPos.current.y) * 0.083;
      if (imageWrapRef.current) {
        imageWrapRef.current.style.left = `${lerpPos.current.x}px`;
        imageWrapRef.current.style.top = `${lerpPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", detectHover, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", detectHover);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const isAnyHovered = hoveredIndex !== null;

  return (
    <section
      id="work"
      className="relative flex flex-col gap-8 overflow-hidden border-t border-[#111111]/15 bg-[#eeeeeb] px-8 py-24 text-[#252525] sm:px-24 sm:py-28"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden sm:grid"
        style={{
          gridTemplateColumns: "minmax(54px,0.55fr) minmax(0,2.2fr) minmax(0,1.35fr) minmax(112px,0.78fr)",
          gridTemplateRows: `180px repeat(${projects.length}, minmax(118px, 1fr)) 120px`,
        }}
      >
        {Array.from({ length: (projects.length + 2) * 4 }).map((_, index) => (
          <span key={index} className="border-r border-[#111111]/12 last:border-r-0" />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid grid-cols-[28px_1fr_28px] sm:hidden"
        style={{
          gridTemplateRows: `140px repeat(${projects.length}, minmax(124px, 1fr)) 96px`,
        }}
      >
        {Array.from({ length: (projects.length + 2) * 3 }).map((_, index) => (
          <span key={index} className="border-r border-[#111111]/12 last:border-r-0" />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex items-baseline justify-between"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold">
          Selected Work<sup className="text-xs ml-0.5">({projects.length})</sup>
        </h2>
        <span className="text-[11px] text-muted">Click to access ↗</span>
      </motion.div>

      {/* Project list */}
      <div className="relative z-10">
        <div className="h-px w-full bg-[#111111]/15" />

        {projects.map((p, i) => (
          <div key={p.name}>
            {/* motion.div handles entrance; <a> handles hover opacity independently */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
            >
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block min-h-[210px] px-0 py-10 sm:min-h-[180px] sm:px-16"
              data-cursor="view"
              data-project-index={i}
              onMouseEnter={() => {
                lerpPos.current = { ...rawPos.current };
                setHoveredIndex(i);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                opacity: isAnyHovered && hoveredIndex !== i ? 0.2 : 1,
                transition: `opacity 0.4s ${HOVER_BZ}`,
              }}
            >
              {/* Left accent bar */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  height: "55%",
                  width: "2px",
                  background: "currentColor",
                  transform: `translateY(-50%) scaleY(${hoveredIndex === i ? 1 : 0})`,
                  transformOrigin: "center",
                  transition: `transform 0.45s ${HOVER_BZ}`,
                }}
              />

              {/* Left: name + desc */}
              <div className="absolute inset-0 flex min-w-0 flex-col items-center justify-center gap-1.5 px-4 text-center sm:px-40">
                <h3
                  className="max-w-full text-[clamp(48px,5.5vw,80px)] font-normal leading-none"
                  style={{
                    scale: hoveredIndex === i ? 1.09 : isAnyHovered ? 0.88 : 1,
                    transformOrigin: "center",
                    letterSpacing: hoveredIndex === i ? "-0.045em" : "-0.02em",
                    transition: `scale 0.45s ${HOVER_BZ}, letter-spacing 0.45s ${HOVER_BZ}`,
                  }}
                >
                  {p.name}
                </h3>
                <span
                  className="text-sm text-foreground/50"
                  style={{
                    opacity: hoveredIndex === i ? 1 : 0,
                    transform: `translateY(${hoveredIndex === i ? 0 : -8}px)`,
                    transition: `opacity 0.3s ease, transform 0.3s ease`,
                    pointerEvents: "none",
                  }}
                >
                  {p.desc}
                </span>
              </div>

              {/* Right: tags + year */}
              <div className="absolute bottom-6 left-0 right-0 flex min-w-0 flex-col items-center gap-1.5 px-4 text-center sm:bottom-auto sm:left-auto sm:right-16 sm:top-1/2 sm:max-w-[260px] sm:-translate-y-1/2 sm:items-end sm:text-right">
                <span
                  className="text-sm text-foreground/70 tracking-wide"
                  style={{
                    transform: `translateY(${hoveredIndex === i ? -4 : 0}px)`,
                    transition: `transform 0.35s ${HOVER_BZ}`,
                  }}
                >
                  {p.tags}
                </span>
                <span
                  className="text-[11px] text-foreground/35 tracking-[0.18em] uppercase"
                  style={{
                    opacity: hoveredIndex === i ? 1 : 0,
                    transform: `translateY(${hoveredIndex === i ? 0 : 6}px)`,
                    transition: `opacity 0.3s ease 0.06s, transform 0.3s ease 0.06s`,
                    pointerEvents: "none",
                  }}
                >
                  {p.year}
                </span>
              </div>
            </a>
            </motion.div>
            <div className="h-px w-full bg-[#111111]/15" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="relative z-10 flex justify-center pt-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <a
          href="https://github.com/AAb2u"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium px-6 py-3 rounded-full hover:opacity-80 transition-opacity"
        >
          <TextReveal text="More Work" />
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10L10 2M10 2H4M10 2v6" />
          </svg>
        </a>
      </motion.div>

      {/* Floating image preview — follows cursor with inertia */}
      <div
        ref={imageWrapRef}
        className="fixed top-0 left-0 pointer-events-none z-50 overflow-hidden"
        style={{
          width: isAnyHovered ? "clamp(16em, 38vw, 36em)" : "0",
          height: "clamp(10em, 24vw, 22.5em)",
          transform: "translate(-50%, -52%)",
          transition: isAnyHovered
            ? `width 0.4s ${EXPAND_BZ}`
            : `width 0.4s ${COLLAPSE_BZ}`,
          position: "fixed",
        }}
      >
        <AnimatePresence mode="sync">
          {hoveredIndex !== null && (
            <motion.img
              key={hoveredIndex}
              src={projects[hoveredIndex].image}
              alt={projects[hoveredIndex].name}
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              exit={{ clipPath: "inset(0% 0 100% 0)" }}
              transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          )}
        </AnimatePresence>
      </div>

    </section>
  );
}
