"use client";

import { motion } from "@/lib/motion/tokens";

/**
 * GSAP ease names for the motion tokens — GSAP cannot parse CSS
 * `cubic-bezier()` strings, so the curves are registered via CustomEase.
 */
export const gsapEase = {
  out: "tokenOut",
} as const;

export interface GsapBundle {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
}

let bundle: Promise<GsapBundle> | null = null;

/**
 * Load GSAP + plugins as an async chunk, once — keeping the animation
 * runtime out of the LCP-critical bundle. Every GSAP consumer goes through
 * here; the eases are registered before the bundle is handed out.
 */
export function loadGsap(): Promise<GsapBundle> {
  bundle ??= (async () => {
    const [{ gsap }, { ScrollTrigger }, { CustomEase }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/CustomEase"),
    ]);
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create(gsapEase.out, motion.ease.out.join(","));
    return { gsap, ScrollTrigger };
  })();
  return bundle;
}
