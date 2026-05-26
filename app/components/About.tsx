"use client";
import { motion } from "framer-motion";
import TextReveal from "./TextReveal";

const socials = [
  { label: "GitHub",    href: "https://github.com/AAb2u" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/akrour-abdenour-08a10235b/" },
  { label: "Instagram", href: "https://instagram.com/12dou__" },
];

export default function About() {
  return (
    <section id="about" className="px-24 py-28 flex flex-col justify-center border-t border-border">
      <div className="flex justify-between items-start">

        <motion.div
          className="max-w-[520px]"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-2xl leading-[1.5] text-foreground/70">
            Software Engineer passionate about problem solving and
            object-oriented programming. I build scalable solutions
            across web, mobile, and software — with a strong interest
            in game development and interactive experiences.
          </p>
          <motion.a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 bg-foreground text-background text-xs font-medium px-5 py-2.5 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TextReveal text="Drop me a line" duration={700} />
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 10L10 2M10 2H4M10 2v6" />
            </svg>
          </motion.a>
        </motion.div>

        <div>
          <motion.p
            className="text-[11px] text-muted mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Let's get connected
          </motion.p>
          <div className="flex flex-col gap-2">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm"
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <TextReveal text={s.label} />
              </motion.a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
