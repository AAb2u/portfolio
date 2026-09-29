import type Lenis from "lenis";

// Shared Lenis instance so components can scroll to targets and lock scrolling
// (menu, contact form, loader) without fighting the smooth-scroll loop.
let lenis: Lenis | null = null;
let locks = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis && locks > 0) lenis.stop();
}

export function scrollToY(top: number) {
  if (lenis) lenis.scrollTo(top, { duration: 1.4 });
  else window.scrollTo({ top, behavior: "smooth" });
}

/** Returns an unlock function; nested locks are counted. */
export function lockScroll() {
  locks++;
  document.body.style.overflow = "hidden";
  lenis?.stop();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks > 0) return;
    document.body.style.overflow = "";
    lenis?.start();
  };
}
