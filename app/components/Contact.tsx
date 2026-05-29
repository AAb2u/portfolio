"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import TextReveal from "./TextReveal";

const BG    = "#111827";
const FG    = "#E9E9E3";
const MUTED = "rgba(233,233,227,0.4)";
const BORDER = "rgba(233,233,227,0.1)";

export default function Contact() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      });
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  const socials = [
    { label: "GitHub",    href: "https://github.com/AAb2u" },
    { label: "LinkedIn",  href: "https://www.linkedin.com/in/akrour-abdenour-08a10235b" },
    { label: "Instagram", href: "https://www.instagram.com/12dou__/" },
  ];

  return (
    <section
      id="contact"
      style={{ backgroundColor: BG, color: FG, height: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* ── Main content — grouped at top ── */}
      <div className="w-full max-w-4xl mx-auto px-8 pt-16 flex flex-col">

        {/* Heading */}
        <div style={{ fontSize: "clamp(48px, 8.5vw, 120px)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(16px, 2vw, 32px)" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0, width: "clamp(48px, 5.5vw, 80px)", height: "clamp(48px, 5.5vw, 80px)" }}>
              <Image
                src="https://media.licdn.com/dms/image/v2/D4E03AQGjMu8_MuzK0w/profile-displayphoto-shrink_400_400/B4EZYQZkQkHYAg-/0/1744031860160?e=1781136000&v=beta&t=Ot5t_aSxyNQbIVf-9KDsPS3lJUiWNnGRGEnyZVY-WsE"
                alt="Abdenour Akrour"
                fill
                sizes="clamp(48px, 5.5vw, 80px)"
                className="rounded-full object-cover"
              />
              <span style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, background: "#4ade80", borderRadius: "50%", border: `2px solid ${BG}` }} />
            </div>
            <span>Let&apos;s work</span>
          </div>
          <div>together.</div>
        </div>

        {/* Divider with CTA circle pinned on the right, centered on the line */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", marginTop: "clamp(40px, 6vw, 80px)" }}>
          {/* Line runs full width, passes behind the button */}
          <div style={{ flex: 1, height: 1, backgroundColor: BORDER }} />
          {/* Circle CTA — absolutely on the right, vertically centered on the line */}
          <a
            href="mailto:akrourabdenour9@gmail.com"
            style={{
              position: "absolute",
              right: 0,
              width: "clamp(120px,10vw,160px)",
              height: "clamp(120px,10vw,160px)",
              borderRadius: "50%",
              backgroundColor: FG,
              color: BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "transform 0.25s",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            Get in touch
          </a>
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
          {[
            { text: "akrourabdenour9@gmail.com", href: "mailto:akrourabdenour9@gmail.com", external: false },
            { text: "github.com/AAb2u ↗",        href: "https://github.com/AAb2u",         external: true  },
          ].map(({ text, href, external }) => (
            <a
              key={text}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: `1px solid ${BORDER}`,
                color: MUTED,
                fontSize: 13,
                padding: "10px 20px",
                borderRadius: 999,
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(233,233,227,0.35)"; e.currentTarget.style.color = FG; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
            >
              {text}
            </a>
          ))}
        </div>
      </div>

      {/* ── Spacer pushes footer to bottom ── */}
      <div style={{ flex: 1 }} />

      {/* ── Footer ── */}
      <div className="px-12 md:px-24 pb-8">
        <div style={{ height: 1, backgroundColor: BORDER, marginBottom: 20 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, fontSize: 11 }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>Version</span>
            <span style={{ color: FG }}>2025 © Edition</span>
            <span style={{ color: MUTED }}>Next.js · TypeScript</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>Location</span>
            <span style={{ color: FG }}>Algiers, Algeria</span>
            <span style={{ color: MUTED }}>UTC +1</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>Local Time</span>
            <span style={{ color: FG }}>{time}</span>
            <span style={{ color: MUTED }}>Available for work</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
            <span style={{ color: MUTED, textTransform: "uppercase", letterSpacing: "0.1em" }}>Socials</span>
            <div style={{ display: "flex", gap: 16 }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: MUTED, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = FG)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                >
                  <TextReveal text={s.label} duration={600} />
                </a>
              ))}
            </div>
            <a
              href="#"
              style={{ color: MUTED, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = FG)}
              onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
            >
              <TextReveal text="Back to top ↑" duration={600} />
            </a>
          </div>

        </div>
      </div>

    </section>
  );
}
