"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/motion/gsap";
import { ticker } from "@/lib/motion/ticker";

interface SmoothScrollContextValue {
  /** The single Lenis instance, or null before mount. */
  getLenis: () => Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(
  null,
);

/**
 * Owns the site's one Lenis instance, driven by the shared Ticker — one rAF
 * loop total (V3 motion spec §1). Lenis scroll feeds `ScrollTrigger.update()`
 * so scrubs/triggers track the smoothed position. Mounted once in the root
 * layout; children stay server-rendered. Lenis smooths the native scroll —
 * it never hijacks it — so it stays on for everyone.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const valueRef = useRef<SmoothScrollContextValue>({
    getLenis: () => lenisRef.current,
  });

  useEffect(() => {
    // Luxe momentum glide — a low lerp gives the weighted, heynesh-grade
    // feel where scroll settles rather than snaps.
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });
    const unsubscribe = ticker.add((now) => {
      lenis.raf(now);
    });
    return () => {
      unsubscribe();
      lenis.destroy();
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
