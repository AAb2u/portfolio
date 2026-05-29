"use client";
import { motion, MotionValue, useTransform } from "framer-motion";

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
      className="w-full px-24 border-t border-border"
      style={{ paddingTop: "clamp(32px, 4vh, 56px)", paddingBottom: "clamp(32px, 4vh, 56px)" }}
    >
      {/* Header */}
      <div className="flex justify-between items-end" style={{ marginBottom: "clamp(24px, 3vh, 48px)" }}>
        <h2 className="text-[clamp(28px,3.5vw,52px)] font-light tracking-tight leading-[1.05]">
          My way of<br />getting things done.
        </h2>
        <span className="text-[11px] text-muted uppercase tracking-[0.18em] pb-1">Process</span>
      </div>

      {/* Steps + timeline */}
      <div className="relative">

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
                background:   "var(--color-background)",
                zIndex:       10,
                scale:        anims[i].i,
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
