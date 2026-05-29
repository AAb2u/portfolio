"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Process from "./Process";
import Contact from "./Contact";

export default function ProcessContactReveal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [contactH, setContactH] = useState(0);

  useEffect(() => {
    if (!contactRef.current) return;
    const ro = new ResizeObserver(([e]) => setContactH(e.contentRect.height));
    ro.observe(contactRef.current);
    return () => ro.disconnect();
  }, []);

  // 500vh total:
  //  0%  → 60%  : Process pinned, steps reveal sequentially
  //  60% → 100% : Process slides up, Contact reveals behind
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const processY = useTransform(scrollYProgress, [0.60, 1], ["0vh", "-100vh"]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", height: "500vh" }}>

      {/* Contact — sticky behind */}
      <div ref={contactRef} style={{ position: "sticky", top: 0, zIndex: 0 }}>
        <Contact />
      </div>

      {/* Process — overlays Contact, pinned at full viewport height, then slides away */}
      <motion.div
        className="bg-background"
        style={{
          position:  "sticky",
          top:        0,
          marginTop:  contactH > 0 ? -contactH : 0,
          zIndex:     10,
          y:          processY,
          height:     "100vh",
          display:    "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow:   "hidden",
        }}
      >
        <Process scrollYProgress={scrollYProgress} />
      </motion.div>

    </div>
  );
}
