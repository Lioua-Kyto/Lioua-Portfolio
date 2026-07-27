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
    // Always open at the top of the hero. The browser otherwise restores the
    // previous scroll on reload, which drops you mid-page while the hero's
    // load animation plays over whatever section you were on. `manual` is also
    // set pre-paint by an inline script in the layout; this handles the
    // current load and any bfcache restore.
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // Luxe momentum glide — a low lerp gives the weighted, heynesh-grade
    // feel where scroll settles rather than snaps.
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      wheelMultiplier: 0.9,
    });
    lenisRef.current = lenis;
    lenis.scrollTo(0, { immediate: true });
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });
    const unsubscribe = ticker.add((now) => {
      lenis.raf(now);
    });
    // Re-measure once the pins exist, now that we are pinned at the top.
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    // And again once the display face has swapped in. Until then every heading
    // is measured in the fallback metrics, which shifts each section by tens of
    // pixels — enough for a reveal start line to end up past the element it
    // watches, so the heading stayed hidden until a reload measured it again.
    let stale = false;
    void document.fonts.ready.then(() => {
      if (!stale) ScrollTrigger.refresh();
    });
    return () => {
      stale = true;
      cancelAnimationFrame(raf);
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
