"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Service = {
  num: string;
  title: string;
  desc: string;
  gif: string;
  clip?: string;
};

const services: Service[] = [
  {
    num: "01",
    title: "Web Development",
    desc: "Building performant web applications with React, Next.js and Node.js, from idea to production.",
    gif: "/gif/web-111.gif",
  },
  {
    num: "02",
    title: "Software Engineering",
    desc: "Architecting clean, structured software with C#, C++, Java and .NET using OOP and MVVM patterns.",
    gif: "/gif/software-111.gif",
    clip: "inset(0 0 12% 0)",
  },
  {
    num: "03",
    title: "UI / UX Design",
    desc: "Designing intuitive interfaces and seamless user experiences that look great and convert.",
    gif: "/gif/uiux-111.gif",
  },
];

const introEase = [0.16, 1, 0.3, 1] as const;

export default function Services() {
  return (
    <section className="relative min-h-screen overflow-hidden border-t border-[#eeeeeb]/15 bg-[#111111] text-[#eeeeeb]">
      <div className="pointer-events-none absolute inset-0 hidden grid-cols-[minmax(54px,0.55fr)_repeat(3,minmax(0,1.47fr))_minmax(112px,0.78fr)] grid-rows-[0.72fr_0.9fr_1.55fr_0.8fr] sm:grid">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className="border-b border-r border-[#eeeeeb]/12 last:border-r-0" />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 grid grid-cols-[28px_1fr_28px] grid-rows-[0.56fr_1fr_1fr_0.45fr] sm:hidden">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className="border-b border-r border-[#eeeeeb]/12 last:border-r-0" />
        ))}
      </div>

      <div className="relative grid min-h-screen grid-cols-1 grid-rows-[auto_1fr] px-8 py-24 sm:grid-cols-[minmax(54px,0.55fr)_repeat(3,minmax(0,1.47fr))_minmax(112px,0.78fr)] sm:grid-rows-[0.72fr_0.9fr_1.55fr_0.8fr] sm:px-0 sm:py-0">
        <motion.div
          className="sm:col-start-2 sm:col-end-5 sm:row-start-2 sm:flex sm:flex-col sm:justify-center sm:px-10 lg:px-16"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: introEase }}
        >
          <span className="text-[11px] font-semibold uppercase text-[#1677ff]">
            Services
          </span>
          <h2 className="mt-4 max-w-[960px] text-[clamp(42px,7vw,118px)] font-black leading-[0.9] tracking-normal">
            I can help you with<span className="text-[#1677ff]">.</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:col-start-2 sm:col-end-5 sm:row-start-3 sm:mt-0 sm:grid-cols-3 sm:gap-0">
          {services.map((service, index) => (
            <motion.article
              key={service.num}
              className="relative flex min-h-[330px] flex-col justify-between border border-[#eeeeeb]/15 bg-[#111111] p-6 sm:min-h-0 sm:border-0 sm:border-r sm:border-[#eeeeeb]/12 sm:bg-transparent sm:px-10 sm:py-10 lg:px-16"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: index * 0.12, ease: introEase }}
            >
              <div>
                <span className="block text-[clamp(64px,7vw,118px)] font-black leading-none text-[#eeeeeb]/12">
                  {service.num}
                </span>

                <div className="relative mt-2 h-36 w-full bg-[#111111] sm:mt-6 sm:h-44">
                  <Image
                    src={service.gif}
                    alt={service.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 28vw"
                    className="object-contain object-left opacity-80"
                    style={{
                      clipPath: service.clip ?? "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[clamp(22px,2.1vw,34px)] font-semibold leading-none">
                  {service.title}
                </h3>
                <p className="mt-5 max-w-[310px] text-[13px] leading-[1.7] text-[#eeeeeb]/55">
                  {service.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          className="mt-10 text-[10px] leading-[1.55] text-[#eeeeeb]/45 sm:col-start-2 sm:col-end-5 sm:row-start-4 sm:mt-0 sm:self-start sm:px-10 sm:pt-8 lg:px-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          * Clean systems, expressive interfaces, and production-ready implementation.
        </motion.p>
      </div>
    </section>
  );
}
