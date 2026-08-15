"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";

/**
 * Pins the Work section and pulls its track right to left as you scroll,
 * releasing once the last card has cleared. The pin consumes exactly the
 * track's overflow, so the travel tracks the scroll 1:1 and reverses on the
 * way back with no leftover scroll at either end. Every card reads at full
 * strength throughout — the covers' greyscale-to-colour hover is the rail's
 * only emphasis, so nothing here decides what the reader should be looking at.
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
      // The track travels between two centred positions rather than between
      // its own edges: card 01 sits in the middle of the screen the moment the
      // section pins, and the last card ends there. Anchoring on x:0 meant the
      // first card was already off to the left on arrival and the second one
      // was the one being read.
      // Where the track must sit for `card` to be centred on screen. Measured
      // off the live rect with the current translation backed out, so it is
      // correct whenever it is called — mid-scrub included.
      const centreOffset = (card: HTMLElement) => {
        const x = Number(gsap.getProperty(track, "x"));
        const cardCentre =
          card.getBoundingClientRect().left - x + card.offsetWidth / 2;
        return window.innerWidth / 2 - cardCentre;
      };
      const first = cards[0];
      const last = cards[cards.length - 1];
      if (!first || !last) return;
      const startX = () => centreOffset(first);
      const endX = () => centreOffset(last);
      const travel = () => Math.max(0, startX() - endX());
      // A beat of held scroll after the last card lands, so it is read at full
      // strength before the section lets go.
      const dwell = () => window.innerHeight * 0.45;
      if (travel() === 0) return;

      // An `overflow: hidden` box still has a scroll offset, and focusing a
      // card's link on click makes the browser scroll it into view. Because the
      // track is translated rather than scrolled, that offset is nowhere near
      // where the card is drawn, and the rail jumped sideways by two cards on
      // every click. Any scroll here is undone on the spot.
      const unscroll = () => {
        if (viewport.scrollLeft !== 0) viewport.scrollLeft = 0;
        if (viewport.scrollTop !== 0) viewport.scrollTop = 0;
      };
      viewport.addEventListener("scroll", unscroll, { passive: true });

      // Durations are in scroll pixels, so the travel maps 1:1 and the trailing
      // hold consumes exactly `dwell` of scroll with the track standing still.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${String(travel() + dwell())}`,
          pin: true,
          scrub: scrub.rail,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(
        track,
        { x: () => startX() },
        { x: () => endX(), ease: "none", duration: () => travel() },
        0,
      ).to({}, { duration: () => dwell() });

      // Opening a project freezes the rail where it stands. The click lands a
      // scrub impulse that slid the track a couple of cards left before the
      // transition's cover had closed; disabling the trigger without reverting
      // holds the track still, and the reader last saw it where they clicked.
      // The home page unmounts moments later, so there is nothing to re-enable.
      const freeze = () => tl.scrollTrigger?.disable(false);
      window.addEventListener("project:open", freeze);

      return () => {
        viewport.removeEventListener("scroll", unscroll);
        window.removeEventListener("project:open", freeze);
      };
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
