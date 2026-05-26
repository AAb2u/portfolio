"use client";
import { motion } from "framer-motion";

const services = [
  {
    num: "01",
    title: "Web Development",
    desc: "Building performant web applications with React, Next.js and Node.js — from idea to production.",
  },
  {
    num: "02",
    title: "Software Engineering",
    desc: "Architecting clean, structured software with C#, C++, Java and .NET using OOP and MVVM patterns.",
  },
  {
    num: "03",
    title: "Game Dev & 3D",
    desc: "Creating interactive experiences and 3D content with Unity, Unreal Engine and Blender.",
  },
];

export default function Services() {
  return (
    <section className="px-24 py-24 flex flex-col gap-14 border-t border-border">

      <motion.h2
        className="text-sm font-normal text-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        I can help you with ...
      </motion.h2>

      <div className="grid grid-cols-3 gap-12">
        {services.map((s, i) => (
          <div key={s.num}>
            <motion.span
              className="block text-[72px] font-thin leading-none text-foreground/10 select-none"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
            >
              {s.num}
            </motion.span>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 + 0.1, ease: "easeOut" }}
            >
              <h3 className="mt-5 mb-2 text-[13px] font-semibold tracking-wide">{s.title}</h3>
              <p className="text-[12px] leading-[1.8] text-muted">{s.desc}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
