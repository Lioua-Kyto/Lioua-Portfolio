"use client";

import { useEffect } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { ScrollTrigger } from "@/lib/motion/gsap";

/**
 * Makes every in-page link land its target flush with the top of the screen.
 *
 * Native anchor jumps set the scroll position directly, which Lenis then
 * animates away from toward its own target — the page drifts back and the
 * section ends up parked mid-screen. One delegated listener hands the jump to
 * Lenis instead, so it owns the movement from the start.
 *
 * Renders nothing; mounted once alongside the scroll provider.
 */
export function AnchorScroll() {
  const { getLenis } = useSmoothScroll();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target0 = event.target;
      const anchor = target0 instanceof Element ? target0.closest("a") : null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      const lenis = getLenis();
      if (!target || !lenis) return;

      event.preventDefault();
      // Pinned sections shift where a target actually starts, so make sure
      // ScrollTrigger's measurements are current before resolving the offset.
      ScrollTrigger.refresh();
      // The hero is pinned: resolving `#intro` lands at the END of its pin
      // (mid-morph), not the top. Home always means the very top of the page.
      if (href === "#intro") {
        lenis.scrollTo(0, { offset: 0, duration: 1.1 });
      } else {
        lenis.scrollTo(target, { offset: 0, duration: 1.1 });
      }
      history.replaceState(null, "", href);

      // Keyboard users still need focus to follow the jump.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [getLenis]);

  return null;
}
