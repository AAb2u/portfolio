"use client";
import { motion } from "framer-motion";
import TextReveal from "./TextReveal";

const projects = [
  {
    name: "EasySave",
    desc: ".NET backup program",
    tags: "C#, .NET, Software Engineering",
    year: "/26",
    href: "https://github.com/RamiMohamed12/EasySave-Groupe1",
  },
  {
    name: "Alina",
    desc: "Digital agency — design, development & strategy",
    tags: "Web Design, Next.js, Vercel",
    year: "/25",
    href: "https://alina-web-site-six.vercel.app",
  },
  {
    name: "PV Solution",
    desc: "Business solutions website",
    tags: "Web Design, Web Development",
    year: "/25",
    href: "https://pv-solution.com",
  },
  {
    name: "Portfolio",
    desc: "This personal portfolio site",
    tags: "TypeScript, Next.js, Tailwind CSS",
    year: "/25",
    href: "https://github.com/AAb2u/portfolio",
  },
];

export default function Work() {
  return (
    <section id="work" className="px-24 py-28 flex flex-col gap-8 border-t border-border">

      <motion.div
        className="flex justify-between items-baseline"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold">
          Selected Work<sup className="text-xs ml-0.5">({projects.length})</sup>
        </h2>
        <span className="text-[11px] text-muted">Click to access ↗</span>
      </motion.div>

      <div className="border-t border-b border-border divide-y divide-border">
        {projects.map((p, i) => (
          <motion.a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-5 group"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div>
              <h3 className="text-[clamp(32px,3.8vw,52px)] font-medium tracking-tight leading-tight">
                <TextReveal text={p.name} duration={800} />
              </h3>
              <p className="text-[11px] text-muted mt-1">{p.desc}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                open ↗
              </span>
              <span className="text-xl text-muted">{p.year}</span>
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div
        className="flex items-center justify-between pt-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div>
          <p className="text-sm font-medium">Want to see more of my work?</p>
          <p className="text-[12px] text-muted mt-1">All my projects are available on my GitHub.</p>
        </div>
        <div className="flex items-center gap-8">
          {[
            { value: "5", label: "Repos" },
            { value: "6", label: "Stars" },
            { value: "6", label: "Followers" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-semibold leading-none">{s.value}</p>
              <p className="text-[10px] text-muted mt-1">{s.label}</p>
            </div>
          ))}
          <a
            href="https://github.com/AAb2u"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background text-xs font-medium px-5 py-2.5 rounded-full"
          >
            <TextReveal text="Visit GitHub" duration={700} />
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 10L10 2M10 2H4M10 2v6" />
            </svg>
          </a>
        </div>
      </motion.div>

    </section>
  );
}
