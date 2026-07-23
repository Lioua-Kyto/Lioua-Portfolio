"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { disperse, pin, scrub } from "@/lib/motion/tokens";

/**
 * Hero groups that have a counterpart in the rail travel to it; the rest are
 * not represented there, so they simply leave.
 */
const RELOCATES: Record<string, string> = {
  title: "name",
  nav: "nav",
  stats: "stats",
  lede: "claim",
};

interface Move {
  el: HTMLElement;
  x: number;
  y: number;
  scale: number;
}

/**
 * The hero's two-act choreography.
 *
 * Act one, on load: the name rises alone from behind its mask, the portrait
 * resolves in behind it, and only then does the supporting matter arrive, each
 * group from its own direction on its own delay.
 *
 * Act two, on scroll: the hero pins, and every group that the rail also holds
 * is carried to its slot there and cross-faded into it, so the chrome visibly
 * relocates rather than vanishing and reappearing. Groups with no counterpart
 * disperse at their own speed instead.
 *
 * Both acts are built at mount. They can coexist because they animate
 * different nodes — the entrance drives the inner `data-hero-in`, the scroll
 * drives the outer `data-hero` — which matters structurally: building a pin
 * later than its neighbours leaves every trigger measured before it holding
 * stale positions, which is what made the projects scene fire over the
 * experience section and strand the triggers after it.
 */
export function HeroScene() {
  useGSAP(() => {
    const hero = document.querySelector<HTMLElement>("#intro");
    if (!hero) return;

    const group = (key: string) =>
      document.querySelector<HTMLElement>(`[data-hero="${key}"]`);

    // Act one, the entrance, is pure CSS (see globals.css) so it plays at
    // first paint instead of waiting on hydration — the portrait is the
    // largest element on the page, and gating it on the bundle put the whole
    // of LCP behind script evaluation.
    //
    // ---- Act two: pin, relocate, disperse. Only where the rail exists. ----
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const rail = document.querySelector<HTMLElement>("[data-rail]");
      const railItems = gsap.utils.toArray<HTMLElement>("[data-rail-item]");

      // Where each relocating group has to land. Measured with transforms
      // cleared, and re-measured whenever ScrollTrigger recalculates, so a
      // resize does not leave the group aiming at a stale slot.
      let moves: Move[] = [];
      const measure = () => {
        const next: Move[] = [];
        for (const [key, slotName] of Object.entries(RELOCATES)) {
          const el = group(key);
          const slot = document.querySelector<HTMLElement>(
            `[data-rail-slot="${slotName}"]`,
          );
          if (!el || !slot) continue;
          gsap.set(el, { clearProps: "transform" });
          const elRect = el.getBoundingClientRect();
          const heroRect = hero.getBoundingClientRect();
          const slotRect = slot.getBoundingClientRect();
          if (elRect.width === 0 || slotRect.width === 0) continue;
          next.push({
            el,
            // The hero is pinned with its top at the viewport top, so an
            // element's offset inside the hero is its on-screen position for
            // the whole of this timeline.
            x: slotRect.left - (elRect.left - heroRect.left),
            y: slotRect.top - (elRect.top - heroRect.top),
            scale: Math.min(1, slotRect.width / elRect.width),
          });
        }
        moves = next;
      };
      measure();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => `+=${String(window.innerHeight * pin.hero)}`,
          pin: true,
          scrub: scrub.hero,
          invalidateOnRefresh: true,
          // The hero pin sits above every other pin on the page and must be
          // recalculated before them, or their start positions are computed
          // against a document height that does not include this pin's spacer.
          refreshPriority: 10,
          onRefreshInit: measure,
        },
      });

      for (const key of Object.keys(RELOCATES)) {
        const el = group(key);
        if (!el) continue;
        const move = () => moves.find((m) => m.el === el);
        tl.fromTo(
          el,
          { x: 0, y: 0, scale: 1, transformOrigin: "left top" },
          {
            x: () => move()?.x ?? 0,
            y: () => move()?.y ?? 0,
            scale: () => move()?.scale ?? 1,
            ease: "none",
          },
          0,
        );
        // It stays solid for most of the flight and clears just before the
        // rail lights up. Overlapping the two fades shows both copies at once
        // and reads as a duplicate rather than a handover.
        tl.to(el, { autoAlpha: 0, ease: "none", duration: 0.18 }, 0.62);
      }

      for (const [key, speed] of Object.entries(disperse)) {
        if (key in RELOCATES) continue;
        const el = group(key);
        if (!el) continue;
        tl.fromTo(
          el,
          { x: 0, y: 0, autoAlpha: 1 },
          {
            x: -220 * speed,
            y: -140 * speed,
            autoAlpha: 0,
            ease: "none",
          },
          0,
        );
      }

      if (rail) {
        tl.fromTo(
          rail,
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: "none", duration: 0.18 },
          0.82,
        ).fromTo(
          railItems,
          { autoAlpha: 0, x: -10 },
          {
            autoAlpha: 1,
            x: 0,
            ease: "none",
            duration: 0.16,
            stagger: 0.03,
          },
          0.84,
        );
      }
    });

    mm.add("(max-width: 1023.98px)", () => {
      gsap.to(gsap.utils.toArray<HTMLElement>("[data-hero]"), {
        yPercent: -18,
        autoAlpha: 0,
        ease: "none",
        stagger: 0.03,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom 40%",
          scrub: scrub.portrait,
        },
      });
    });

    return () => {
      mm.revert();
    };
  });

  return null;
}
