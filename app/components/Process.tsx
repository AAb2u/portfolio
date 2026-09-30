"use client";
import { useState } from "react";
import { AnimatePresence, motion, MotionValue, useMotionValueEvent, useTransform } from "framer-motion";

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" />
  </svg>
);
const PencilIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const CodeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const ChartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6"  y1="20" x2="6"  y2="14" />
  </svg>
);

const steps = [
  { title: "UX / Wireframing",    desc: "We start by understanding your goals, mapping user flows and building interactive prototypes — before writing a single line of code.", duration: "1 Week",    icon: <SearchIcon />, topOffset: 160 },
  { title: "Web Design",          desc: "Wireframes become a fully realized visual identity — on-brand, refined, and designed to engage your audience from the first scroll.",  duration: "1–2 Weeks", icon: <PencilIcon />, topOffset: 105 },
  { title: "Web Development",     desc: "Once the design is approved, we build it with clean, performant code — every detail implemented across all devices and browsers.",        duration: "2–3 Weeks", icon: <CodeIcon />,   topOffset: 50  },
  { title: "Analytics & Support", desc: "We gather feedback, set up tracking and iterate on the product. Ongoing support ensures it keeps improving post-launch.",                duration: "Ongoing",   icon: <ChartIcon />,  topOffset: 0   },
];

