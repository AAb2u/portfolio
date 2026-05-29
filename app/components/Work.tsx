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
    <section id="work" className="px-24 py-28 flex flex-col gap-8 border-t border-border" onMouseLeave={() => setHoveredIndex(null)}>

      <motion.div
        className="flex justify-between items-baseline"
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
      <div>
        <div className="h-px w-full bg-border" />

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
              className="flex items-center justify-between py-12 px-16"
              data-cursor="view"
              data-project-index={i}
              onMouseEnter={() => {
                lerpPos.current = { ...rawPos.current };
                setHoveredIndex(i);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                opacity: isAnyHovered && hoveredIndex !== i ? 0.35 : 1,
                transition: `opacity 0.3s ${HOVER_BZ}`,
              }}
            >
              {/* Left: project name */}
              <h3
                className="text-[clamp(48px,5.5vw,80px)] font-normal tracking-tight leading-none"
                style={{
                  scale: hoveredIndex === i ? 1.08 : 1,
                  transformOrigin: "left center",
                  transition: `scale 0.4s ${HOVER_BZ}`,
                }}
              >
                {p.name}
              </h3>

              {/* Right: tags */}
              <span className="text-sm text-foreground/70 tracking-wide">
                {p.tags}
              </span>
            </a>
            </motion.div>
            <div className="h-px w-full bg-border" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        className="flex justify-center pt-2"
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
