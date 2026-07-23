/**
 * Whether the OS asks for reduced motion.
 *
 * Scroll-driven motion is deliberately NOT gated on this: it only advances
 * while the reader is actively scrolling and stops the moment they do, so it
 * carries none of the vestibular risk of motion that plays on its own. This
 * guard is for the autoplaying loops (marquee, word rotator) — the motion a
 * reader cannot stop — which do settle to a static state when asked.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
