"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";

/**
 * Project pages arrive from below and leave the same way.
 *
 * A project reads as something opened on top of the work rather than a place
 * you were sent to, so it slides up over the paper and slides back down when
 * you leave. The route really does change underneath — this only moves the
 * page that the router has already swapped in.
 *
 * Only `/work/*` is ever transformed. The home page pins its hero and fixes
 * its rail, and a transform on an ancestor would re-root every one of those
 * fixed elements to this wrapper; a project page at the top of its scroll has
 * nothing fixed, so it is safe to move. The transform is cleared the moment
 * the travel finishes, so nothing is left holding a containing block.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    const first = previous.current === null;
    previous.current = pathname;
    if (!el) return;

    // A cold load lands where it lands: sliding here would only delay the
    // largest paint on a page a reader asked for directly.
    if (first) return;

    if (!pathname.startsWith("/work/")) {
      // Coming back out. The leave tween left the wrapper pushed down, so the
      // arriving page has to be put back before it is ever painted.
      gsap.set(el, { clearProps: "transform,willChange" });
      return;
    }

    gsap.fromTo(
      el,
      { y: () => window.innerHeight, willChange: "transform" },
      {
        y: 0,
        duration: 0.62,
        ease: "power3.out",
        clearProps: "transform,willChange",
        // Re-measure once the transform is gone.
        //
        // While this wrapper is translated, every element on the page reports a
        // position up to a full viewport below where it will actually rest. Any
        // ScrollTrigger that measures in that window — and the arriving page
        // refreshes as soon as its images decode — bakes in the offset and
        // keeps it after the transform clears. That is why the curtain misbehaved
        // only on a *second* visit to a project: the first visit's images load
        // slowly enough that the refresh lands after this tween, while cached
        // ones land in the middle of it. A reload "fixed" it because a cold load
        // never runs this transition at all.
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      },
    );
  }, [pathname]);

  return (
    <div ref={wrap} data-page>
      {children}
    </div>
  );
}

/**
 * Slides the current page down and off before handing over to the router.
 *
 * Exported as a plain function so any link can use it: the page has to be
 * moved before the navigation, because once the router pushes, this page is
 * gone and there is nothing left to animate.
 */
export function slideAway(done: () => void) {
  const el = document.querySelector<HTMLElement>("[data-page]");
  if (!el) {
    done();
    return;
  }
  gsap.to(el, {
    y: () => window.innerHeight,
    duration: 0.46,
    ease: "power3.in",
    willChange: "transform",
    onComplete: done,
  });
}
