"use client";
import { motion } from "framer-motion";

const services = [
  {
    num: "01",
    title: "Web Development",
    desc: "Building performant web applications with React, Next.js and Node.js — from idea to production.",
    gif: "/gif/web.gif",
  },
  {
    num: "02",
    title: "Software Engineering",
    desc: "Architecting clean, structured software with C#, C++, Java and .NET using OOP and MVVM patterns.",
    gif: "/gif/software.gif",
    clip: "inset(0 0 12% 0)",
  },
  {
    num: "03",
    title: "UI / UX Design",
    desc: "Designing intuitive interfaces and seamless user experiences that look great and convert.",
    gif: "/gif/uiux.gif",
  },
];

export default function Services() {
  return (
    <section className="px-32 py-24 flex flex-col gap-16 border-t border-border">

      <motion.h2
        className="text-2xl font-semibold text-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        I can help you with ...
      </motion.h2>

      <div className="grid grid-cols-3 divide-x divide-border">
        {services.map((s, i) => (
          <div key={s.num} className={i === 0 ? "pr-10" : i === services.length - 1 ? "pl-10" : "px-10"}>
            <motion.span
              className="block text-[72px] font-thin leading-none text-foreground/15 select-none"
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
              <img
                src={s.gif}
                alt={s.title}
                className="mt-6 w-56 h-56 object-contain mx-auto block mix-blend-mode-multiply"
                style={{
                  filter: "invert(1) contrast(1.8)",
                  mixBlendMode: "multiply",
                  transform: "translateZ(0)",
                  clipPath: (s as any).clip ?? "none",
                }}
              />
              <h3 className="mt-4 mb-3 text-sm font-semibold">{s.title}</h3>
              <p className="text-[13px] leading-[1.85] text-muted">{s.desc}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
