"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M16.5 16.5L21 21" />
  </svg>
);
const PencilIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const CodeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const ChatIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const steps = [
  {
    title: "UX / Wireframing",
    desc: "We start by understanding your goals, mapping user flows and building interactive prototypes — before writing a single line of code.",
    duration: "1 Week",
    icon: <SearchIcon />,
    topOffset: 260,
  },
  {
    title: "Web Design",
    desc: "Wireframes become a fully realized visual identity — on-brand, refined, and designed to engage your audience from the first scroll.",
    duration: "1–2 Weeks",
    icon: <PencilIcon />,
    topOffset: 170,
  },
  {
    title: "Web Development",
    desc: "Once the design is approved, we build it with clean, performant code — every detail implemented across all devices and browsers.",
    duration: "2–3 Weeks",
    icon: <CodeIcon />,
    topOffset: 80,
  },
  {
    title: "Analytics & Support",
    desc: "We gather feedback, set up tracking and iterate on the product. Ongoing support ensures it keeps improving post-launch.",
    duration: "Ongoing",
    icon: <ChatIcon />,
    topOffset: 0,
  },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" className="px-24 py-28 border-t border-border">

      {/* Header */}
      <div className="flex justify-between items-end mb-20">
        <motion.h2
          className="text-[clamp(32px,4vw,56px)] font-light tracking-tight leading-[1.05]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          My way of<br />getting things done.
        </motion.h2>
        <motion.span
          className="text-[11px] text-muted uppercase tracking-[0.18em] pb-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          Process
        </motion.span>
      </div>

      {/* Steps + timeline container */}
      <div className="relative" ref={ref}>

        {/* Vertical lines — absolute, full height of this container */}
        {steps.map((s, i) => (
          <motion.div
            key={`vline-${i}`}
            style={{
              position: "absolute",
              top: s.topOffset + 6,  // small gap below title start
              bottom: 68,            // icon center (40) + icon radius (22) + gap (6)
              left: `${(i / steps.length) * 100}%`,
              width: "1px",
              background: "#111111",
              transformOrigin: "bottom",
            }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.9, delay: i * 0.09, ease: [0.25, 0.1, 0.25, 1] }}
          />
        ))}

        {/* Staircase step content */}
        <div className="grid grid-cols-4 relative z-10" style={{ minHeight: "420px" }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              style={{
                paddingLeft: "28px",
                paddingRight: "20px",
                paddingTop: s.topOffset,
              }}
              initial={{ opacity: 0, y: 48 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.14, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h3 className="text-base font-medium tracking-tight leading-snug mb-3">
                {s.title}
              </h3>
              <p className="text-sm text-muted leading-[1.85] mb-5">
                {s.desc}
              </p>
              <span className="text-[11px] text-muted tracking-wide">
                {s.duration}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Timeline row — fixed height so intersections are calculable */}
        <div className="relative z-10" style={{ height: "80px" }}>

          {/* Horizontal line at exact vertical center */}
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "2px",
              background: "var(--color-border)",
              transformOrigin: "left",
            }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.3, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          />

          {/* Icons centered exactly on each vertical × horizontal intersection */}
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center text-muted"
              style={{
                position: "absolute",
                left: `${(i / steps.length) * 100}%`,
                top: "50%",
                marginLeft: -22,
                marginTop: -22,
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid var(--color-border)",
                background: "var(--color-background)",
                zIndex: 10,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.45,
                delay: 0.5 + i * 0.14,
                ease: [0.34, 1.3, 0.64, 1],
              }}
            >
              {s.icon}
            </motion.div>
          ))}

        </div>
      </div>

    </section>
  );
}
