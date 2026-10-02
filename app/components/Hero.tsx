"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { openOverlay } from "../lib/overlays";

const socials = [
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/akrour-abdenour-08a10235b" },
  { label: "GITHUB", href: "https://github.com/AAb2u" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/12dou__/" },
];

const introEase = [0.16, 1, 0.3, 1] as const;

// Thin arrow echoing the one under the socials; tilts to → on hover
const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45"
  >
    <path d="M6 18 18 6" />
    <path d="M8 6h10v10" />
  </svg>
);

export default function Hero() {
  return (
    <>
      {/* Mobile: a calm, card-based introduction. The desktop composition remains below unchanged. */}
      <section className="relative overflow-hidden bg-[#d8d7d1] px-4 pb-5 pt-20 text-[#252525] sm:hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 12% 12%, #eeeee9 0, transparent 34%), radial-gradient(circle at 94% 56%, #c2c0b9 0, transparent 42%)" }} />

        <motion.div
          className="relative mx-auto max-w-[430px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: introEase }}
        >
          <div>
            <div className="px-4 pb-10 pt-8">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full bg-white">
                  <Image src="/me.png" alt="Abdenour Akrour" fill sizes="44px" className="object-cover object-[center_20%]" />
                </div>
                <div className="text-[11px] leading-tight">
                  <p className="font-semibold text-[#252525]">Abdenour Akrour</p>
                  <p className="mt-1 text-[#777772]">Software Engineer</p>
                </div>
              </div>

              <h1 className="mt-10 text-[clamp(34px,10vw,46px)] font-medium leading-[0.98] tracking-[-0.05em]">
                I build useful digital experiences.
              </h1>
              <p className="mt-5 max-w-[290px] text-[14px] leading-[1.55] text-[#6d6d68]">
                Web apps, interactive experiences, and solid software systems — made with care in Algeria.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <a href="#work" className="rounded-full bg-[#252525] px-4 py-2.5 text-[11px] font-medium text-[#eeeeeb]">View selected work</a>
                <button type="button" aria-haspopup="dialog" onClick={(e) => openOverlay("cv", e.currentTarget)} className="rounded-full border border-[#252525]/20 px-4 py-2.5 text-[11px] font-medium">View my CV</button>
              </div>
            </div>

            <div className="border-t border-[#252525]/15 px-4 py-10">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-[#777772]">WHAT I DO</p>
              <h2 className="mt-3 text-[30px] font-medium leading-[1.02] tracking-[-0.045em]">Design, code<br />and craft.</h2>
              <p className="mt-7 max-w-[285px] text-[13px] leading-[1.55] text-[#777772]">
                Focused on clean logic, thoughtful UX, and production-ready implementation.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

    <section className="relative hidden min-h-screen overflow-hidden bg-[#eeeeeb] text-[#252525] sm:block">
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
            // Cell 7 (row 2, col 4) sits inside the socials column, which draws its own dividers
            <span key={index} className={`border-r border-[#111111]/15 last:border-r-0 ${index === 7 ? "" : "border-b"}`} />
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
          className="relative col-start-3 col-end-5 row-start-3 flex max-w-[380px] flex-col justify-center px-8 text-[13px] text-[#555552] sm:col-start-3 sm:col-end-4 sm:px-10 lg:px-16"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.68, ease: introEase }}
        >
          {[
            { kind: "cv" as const, label: "Read my resume", note: true },
            { kind: "contact" as const, label: "Or have a chat", note: false },
          ].map((item) => (
            <button
              key={item.kind}
              type="button"
              data-sound="hover"
              aria-haspopup="dialog"
              className="group flex w-full items-center justify-between gap-4 border-b border-[#111111]/15 py-3.5 text-left first:border-t"
              // The icon circle is what grows into the full-screen page
              onClick={(e) => openOverlay(item.kind, e.currentTarget.lastElementChild ?? e.currentTarget)}
            >
              <span className="text-[13px] text-[#252525] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                {item.label}
                {item.note && <span className="text-[#1677ff]"> **</span>}
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#111111]/20 text-[#555552] transition-colors duration-300 group-hover:border-[#111111] group-hover:bg-[#111111] group-hover:text-[#eeeeeb]">
                <ArrowIcon />
              </span>
            </button>
          ))}
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
                data-cursor="social"
                data-sound="pop"
                data-social={social.label.toLowerCase()}
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
          className="pointer-events-none relative col-start-4 row-start-3 hidden items-start justify-center pt-8 text-[#1677ff] sm:flex"
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
    </>
  );
}
