// Tiny global store for the full-screen "circle" overlays (contact form, CV),
// so any button on the page can open them from its own position.
export type OverlayKind = "contact" | "cv";
export type OverlayOrigin = { x: number; y: number; r: number };
type State = { kind: OverlayKind | null; origin: OverlayOrigin };

let state: State = { kind: null, origin: { x: 0, y: 0, r: 0 } };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function subscribeOverlay(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const getOverlayState = () => state;

/** Opens an overlay growing out of `el` (the clicked button). */
export function openOverlay(kind: OverlayKind, el: Element) {
  const b = el.getBoundingClientRect();
  state = { kind, origin: { x: b.left + b.width / 2, y: b.top + b.height / 2, r: Math.max(b.width, b.height) / 2 } };
  emit();
}

/** Keeps the origin so the circle shrinks back into the same button. */
export function closeOverlay() {
  state = { ...state, kind: null };
  emit();
}
