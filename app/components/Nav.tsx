import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background flex items-center justify-between px-24 py-5">
      <span className="text-sm font-medium">Abdenour Akrour</span>

      <nav className="flex items-center gap-8">
        <a href="#about" className="text-sm hover:opacity-50 transition-opacity">About</a>
        <a href="#work" className="text-sm hover:opacity-50 transition-opacity">Work</a>
        <a href="#process" className="text-sm hover:opacity-50 transition-opacity">Process</a>
        <a href="#contact" className="text-sm hover:opacity-50 transition-opacity">Drop me a line</a>
      </nav>

      <ThemeToggle />
    </header>
  );
}
