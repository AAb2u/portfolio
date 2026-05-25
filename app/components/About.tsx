export default function About() {
  const socials = [
    { label: "GitHub", href: "https://github.com/AAb2u" },
    { label: "LinkedIn", href: "https://linkedin.com/in/akrour-abdenour-08a10235b/" },
    { label: "Instagram", href: "https://instagram.com/12dou__" },
  ];

  return (
    <section id="about" className="px-24 py-28 flex flex-col justify-center border-t border-border">
      <div className="flex justify-between items-start">
        <div className="max-w-[520px]">
          <p className="text-2xl leading-[1.5] text-foreground/70">
            Software Engineer passionate about problem solving and
            object-oriented programming. I build scalable solutions
            across web, mobile, and software — with a strong interest
            in game development and interactive experiences.
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 bg-foreground text-background text-xs font-medium px-5 py-2.5 rounded-full hover:opacity-75 transition-opacity"
          >
            Drop me a line
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 10L10 2M10 2H4M10 2v6" />
            </svg>
          </a>
        </div>

        <div>
          <p className="text-[11px] text-muted mb-4">Let's get connected</p>
          <div className="flex flex-col gap-2">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-sm hover:opacity-50 transition-opacity">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