export default function Process({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {

  // Ligne horizontale : [0.02 → 0.46] = scaleX 0→1
  // À scaleX=0.25 → step1 (scrollY≈0.13), scaleX=0.50 → step2 (≈0.24), scaleX=0.75 → step3 (≈0.35)
  const hLineScaleX = useTransform(scrollYProgress, [0.02, 0.46], [0, 1]);

  // Mobile: one step open at a time, following the same timing as the desktop icons
  const [activeStep, setActiveStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {

    const next = p >= 0.35 ? 3 : p >= 0.24 ? 2 : p >= 0.13 ? 1 : 0;
    setActiveStep((cur) => (cur === next ? cur : next));
  });

  // Icons — pop quand la ligne les atteint
  const s0i = useTransform(scrollYProgress, [0.020, 0.040], [0, 1]);
  const s1i = useTransform(scrollYProgress, [0.130, 0.150], [0, 1]);
  const s2i = useTransform(scrollYProgress, [0.240, 0.260], [0, 1]);
  const s3i = useTransform(scrollYProgress, [0.350, 0.370], [0, 1]);

  // Lignes verticales — se dessinent de bas en haut juste après l'icon
  const s0v = useTransform(scrollYProgress, [0.040, 0.115], [0, 1]);
  const s1v = useTransform(scrollYProgress, [0.150, 0.225], [0, 1]);
  const s2v = useTransform(scrollYProgress, [0.260, 0.335], [0, 1]);
  const s3v = useTransform(scrollYProgress, [0.370, 0.445], [0, 1]);

  // Texte — apparaît en même temps que la ligne verticale monte
  const s0y = useTransform(scrollYProgress, [0.040, 0.115, 1], [30, 0, 0]);
  const s1y = useTransform(scrollYProgress, [0.150, 0.225, 1], [30, 0, 0]);
  const s2y = useTransform(scrollYProgress, [0.260, 0.335, 1], [30, 0, 0]);
  const s3y = useTransform(scrollYProgress, [0.370, 0.445, 1], [30, 0, 0]);

  const s0o = useTransform(scrollYProgress, [0.040, 0.115, 1], [0, 1, 1]);
  const s1o = useTransform(scrollYProgress, [0.150, 0.225, 1], [0, 1, 1]);
  const s2o = useTransform(scrollYProgress, [0.260, 0.335, 1], [0, 1, 1]);
  const s3o = useTransform(scrollYProgress, [0.370, 0.445, 1], [0, 1, 1]);

  const anims = [
    { v: s0v, i: s0i, y: s0y, o: s0o },
    { v: s1v, i: s1i, y: s1y, o: s1o },
    { v: s2v, i: s2i, y: s2y, o: s2o },
    { v: s3v, i: s3i, y: s3y, o: s3o },
  ];

  return (
    <section
      id="process"
      className="relative flex h-full min-h-screen w-full flex-col justify-center overflow-hidden border-t border-[#111111]/15 bg-[#eeeeeb] px-6 sm:px-24"
      style={{ paddingTop: "clamp(24px, 4vh, 56px)", paddingBottom: "clamp(24px, 4vh, 56px)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden sm:grid"
        style={{
          gridTemplateColumns: "minmax(54px,0.55fr) minmax(0,2.2fr) minmax(0,1.35fr) minmax(112px,0.78fr)",
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className="border-r border-[#111111]/12 last:border-r-0" />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 hidden items-start justify-between gap-3 sm:flex sm:flex-row sm:items-end" style={{ marginBottom: "clamp(18px, 3vh, 48px)" }}>
        <h2 className="text-[clamp(34px,9vw,52px)] font-light tracking-tight leading-[1.05]">
          My way of<br />getting things done.
        </h2>
        <span className="text-[11px] text-muted uppercase tracking-[0.18em] pb-1">Process</span>
      </div>

      {/* Steps + timeline */}
      <div className="relative z-10 hidden sm:block">

        {/* Vertical lines */}
        {steps.map((s, i) => (
          <motion.div
            key={`vl-${i}`}
            style={{
              position:       "absolute",
              top:             s.topOffset + 6,
              bottom:          64,
              left:            `${(i / steps.length) * 100}%`,
              width:           "1px",
              background:      "#111111",
              transformOrigin: "bottom",
              scaleY:          anims[i].v,
            }}
          />
        ))}

        {/* Content grid — slides in, no opacity */}
        <div className="grid grid-cols-4 relative z-10" style={{ minHeight: "clamp(260px, 30vh, 340px)" }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              style={{
                paddingLeft:  28,
                paddingRight: 20,
                paddingTop:   s.topOffset,
                y:            anims[i].y,
                opacity:      anims[i].o,
              }}
            >
              <h3 className="text-base font-medium tracking-tight leading-snug mb-3">{s.title}</h3>
              <p  className="text-sm text-muted leading-[1.75] mb-4">{s.desc}</p>
              <span className="text-[11px] text-muted tracking-wide">{s.duration}</span>
            </motion.div>
          ))}
        </div>

        {/* Timeline row */}
        <div className="relative z-10" style={{ height: "64px" }}>
          <motion.div
            style={{
              position:       "absolute",
              top:             "50%",
              left:            0,
              right:           0,
              height:          "1px",
              background:      "#111111",
              transformOrigin: "left",
              scaleX:          hLineScaleX,
            }}
          />
          {steps.map((s, i) => (
            <motion.div
              key={`icon-${i}`}
              className="flex items-center justify-center text-muted"
              style={{
                position:    "absolute",
                left:         `${(i / steps.length) * 100}%`,
                top:          "50%",
                marginLeft:  -20,
                marginTop:   -20,
                width:        40,
                height:       40,
                borderRadius: "50%",
                border:       "1px solid #111111",
                background:   "#eeeeeb",
                zIndex:       10,
                scale:        anims[i].i,
              }}
            >
              {s.icon}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: editorial list in the site's style. The step matching the scroll
          position is open; the bar fills with the same progress as the desktop line. */}
      <div className="relative z-10 pt-14 sm:hidden">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1677ff]">Process</span>
          <span className="text-[10px] tabular-nums tracking-[0.12em] text-[#111111]/45">
            0{activeStep + 1} / 0{steps.length}
          </span>
        </div>
        <h2 className="mt-3 text-[clamp(34px,10vw,46px)] font-medium leading-[0.95] tracking-[-0.05em]">
          My way of getting things done.
        </h2>

        <div className="relative mt-7 h-px w-full bg-[#111111]/15">
          <motion.div
            className="absolute inset-0 bg-[#111111]"
            style={{ scaleX: hLineScaleX, transformOrigin: "left" }}
          />
        </div>

        <ol className="mt-1">
          {steps.map((step, index) => {
            const open = activeStep === index;
            return (
              <li key={step.title} className="border-b border-[#111111]/15">
                <div
                  className="flex items-center gap-4 py-3.5 transition-opacity duration-500"
                  style={{ opacity: open ? 1 : index < activeStep ? 0.45 : 0.3 }}
                >
                  <span className="w-5 text-[11px] tabular-nums text-[#111111]/45">0{index + 1}</span>
                  <h3 className="flex-1 text-[clamp(19px,5.6vw,24px)] font-medium leading-tight tracking-[-0.035em]">
                    {step.title}
                  </h3>
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-500"
                    style={{
                      borderColor: open ? "#111111" : "rgba(17,17,17,0.15)",
                      background: open ? "#111111" : "transparent",
                      color: open ? "#eeeeeb" : "#888888",
                    }}
                  >
                    {step.icon}
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 pl-9">
                        <p className="text-[13px] leading-[1.55] text-[#111111]/60">{step.desc}</p>
                        <span className="mt-3 inline-block rounded-full border border-[#111111]/15 px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#111111]/55">
                          {step.duration}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
