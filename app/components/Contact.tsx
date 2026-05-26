"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import TextReveal from "./TextReveal";

export default function Contact() {
  const links = [
    { label: "GitHub",    href: "https://github.com/AAb2u" },
    { label: "LinkedIn",  href: "https://www.linkedin.com/in/akrour-abdenour-08a10235b" },
    { label: "Instagram", href: "https://www.instagram.com/12dou__/" },
    { label: "Email",     href: "mailto:akrourabdenour9@gmail.com" },
  ];

  return (
    <section id="contact" className="px-24 pt-28 pb-10 flex flex-col gap-20 border-t border-border">

      <div className="flex items-end justify-between gap-8">
        <motion.h2
          className="text-[clamp(28px,4vw,52px)] font-medium leading-[1.15] tracking-tight max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.span
            className="relative inline-block float-left mr-5 mt-2"
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
          >
            <Image
              src="https://media.licdn.com/dms/image/v2/D4E03AQGjMu8_MuzK0w/profile-displayphoto-shrink_400_400/B4EZYQZkQkHYAg-/0/1744031860160?e=1781136000&v=beta&t=Ot5t_aSxyNQbIVf-9KDsPS3lJUiWNnGRGEnyZVY-WsE"
              alt="Abdenour Akrour"
              width={72}
              height={72}
              className="rounded-full"
            />
            <span className="absolute bottom-1 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
          </motion.span>
          Let's talk about a project, collaboration or an idea you may have
        </motion.h2>

        <motion.a
          href="mailto:akrourabdenour9@gmail.com"
          className="flex-shrink-0 inline-flex items-center gap-3 bg-foreground text-background text-sm font-semibold px-8 py-4 rounded-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
        >
          <TextReveal text="Let's start a project" duration={800} />
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10L10 2M10 2H4M10 2v6" />
          </svg>
        </motion.a>
      </div>

      <motion.div
        className="flex items-center justify-between border-t border-border pt-6 text-[11px] text-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span>© 2025 Abdenour Akrour. All Rights Reserved.</span>
        <div className="flex gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
              <TextReveal text={l.label} duration={600} />
            </a>
          ))}
        </div>
        <a href="#">
          <TextReveal text="Back to top ↑" duration={600} />
        </a>
      </motion.div>

    </section>
  );
}
