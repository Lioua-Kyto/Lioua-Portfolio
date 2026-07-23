"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";

/**
 * Pins the Work section and pulls its track right to left as you scroll,
 * releasing once the last card has cleared. The pin consumes exactly the
 * track's overflow, so the travel tracks the scroll 1:1 and reverses on the
 * way back with no leftover scroll at either end. The card nearest the middle
 * of the viewport is marked active so it reads at full strength while the
 * others sit back.
 *
 * Below `lg` the track stays a normal horizontal scroller — pinning a narrow
 * screen costs more than it gives, and touch already swipes sideways. Renders
 * no markup; a controller for the section it sits inside.
 */
export function WorkRail() {
  useGSAP(() => {
    const section = document.querySelector<HTMLElement>("[data-work]");
    const viewport = document.querySelector<HTMLElement>(
      "[data-rail-viewport]",
    );
    const track = document.querySelector<HTMLElement>("[data-rail-track]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]");
    if (!section || !viewport || !track || cards.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const overflow = () =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (overflow() === 0) return;

      // Whichever card sits closest to the middle of the screen is the one
      // being read. Measured from the live rects so it stays correct however
      // the track is eased.
      const markActive = () => {
        const mid = window.innerWidth / 2;
        let best = 0;
        let bestDistance = Infinity;
        for (const [i, card] of cards.entries()) {
          const rect = card.getBoundingClientRect();
          const distance = Math.abs(rect.left + rect.width / 2 - mid);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        }
        for (const [i, card] of cards.entries()) {
          card.dataset.active = i === best ? "true" : "false";
        }
      };

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
            onUpdate: markActive,
            onRefresh: markActive,
          },
        },
      );
    });

    mm.add("(max-width: 1023.98px)", () => {
      viewport.style.overflowX = "auto";
      // Nothing is "centred" on a swipeable row, so let every card read fully.
      for (const card of cards) card.dataset.active = "true";
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
