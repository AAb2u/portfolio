"use client";

import { useEffect, useState } from "react";
import TextReveal from "./TextReveal";

const BG = "#111111";
const FG = "#E9E9E3";
const MUTED = "rgba(233,233,227,0.45)";
const BORDER = "rgba(233,233,227,0.12)";
const LINKEDIN_PROFILE_IMAGE =
  "https://media.licdn.com/dms/image/v2/D4E03AQGjMu8_MuzK0w/profile-displayphoto-shrink_400_400/B4EZYQZkQkHYAg-/0/1744031860160?e=1782950400&v=beta&t=8JherjwnF5ZJqy899H5pnkoT6T6bjOYtRnzSon5dSGg";

function formatTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function Contact() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const socials = [
    { label: "GitHub", href: "https://github.com/AAb2u" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/akrour-abdenour-08a10235b" },
    { label: "Instagram", href: "https://www.instagram.com/12dou__/" },
  ];

  return (
    <section
      id="contact"
      className="flex min-h-screen flex-col overflow-hidden"
      style={{ backgroundColor: BG, color: FG }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pb-10 pt-20 sm:px-8 sm:pt-16">
        <div className="text-[clamp(44px,13vw,120px)] font-light leading-[0.95]">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="relative h-[clamp(44px,10vw,80px)] w-[clamp(44px,10vw,80px)] shrink-0">
              <div
                aria-label="Abdenour Akrour"
                className="absolute inset-0 rounded-full bg-cover bg-center"
                role="img"
                style={{ backgroundImage: `url(${LINKEDIN_PROFILE_IMAGE})` }}
              />
              <span
                className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 sm:h-3 sm:w-3"
                style={{ backgroundColor: "#4ade80", borderColor: BG }}
              />
            </div>
            <span>Let&apos;s work</span>
          </div>
          <div>together.</div>
        </div>

        <div className="relative mt-10 flex items-center sm:mt-16">
          <div className="h-px flex-1" style={{ backgroundColor: BORDER }} />
          <a
            href="mailto:akrourabdenour9@gmail.com"
            className="ml-4 inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-center text-[11px] font-semibold transition-transform hover:scale-105 sm:absolute sm:right-0 sm:ml-0 sm:h-[clamp(120px,10vw,160px)] sm:w-[clamp(120px,10vw,160px)] sm:text-[13px]"
            style={{ backgroundColor: FG, color: BG }}
          >
            Get in touch
          </a>
        </div>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {[
            { text: "akrourabdenour9@gmail.com", href: "mailto:akrourabdenour9@gmail.com", external: false },
            { text: "github.com/AAb2u", href: "https://github.com/AAb2u", external: true },
          ].map(({ text, href, external }) => (
            <a
              key={text}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex min-w-0 items-center justify-center rounded-full border px-4 py-2.5 text-center text-[12px] transition-colors sm:w-fit sm:px-5 sm:text-[13px]"
              style={{ borderColor: BORDER, color: MUTED }}
            >
              <span className="truncate">{text}</span>
            </a>
          ))}
        </div>

        <div className="flex-1" />

        <footer className="mt-12">
          <div className="mb-5 h-px" style={{ backgroundColor: BORDER }} />
          <div className="grid gap-6 text-[11px] sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <span className="uppercase tracking-[0.1em]" style={{ color: MUTED }}>Version</span>
              <span>2025 Edition</span>
              <span style={{ color: MUTED }}>Next.js / TypeScript</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="uppercase tracking-[0.1em]" style={{ color: MUTED }}>Location</span>
              <span>Algiers, Algeria</span>
              <span style={{ color: MUTED }}>UTC +1</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="uppercase tracking-[0.1em]" style={{ color: MUTED }}>Local Time</span>
              <span>{time || "--:--:--"}</span>
              <span style={{ color: MUTED }}>Available for work</span>
            </div>

            <div className="flex flex-col gap-2 sm:items-start lg:items-end">
              <span className="uppercase tracking-[0.1em]" style={{ color: MUTED }}>Socials</span>
              <div className="flex flex-wrap gap-x-4 gap-y-2 lg:justify-end">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#E9E9E3]"
                    style={{ color: MUTED }}
                  >
                    <TextReveal text={social.label} duration={600} />
                  </a>
                ))}
              </div>
              <a className="transition-colors hover:text-[#E9E9E3]" href="#" style={{ color: MUTED }}>
                <TextReveal text="Back to top" duration={600} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
