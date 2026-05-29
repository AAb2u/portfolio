"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen px-24 flex flex-col justify-end pb-24 relative overflow-hidden">
      <h1 className="font-light leading-[0.9] tracking-[-0.03em] text-[clamp(100px,17vw,220px)]">
        <motion.span
          className="block"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Software
        </motion.span>
        <motion.span
          className="inline-flex items-center gap-5"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          Engineer
          <motion.span
            className="text-[11px] font-normal tracking-normal leading-[1.65] text-muted max-w-[148px] flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            specialized in Web Dev,<br />Game Development,<br />C# / OOP &amp; 3D<br />(Unity, Blender).
          </motion.span>
        </motion.span>
      </h1>
    </section>
  );
}