"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Process from "./Process";
import Contact from "./Contact";

export default function ProcessContactReveal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [contactH, setContactH] = useState(0);
  // How much taller Contact is than the viewport (small phones, landscape,
  // mobile toolbars). That many px are added after the reveal so Contact can
  // scroll normally until its footer is fully visible.
  const [extra, setExtra] = useState(0);
  const extraRef = useRef(0);

  useEffect(() => {
    const el = contactRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight;
      const next = Math.max(0, Math.ceil(h - window.innerHeight));
      extraRef.current = next;
      setContactH(h);
      setExtra(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Track = 500vh (+ extra):
  //  0    → 0.60 : Process pinned, steps reveal sequentially
  //  0.60 → 0.95 : Process slides up, Contact reveals behind
  //  then        : the extra px scroll Contact itself down to its footer
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Progress over the 500vh part only, so the step timings don't depend on extra
  const revealProgress = useTransform(scrollYProgress, (p) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return p;
    const track = wrapper.offsetHeight - window.innerHeight;
    const base = track - extraRef.current;
    return base > 0 ? Math.min((p * track) / base, 1) : p;
  });

  // % of Process's own height, so it always fully leaves, whatever the unit of vh
  const processY = useTransform(revealProgress, [0.60, 0.95], ["0%", "-101%"]);

  return (
    <div
      id="process-contact"
      data-contact-extra={extra}
      ref={wrapperRef}
      style={{ position: "relative", height: `calc(500vh + ${extra}px)`, backgroundColor: "#eeeeeb" }}
    >

      {/* Contact — sticky behind */}
      <div ref={contactRef} style={{ position: "sticky", top: 0, zIndex: 0 }}>
        <Contact />
      </div>

      {/* Process — overlays Contact, pinned at full viewport height, then slides away */}
      <motion.div
        style={{
          position:  "sticky",
          top:        0,
          marginTop:  contactH > 0 ? -contactH : 0,
          zIndex:     10,
          y:          processY,
          height:     "100vh",
          backgroundColor: "#eeeeeb",
          display:    "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow:   "hidden",
        }}
      >
        <Process scrollYProgress={revealProgress} />
      </motion.div>

    </div>
  );
}
