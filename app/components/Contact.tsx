import Image from "next/image";

export default function Contact() {
  const links = [
    { label: "GitHub",    href: "https://github.com/AAb2u" },
    { label: "LinkedIn",  href: "https://www.linkedin.com/in/akrour-abdenour-08a10235b" },
    { label: "Instagram", href: "https://www.instagram.com/12dou__/" },
    { label: "Email",     href: "mailto:akrourabdenour9@gmail.com" },
  ];

  return (
    <section id="contact" className="px-24 pt-28 pb-10 flex flex-col gap-20 border-t border-border">
      {/* Main CTA */}
      <div className="flex items-end justify-between gap-8">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0 mt-2">
            <Image
              src="https://media.licdn.com/dms/image/v2/D4E03AQGjMu8_MuzK0w/profile-displayphoto-shrink_400_400/B4EZYQZkQkHYAg-/0/1744031860160?e=1781136000&v=beta&t=Ot5t_aSxyNQbIVf-9KDsPS3lJUiWNnGRGEnyZVY-WsE"
              alt="Abdenour Akrour"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <h2 className="text-[clamp(30px,4.5vw,58px)] font-bold leading-[1.1] tracking-tight max-w-lg">
            Let's talk about a project, collaboration or an idea you may have
          </h2>
        </div>

        <a
          href="mailto:akrourabdenour9@gmail.com"
          className="flex-shrink-0 inline-flex items-center gap-2 bg-foreground text-background text-xs font-medium px-5 py-2.5 rounded-full hover:opacity-75 transition-opacity"
        >
          Drop me a line
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10L10 2M10 2H4M10 2v6" />
          </svg>
        </a>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between border-t border-border pt-6 text-[11px] text-muted">
        <span>© 2025 Abdenour Akrour. All Rights Reserved.</span>
        <div className="flex gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              className="hover:text-foreground transition-colors">{l.label}</a>
          ))}
        </div>
        <a href="#" className="hover:text-foreground transition-colors">Back to top ↑</a>
      </div>
    </section>
  );
}
