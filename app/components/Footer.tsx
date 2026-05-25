export default function Footer() {
  const links = ["Dribbble", "Behance", "LinkedIn", "Instagram", "Email"];

  return (
    <footer className="flex items-center justify-between px-24 py-6 border-t border-border text-[11px] text-muted">
      <span>© 2023 All Rights Reserved. Design &amp; Coded with ♥</span>

      <div className="flex gap-6">
        {links.map((l) => (
          <a key={l} href="#" className="hover:text-foreground transition-colors">
            {l}
          </a>
        ))}
      </div>

      <a href="#" className="hover:text-foreground transition-colors">
        Back to top ↑
      </a>
    </footer>
  );
}
