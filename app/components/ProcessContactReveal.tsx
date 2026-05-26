"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Process from "./Process";
import Contact from "./Contact";

export default function ProcessContactReveal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [contactH, setContactH] = useState(0);

  // Measure Contact height to pull Process up over it
  useEffect(() => {
    if (!contactRef.current) return;
    const ro = new ResizeObserver(([e]) => setContactH(e.contentRect.height));
    ro.observe(contactRef.current);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Process slides UP from y:0 to y:-100vh as user scrolls → reveals Contact behind it
  const processY = useTransform(scrollYProgress, [0, 1], ["0vh", "-100vh"]);

  return (
    // 200vh wrapper gives ~100vh of scroll space for the reveal
    <div ref={wrapperRef} style={{ position: "relative", minHeight: "200vh", backgroundColor: "#111827" }}>

      {/* Contact: sticky → stays pinned while Process slides away */}
      <div ref={contactRef} style={{ position: "sticky", top: 0, zIndex: 0 }}>
        <Contact />
      </div>

      {/* Process: pulled up over Contact via negative margin, slides away on scroll */}
      <motion.div
        className="bg-background"
        style={{
          position: "sticky",
          top: 0,
          // negative margin pulls Process back up to overlap Contact
          marginTop: contactH > 0 ? -contactH : 0,
          zIndex: 10,
          y: processY,
        }}
      >
        <Process />
      </motion.div>

    </div>
  );
}
