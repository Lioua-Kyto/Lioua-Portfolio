"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { ScrollTrigger } from "@/lib/motion/gsap";

/**
 * Sends every route change back to the top.
 *
 * Lenis owns the scroll position and survives a client-side navigation, so
 * opening a project from the work rail — which sits thousands of pixels down
 * the home page — landed on the new page at that same offset, part way into its
 * second layer. Resetting on the pathname, then refreshing ScrollTrigger once
 * the new page has laid out, means a project always opens at its beginning.
 */
export function RouteScrollReset() {
  const pathname = usePathname();
  const { getLenis } = useSmoothScroll();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    // Only a real navigation resets. On first load the page already opens at
    // the top, and re-asserting it here would fight a reader who starts
    // scrolling immediately — which is exactly what it did.
    const first = previous.current === null;
    previous.current = pathname;
    if (first) return;

    const toTop = () => {
      getLenis()?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };

    // Twice, because the incoming page mounts its own pinned sections and
    // refreshes ScrollTrigger, and a refresh deliberately preserves the
    // current scroll — the very offset being left behind.
    toTop();
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      toTop();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [pathname, getLenis]);

  return null;
}
