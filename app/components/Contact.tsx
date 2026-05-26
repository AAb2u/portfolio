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
        <h2 className="text-[clamp(28px,4vw,52px)] font-medium leading-[1.15] tracking-tight max-w-2xl">
          <span className="relative inline-block float-left mr-5 mt-2">
            <Image
              src="https://media.licdn.com/dms/image/v2/D4E03AQGjMu8_MuzK0w/profile-displayphoto-shrink_400_400/B4EZYQZkQkHYAg-/0/1744031860160?e=1781136000&v=beta&t=Ot5t_aSxyNQbIVf-9KDsPS3lJUiWNnGRGEnyZVY-WsE"
              alt="Abdenour Akrour"
              width={72}
              height={72}
              className="rounded-full"
            />
            <span className="absolute bottom-1 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
          </span>
          Let's talk about a project, collaboration or an idea you may have
        </h2>

        <a
          href="mailto:akrourabdenour9@gmail.com"
          className="flex-shrink-0 inline-flex items-center gap-3 bg-foreground text-background text-sm font-semibold px-8 py-4 rounded-full hover:opacity-80 transition-opacity"
        >
          Let's start a project
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
