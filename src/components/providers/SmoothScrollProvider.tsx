"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import { loadGsap } from "@/lib/motion/gsapClient";
import { ticker } from "@/lib/motion/ticker";

interface SmoothScrollContextValue {
  /** The single Lenis instance, or null before mount / under reduced motion. */
  getLenis: () => Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(
  null,
);

/**
 * Owns the site's one Lenis instance (brief §2.2), driven by the shared
 * ticker. Mounted once in the root layout; children stay server-rendered.
 * Under prefers-reduced-motion no Lenis is created — native scroll only.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const valueRef = useRef<SmoothScrollContextValue>({
    getLenis: () => lenisRef.current,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;
    // Lenis and GSAP arrive as async chunks after first paint (§2.3) — the
    // page scrolls natively until smoothing takes over.
    void Promise.all([import("lenis"), loadGsap()]).then(
      ([{ default: LenisClass }, { ScrollTrigger }]) => {
        if (cancelled) return;
        const lenis = new LenisClass({ autoRaf: false });
        lenisRef.current = lenis;
        // Smoothed scroll position must feed ScrollTrigger, or triggers lag.
        lenis.on("scroll", () => {
          ScrollTrigger.update();
        });
        unsubscribe = ticker.add((now) => {
          lenis.raf(now);
        });
      },
    );
    return () => {
      cancelled = true;
      unsubscribe?.();
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={valueRef.current}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

/** Access the shared Lenis instance; throws outside SmoothScrollProvider. */
export function useSmoothScroll(): SmoothScrollContextValue {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error("useSmoothScroll requires <SmoothScrollProvider>");
  }
  return context;
}
