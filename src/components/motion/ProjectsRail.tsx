"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";

/**
 * Pins the products section and pulls its track right-to-left as you scroll,
 * releasing the pin once the last project has cleared the viewport. The pin
 * consumes exactly the track's overflow, so the travel tracks the scroll 1:1
 * and reverses on the way back — no leftover scroll at either end.
 *
 * Below `lg` the track stays a normal horizontal scroller: pinning a narrow
 * screen costs more than it gives, and touch already swipes sideways. Renders
 * no markup — it is a controller for the section it sits inside.
 */
export function ProjectsRail() {
  useGSAP(() => {
    const section = document.querySelector<HTMLElement>("[data-projects]");
    const viewport = document.querySelector<HTMLElement>(
      "[data-rail-viewport]",
    );
    const track = document.querySelector<HTMLElement>("[data-rail-track]");
    if (!section || !viewport || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const overflow = () =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (overflow() === 0) return;

      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => -overflow(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${String(overflow())}`,
            pin: true,
            scrub: scrub.rail,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    mm.add("(max-width: 1023.98px)", () => {
      viewport.style.overflowX = "auto";
      return () => {
        viewport.style.overflowX = "";
      };
    });

    return () => {
      mm.revert();
    };
  });

  return null;
}
