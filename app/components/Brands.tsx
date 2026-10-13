"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Kind = "work" | "internship";

type Brand = {
  name: string;
  // In chronological order: a brand can be an internship that turned into a job
  kinds: Kind[];
  logo: string;
  // Version that fades in on hover, for logos that grayscale can't bring to life (e.g. black wordmarks)
  hoverLogo?: string;
  role?: string;
  period?: string;
  // Optical size: wide wordmarks need less room than tall emblems to look equal
  scale?: number;
};

const brands: Brand[] = [
  { name: "Alina", kinds: ["work"], logo: "/brands/alina.png", hoverLogo: "/brands/alina-hover.png", scale: 0.8 },
  { name: "Brandt", kinds: ["work"], logo: "/brands/brandt.png", scale: 0.8 },
  { name: "AgroTech Solutions", kinds: ["internship", "work"], logo: "/brands/agrotech.png" },
  { name: "KPMG", kinds: ["internship"], logo: "/brands/kpmg.png", scale: 0.72 },
  { name: "Ministry of Higher Education and Scientific Research", kinds: ["internship"], logo: "/brands/mesrs.png" },
];

// Cells kept free for brands still to come
const EMPTY_SLOTS = 1;

const KIND_LABEL: Record<Kind, string> = { work: "Work", internship: "Internship" };

const FILTERS: { key: "all" | Kind; label: string }[] = [
  { key: "all", label: "All" },
  { key: "work", label: "Work" },
  { key: "internship", label: "Internships" },
];

const introEase = [0.16, 1, 0.3, 1] as const;

// Filled dot = worked there, ring = internship
function KindMark({ kind }: { kind: Kind }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-[7px] w-[7px] rounded-full ${
        kind === "work" ? "bg-[#1677ff]" : "border border-[#1677ff]"
      }`}
    />
  );
}

export default function Brands() {
  const [filter, setFilter] = useState<"all" | Kind>("all");

  return (
    <section
      id="experience"
      className="relative border-t border-[#111111]/15 bg-[#eeeeeb] px-6 py-20 text-[#252525] sm:px-24 sm:py-28"
    >
      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: introEase }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1677ff]">
            Experience
          </span>
          <h2 className="mt-4 text-[clamp(40px,7vw,104px)] font-light leading-[0.98] tracking-[-0.04em]">
            Some brands
            <br />
            I&apos;ve worked with<span className="text-[#1677ff]">.</span>
          </h2>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4 sm:items-end"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: introEase }}
        >
          <div className="flex gap-5 text-[11px] text-[#686865]">
            <span className="flex items-center gap-2"><KindMark kind="work" /> Worked with</span>
            <span className="flex items-center gap-2"><KindMark kind="internship" /> Internship</span>
          </div>
          <div role="group" aria-label="Filter brands" className="flex gap-1 rounded-full border border-[#111111]/15 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-4 py-1.5 text-[11px] font-medium transition-colors duration-300 ${
                  filter === f.key ? "bg-[#111111] text-[#eeeeeb]" : "text-[#555552] hover:text-[#111111]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-14 grid grid-cols-1 border-l border-t border-[#111111]/15 sm:mt-20 sm:grid-cols-3">
        {brands.map((brand, index) => {
          const dimmed = filter !== "all" && !brand.kinds.includes(filter);
          return (
            <motion.div
              key={brand.name}
              className="border-b border-r border-[#111111]/15"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: introEase }}
            >
              <div
                className="group relative flex aspect-[4/3] flex-col justify-between p-4 transition-opacity duration-500 sm:aspect-[16/10] sm:p-6"
                style={{ opacity: dimmed ? 0.18 : 1 }}
              >
                <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#686865]">
                  {brand.kinds.map((kind, i) => (
                    <span key={kind} className="flex items-center gap-2">
                      {i > 0 && <span aria-label="then">→</span>}
                      <KindMark kind={kind} />
                      {KIND_LABEL[kind]}
                    </span>
                  ))}
                </span>

                {/* With a mouse, logos stay quiet in grayscale and come to life on hover; touch screens show them in colour */}
                <div className="relative mx-auto h-[58%] w-[64%]" style={{ scale: brand.scale ?? 1 }}>
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 60vw, 22vw"
                    className={`object-contain transition-[filter,opacity] duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0 ${
                      brand.hoverLogo ? "[@media(hover:hover)]:group-hover:opacity-0" : ""
                    }`}
                  />
                  {brand.hoverLogo && (
                    <Image
                      src={brand.hoverLogo}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 60vw, 22vw"
                      className="object-contain opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100"
                    />
                  )}
                </div>

                {/* Name, role and dates: always shown on touch, revealed on hover with a mouse */}
                <div className="flex items-end justify-between gap-3 text-[11px] leading-tight text-[#555552] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
                  <span className="text-[#252525]">{brand.role ?? brand.name}</span>
                  {brand.period && <span className="shrink-0 tabular-nums">{brand.period}</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
        {Array.from({ length: EMPTY_SLOTS }).map((_, i) => (
          <div key={`empty-${i}`} aria-hidden className="hidden aspect-[16/10] border-b border-r border-[#111111]/15 sm:block" />
        ))}
      </div>
    </section>
  );
}
