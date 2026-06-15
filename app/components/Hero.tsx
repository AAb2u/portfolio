"use client";

import { motion } from "framer-motion";

const socials = [
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/akrour-abdenour-08a10235b" },
  { label: "GITHUB", href: "https://github.com/AAb2u" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/12dou__/" },
];

const introEase = [0.16, 1, 0.3, 1] as const;

const ResumeIcon = () => (
  <svg
    aria-hidden="true"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v5h5" />
    <path d="M9 13h6" />
    <path d="M9 17h4" />
  </svg>
);

const ChatIcon = () => (
  <svg
    aria-hidden="true"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a8 8 0 0 1-8 8H8l-5 3 1.7-5A8 8 0 1 1 21 12z" />
    <path d="M8 12h.01" />
    <path d="M12 12h.01" />
    <path d="M16 12h.01" />
  </svg>
);

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#eeeeeb] text-[#252525]">
      <motion.div
        className="relative grid min-h-screen w-full overflow-hidden bg-[#eeeeeb]"
        style={{
          gridTemplateColumns: "minmax(54px,0.55fr) minmax(0,2.2fr) minmax(0,2.2fr) minmax(112px,0.78fr)",
          gridTemplateRows: "0.82fr 1.35fr 1.18fr 0.82fr",
        }}
        initial={{ opacity: 0, y: 34, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.85, ease: introEase }}
      >
        <div className="pointer-events-none absolute inset-0 grid grid-cols-[minmax(54px,0.55fr)_minmax(0,2.2fr)_minmax(0,2.2fr)_minmax(112px,0.78fr)] grid-rows-[0.82fr_1.35fr_1.18fr_0.82fr]">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} className="border-b border-r border-[#111111]/15 last:border-r-0" />
          ))}
        </div>

        <div className="relative col-start-1 col-end-5 row-start-2 flex flex-col justify-center px-8 sm:col-start-2 sm:col-end-4 sm:px-10 lg:px-16">
          <motion.p
            className="text-[clamp(30px,3.8vw,64px)] font-medium leading-none"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: introEase }}
          >
            Software engineer,
          </motion.p>

          <motion.h1
            className="mt-6 max-w-full text-[clamp(64px,12.6vw,220px)] font-black leading-[0.78] tracking-normal"
            initial={{ opacity: 0, y: 38 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.32, ease: introEase }}
          >
            I&apos;m Abdenour<span className="ml-1 text-[#1677ff]">*</span>
          </motion.h1>
        </div>

        <motion.div
          className="relative col-start-1 col-end-3 row-start-3 self-center px-8 text-[12px] leading-[1.35] text-[#686865] sm:col-start-2 sm:col-end-3 sm:px-10 sm:text-[13px] lg:px-16"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.58, ease: introEase }}
        >
          <p className="max-w-[270px]">
            Hi! I&apos;m a software engineer based in Algeria. I build useful web apps,
            interactive experiences, and game systems with a focus on clean logic,
            UX, and solid code.
          </p>
        </motion.div>

        <motion.div
          className="relative col-start-3 col-end-5 row-start-3 flex flex-col justify-center gap-5 px-8 text-[13px] text-[#555552] sm:col-start-3 sm:col-end-4 sm:px-10 lg:px-16"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.68, ease: introEase }}
        >
          <a
            className="group inline-flex w-fit items-center gap-3"
            href="/cv/cv%20(1).pdf"
            download="Abdenour-Akrour-CV.pdf"
          >
            <span className="grid h-7 w-7 place-items-center border border-[#a8a8a3] transition-colors group-hover:border-[#1677ff] group-hover:text-[#1677ff]">
              <ResumeIcon />
            </span>
            <span>If you want my resume <span className="text-[#1677ff]">**</span></span>
          </a>
          <a className="group inline-flex w-fit items-center gap-3" href="#contact">
            <span className="grid h-7 w-7 place-items-center border border-[#a8a8a3] transition-colors group-hover:border-[#1677ff] group-hover:text-[#1677ff]">
              <ChatIcon />
            </span>
            <span>Or have chat</span>
          </a>
        </motion.div>

        <motion.p
          className="relative col-start-2 col-end-5 row-start-4 self-start px-8 pt-7 text-[10px] leading-[1.55] text-[#70706c] sm:col-start-3 sm:col-end-4 sm:px-10 lg:px-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.88 }}
        >
          * Passionate about web development, C# / OOP, Unity, Blender, and 3D.
          <br />
          ** If you want my folio, ask me. I don&apos;t bite.
        </motion.p>

        <div className="relative col-start-4 row-start-2 row-end-4 hidden border-l border-[#111111]/15 sm:grid">
          <div className="grid h-full grid-rows-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center border-b border-[#111111]/15 text-[11px] font-semibold text-[#3f3f3d] transition-colors hover:text-[#1677ff]"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>

        <motion.div
          aria-hidden
          className="relative col-start-4 row-start-3 hidden items-start justify-center pt-8 text-[#1677ff] sm:flex"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
        >
          <span className="relative block h-9 w-9">
            <span className="absolute left-1 top-1/2 h-px w-7 -rotate-45 bg-current" />
            <span className="absolute right-1 top-1 h-3 w-3 border-r border-t border-current" />
          </span>
        </motion.div>

        <div className="relative col-start-1 col-end-5 row-start-4 flex items-end justify-between gap-4 px-8 pb-6 sm:hidden">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold text-[#3f3f3d]"
            >
              {social.label}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
