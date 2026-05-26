"use client";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import TextReveal from "./TextReveal";

const links = [
  { label: "About",   href: "#about" },
  { label: "Work",    href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Drop me a line", href: "#contact" },
];

export default function Nav() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-background flex items-center justify-between px-24 py-5"
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span className="text-sm font-medium">Abdenour Akrour</span>

      <nav className="flex items-center gap-8">
        {links.map((l, i) => (
          <motion.a
            key={l.label}
            href={l.href}
            className="text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: "easeOut" }}
          >
            <TextReveal text={l.label} />
          </motion.a>
        ))}
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <ThemeToggle />
      </motion.div>
    </motion.header>
  );
}
