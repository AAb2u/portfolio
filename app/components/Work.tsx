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
    name: "MedDeck",
    desc: "Medical e-commerce platform",
    tags: "E-commerce, Web Development",
    year: "/26",
    href: "https://meddeck-ecom.vercel.app/",
    image: "/api/screenshot?url=https://meddeck-ecom.vercel.app/",
  },
];

export default function Work() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openMobileProject, setOpenMobileProject] = useState<number | null>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const rawPos = useRef({ x: 0, y: 0 });
  const lerpPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  // Desktop preview: base = project above the cursor, overlay = project below,
  // revealed from the bottom as the cursor moves from one title to the next.
  const listRef = useRef<HTMLDivElement>(null);
  const baseImgRef = useRef<HTMLImageElement>(null);
  const overlayImgRef = useRef<HTMLImageElement>(null);
  const pairRef = useRef<[number, number]>([0, 1]);
  const hoveredRef = useRef(false);

  useEffect(() => {
    hoveredRef.current = hoveredIndex !== null;
  }, [hoveredIndex]);

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
      rafRef.current = requestAnimationFrame(loop);
      // Idle outside the list: no layout reads/writes while scrolling the page
      if (!hoveredRef.current) return;
      lerpPos.current.x += (rawPos.current.x - lerpPos.current.x) * 0.083;
      lerpPos.current.y += (rawPos.current.y - lerpPos.current.y) * 0.083;
      if (imageWrapRef.current) {
        imageWrapRef.current.style.transform =
          `translate3d(${lerpPos.current.x}px, ${lerpPos.current.y}px, 0) translate(-50%, -52%)`;
      }

      const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-project-index]");
      if (rows?.length && baseImgRef.current && overlayImgRef.current) {
        const y = rawPos.current.y;
        const centers = Array.from(rows, (r) => {
          const b = r.getBoundingClientRect();
          return b.top + b.height / 2;
        });
        let lower = 0;
        while (lower < centers.length - 2 && y > centers[lower + 1]) lower++;
        const upper = Math.min(lower + 1, centers.length - 1);
        const t = upper === lower
          ? 0
          : Math.min(Math.max((y - centers[lower]) / (centers[upper] - centers[lower]), 0), 1);

        // Swap sources imperatively (not via state) so src and clip change in
        // the same frame — no flash when crossing a title centre.
        if (pairRef.current[0] !== lower || pairRef.current[1] !== upper) {
          pairRef.current = [lower, upper];
          baseImgRef.current.src = projects[lower].image;
          baseImgRef.current.alt = projects[lower].name;
          overlayImgRef.current.src = projects[upper].image;
          overlayImgRef.current.alt = projects[upper].name;
        }
        // Halfway between two titles: top half = upper site, bottom half = lower site
        overlayImgRef.current.style.clipPath = `inset(${(1 - t) * 100}% 0% 0% 0%)`;
      }
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

  // Mobile: track a continuous position among the title centres so the preview
  // image can wipe from one screenshot to the next while scrolling between two
  // titles. Only active while the viewport centre sits inside the list.
  /* useEffect(() => {
    // Desktop keeps a stale scrollPos, but the mobile preview is `sm:hidden`
    // there, so it never shows — no reset needed (and none is allowed in-body).
    if (!isMobile) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rows = Array.from(
        document.querySelectorAll<HTMLElement>("[data-mobile-project]")
      );
      if (!rows.length) return;

      const center = window.innerHeight / 2;
      const centers = rows.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      const firstTop = rows[0].getBoundingClientRect().top;
      const lastBottom = rows[rows.length - 1].getBoundingClientRect().bottom;

      // Hide the preview when the viewport centre is outside the list
      if (center < firstTop || center > lastBottom) {
        setScrollPos((prev) => (prev === null ? prev : null));
        return;
      }

      let pos: number;
      if (center <= centers[0]) {
        pos = 0;
      } else if (center >= centers[centers.length - 1]) {
        pos = centers.length - 1;
      } else {
        let i = 0;
        while (i < centers.length - 1 && center > centers[i + 1]) i++;
        const span = centers[i + 1] - centers[i] || 1;
        pos = i + (center - centers[i]) / span;
      }

      setScrollPos((prev) =>
        prev !== null && Math.abs(prev - pos) < 0.002 ? prev : pos
      );
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile]); */

  const isAnyHovered = hoveredIndex !== null;
  // Legacy mobile preview markup stays mounted but hidden; the accordion below
  // owns the mobile interaction.
  const activeIndex = openMobileProject;
  const mobileActive = false;
  const lowerIdx = 0;
  const upperIdx = 0;
  const blend = 0;

  return (
    <section
      id="work"
      className="relative flex flex-col gap-8 overflow-hidden border-t border-[#111111]/15 bg-[#eeeeeb] px-6 py-20 text-[#252525] sm:px-24 sm:py-28"
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
        className="pointer-events-none absolute inset-0 hidden grid-cols-[28px_1fr_28px] sm:hidden"
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
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-2xl sm:normal-case sm:tracking-normal">
          Selected Work<sup className="text-xs ml-0.5">({projects.length})</sup>
        </h2>
        <span className="text-[11px] text-muted">Click to access ↗</span>
      </motion.div>

      {/* Project list — desktop (cursor-driven hover preview) */}
      <div ref={listRef} className="relative z-10 hidden sm:block">
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
              data-sound="row"
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

      {/* Project list — mobile (scroll-driven preview, no cursor on phones) */}
      <div className="relative z-10 hidden sm:hidden">
        <div className="h-px w-full bg-[#111111]/15" />

        {projects.map((p, i) => {
          const open = openMobileProject === i;
          const active = open;
          return (
            <div key={p.name}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-mobile-project={i}
                  className="relative flex min-h-[44vh] flex-col items-center justify-center py-10 text-center"
                  style={{
                    opacity: activeIndex !== null && !active ? 0.2 : 1,
                    transition: `opacity 0.5s ${HOVER_BZ}`,
                  }}
                >
                  <h3
                    className="text-[clamp(26px,7.5vw,40px)] font-normal leading-[1.06]"
                    style={{
                      scale: active ? 1.06 : 1,
                      letterSpacing: active ? "-0.03em" : "-0.02em",
                      transformOrigin: "center",
                      transition: `scale 0.5s ${HOVER_BZ}, letter-spacing 0.5s ${HOVER_BZ}`,
                    }}
                  >
                    {p.name}
                  </h3>

                  <div
                    className="mt-4 flex flex-col items-center gap-1.5"
                    style={{
                      opacity: active ? 1 : 0.5,
                      transition: `opacity 0.4s ease`,
                    }}
                  >
                    <span className="text-[11px] text-foreground/70 tracking-wide">{p.tags}</span>
                    <span className="text-[10px] text-foreground/35 tracking-[0.2em] uppercase">{p.year}</span>
                  </div>
                </a>
              </motion.div>
              <div className="h-px w-full bg-[#111111]/15" />
            </div>
          );
        })}
      </div>

      {/* Project list — mobile accordion */}
      <div className="relative z-10 sm:hidden">
        <div className="h-px w-full bg-[#111111]/15" />
        {projects.map((p, i) => {
          const open = openMobileProject === i;
          return (
            <div key={p.name}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`project-preview-${i}`}
                onClick={() => setOpenMobileProject(open ? null : i)}
                className="flex w-full items-center justify-between gap-5 py-5 text-left"
              >
                <span className="text-[clamp(40px,11vw,54px)] font-semibold leading-[0.95] tracking-[-0.065em]">{p.name}</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[32px] font-light leading-none text-[#252525]/55" aria-hidden>
                  {open ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`project-preview-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={`Preview of ${p.name}`} className="h-48 w-full rounded-md border border-[#111111]/10 object-cover object-top" />
                      <p className="mt-4 text-[13px] leading-[1.5] text-[#252525]/60">{p.desc}</p>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <span className="text-[10px] tracking-[0.12em] text-[#252525]/45">{p.tags}</span>
                        <a href={p.href} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[11px] font-medium underline underline-offset-4">Open project ↗</a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="h-px w-full bg-[#111111]/15" />
            </div>
          );
        })}
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

      {/* Floating image preview — desktop only, follows cursor with inertia */}
      <div
        ref={imageWrapRef}
        className="fixed top-0 left-0 pointer-events-none z-50 overflow-hidden hidden sm:block"
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={baseImgRef}
          src={projects[0].image}
          alt={projects[0].name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={overlayImgRef}
          src={projects[Math.min(1, projects.length - 1)].image}
          alt={projects[Math.min(1, projects.length - 1)].name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            clipPath: "inset(100% 0% 0% 0%)",
          }}
        />
      </div>

      {/* Floating image preview — mobile only. Two stacked screenshots: the
          upper (next) one is revealed from the bottom in proportion to the
          scroll between the two titles, so mid-gap you see half/half. */}
      <div
        className="fixed left-1/2 z-40 hidden overflow-hidden pointer-events-none sm:hidden"
        style={{
          top: "41vh",
          transform: "translate(-50%, -100%)",
          width: mobileActive ? "min(62vw, 290px)" : "0",
          height: "min(42vw, 200px)",
          borderRadius: 3,
          transition: mobileActive
            ? `width 0.45s ${EXPAND_BZ}`
            : `width 0.45s ${COLLAPSE_BZ}`,
        }}
      >
        {/* base: current screenshot */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={projects[lowerIdx].image}
          alt={projects[lowerIdx].name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
        {/* overlay: next screenshot. clipPath is driven directly by scroll —
            no CSS/motion transition, so it tracks the finger and never
            keeps animating on its own after you stop scrolling. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={projects[upperIdx].image}
          alt={projects[upperIdx].name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
            clipPath: `inset(${(1 - blend) * 100}% 0% 0% 0%)`,
          }}
        />
      </div>

    </section>
  );
}
