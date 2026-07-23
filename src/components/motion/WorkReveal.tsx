"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";

/**
 * Pins the Work section and advances the right-hand stack one project at a
 * time as you scroll: exactly one card is visible at a moment, the next rising
 * as the current one leaves, while the left index marks where you are. Below
 * the pin breakpoint the cards are a plain stacked list and this does nothing.
 * Renders no markup — a controller for the section it sits inside.
 */
export function WorkReveal({ count }: { count: number }) {
  useGSAP(() => {
    const section = document.querySelector<HTMLElement>("[data-work]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-work-card]");
    const indices = gsap.utils.toArray<HTMLElement>("[data-work-index]");
    if (!section || cards.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Only the first card shows to begin with.
      gsap.set(cards, { autoAlpha: 0, yPercent: 8 });
      gsap.set(cards[0] ?? null, { autoAlpha: 1, yPercent: 0 });

      const setActive = (i: number) => {
        for (const [j, el] of indices.entries()) {
          el.dataset.active = j === i ? "true" : "false";
        }
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // One viewport of scroll per handover, plus a little dwell.
          end: () => `+=${String(window.innerHeight * count * 0.85)}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(count - 1, Math.floor(self.progress * count));
            setActive(i);
          },
        },
      });

      // Each step: the current card leaves upward as the next rises in.
      for (let i = 1; i < cards.length; i++) {
        tl.to(cards[i - 1] ?? null, {
          autoAlpha: 0,
          yPercent: -8,
          ease: "power1.inOut",
          duration: 0.5,
        }).fromTo(
          cards[i] ?? null,
          { autoAlpha: 0, yPercent: 8 },
          { autoAlpha: 1, yPercent: 0, ease: "power1.inOut", duration: 0.5 },
          "<",
        );
        // A beat of dwell so each project can be read before the next.
        tl.to({}, { duration: 0.4 });
      }

      return () => {
        ScrollTrigger.refresh();
      };
    });

    mm.add("(max-width: 1023.98px)", () => {
      // Plain list: make sure nothing is left hidden by the desktop set().
      gsap.set(cards, { clearProps: "all" });
    });

    return () => {
      mm.revert();
    };
  });

  return null;
}
