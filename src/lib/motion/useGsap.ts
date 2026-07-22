"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { loadGsap, type GsapBundle } from "@/lib/motion/gsapClient";

// Client components still server-render; useLayoutEffect would warn there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The mandatory wrapper for all GSAP work (brief §2.2): loads the async GSAP
 * bundle, runs `setup` inside a `gsap.context()` scoped to `scope`, and
 * reverts the context on unmount — killing every tween and ScrollTrigger
 * created inside it, which covers App Router route changes (no full reload).
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (bundle: GsapBundle) => void,
  deps: readonly unknown[] = [],
): void {
  useIsomorphicLayoutEffect(() => {
    let cancelled = false;
    let context: { revert: () => void } | null = null;
    void loadGsap().then((bundle) => {
      if (cancelled || !scope.current) return;
      context = bundle.gsap.context(() => {
        setup(bundle);
      }, scope);
    });
    return () => {
      cancelled = true;
      context?.revert();
    };
    // Callers own their dependency list — the hook cannot statically know it.
  }, deps);
}
