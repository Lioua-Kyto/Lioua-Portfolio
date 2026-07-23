"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { disperse, dur, ease, pin, scrub, stagger } from "@/lib/motion/tokens";

/** Base travel for the dispersal, scaled per group by the `disperse` tokens. */
const TRAVEL_X = -220;
const TRAVEL_Y = -140;

/**
 * The hero's two-act choreography.
 *
 * Act one, on load: the giant name rises alone from behind its mask, and only
 * once it is settling do the routes, proof numbers, claim, capabilities, and
 * footnote arrive — each from its own direction, on its own delay.
 *
 * Act two, on scroll: the hero pins and those same elements disperse toward
 * the left rail at different speeds (`disperse`), while the rail fades up to
 * receive them. One scrubbed timeline drives both halves, so the chrome reads
 * as relocating rather than swapping, and reverses exactly on scroll-back.
 *
 * Below the rail's breakpoint there is nothing to relocate into, so the hero
 * simply travels away like any other section. Renders no markup — it is a
 * controller for elements its siblings own.
 */
export function HeroScene() {
  useGSAP(() => {
    const hero = document.querySelector<HTMLElement>("#intro");
    if (!hero) return;

    const group = (key: string) =>
      gsap.utils.toArray<HTMLElement>(`[data-hero="${key}"]`);

    // ---- Act one: the entrance. The title lands first, alone. ----
    // Hide everything up front, pre-paint. A timeline only applies a tween's
    // start values when the playhead reaches it, so without this the
    // supporting matter would sit fully visible for the length of the title's
    // rise and then blink out to fade back in.
    const words = gsap.utils.toArray<HTMLElement>("[data-hero-word]");
    gsap.set(words, { yPercent: 112 });
    gsap.set(group("nav"), { y: 20, autoAlpha: 0 });
    gsap.set(group("stats"), { x: -48, autoAlpha: 0 });
    gsap.set(group("lede"), { y: 44, autoAlpha: 0 });
    gsap.set(group("capabilities"), { x: 48, autoAlpha: 0 });
    gsap.set(group("tagline"), { autoAlpha: 0 });

    let mm: ReturnType<typeof gsap.matchMedia> | null = null;

    // Every step is a fromTo with explicit endpoints: a bare `from` re-reads
    // the element's current position as its destination, so a second effect
    // pass (StrictMode, fast refresh) would capture the offset start state and
    // strand the element there.
    gsap
      .timeline({
        // Act two is built only once act one has landed. A scrubbed timeline
        // re-renders progress 0 on every ScrollTrigger.refresh(), stamping its
        // start values (autoAlpha: 1) back onto the very elements the entrance
        // is trying to hold hidden — so the two cannot coexist. Deferring the
        // build is the only way to keep the entrance's staging intact.
        onComplete: () => {
          mm = buildDispersal();
          ScrollTrigger.refresh();
        },
      })
      .fromTo(
        words,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration: dur.title,
          ease: ease.title,
          stagger: stagger.hero,
        },
      )
      .fromTo(
        group("nav"),
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: dur.reveal,
          ease: ease.out,
          stagger: 0.06,
        },
        "-=0.95",
      )
      .fromTo(
        group("stats"),
        { x: -48, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: dur.reveal,
          ease: ease.out,
          stagger: 0.09,
        },
        "<0.12",
      )
      .fromTo(
        group("lede"),
        { y: 44, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: dur.slow, ease: ease.out },
        "<0.1",
      )
      .fromTo(
        group("capabilities"),
        { x: 48, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: dur.reveal,
          ease: ease.out,
          stagger: 0.07,
        },
        "<0.08",
      )
      .fromTo(
        group("tagline"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: dur.slow, ease: "none" },
        "<0.35",
      );

    // ---- Act two: the pinned dispersal. Only where the rail exists. ----
    function buildDispersal() {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px)", () => {
        const rail = document.querySelector<HTMLElement>("[data-rail]");
        const railItems = gsap.utils.toArray<HTMLElement>("[data-rail-item]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: () => `+=${String(window.innerHeight * pin.hero)}`,
            pin: true,
            scrub: scrub.hero,
            invalidateOnRefresh: true,
          },
        });

        // Explicit fromTo from the settled state: each group leaves at its own
        // multiple of the base travel, so the set disperses at different
        // speeds instead of sliding away as one slab.
        for (const [key, speed] of Object.entries(disperse)) {
          tl.fromTo(
            group(key),
            { x: 0, y: 0, autoAlpha: 1, scale: 1 },
            {
              x: TRAVEL_X * speed,
              y: TRAVEL_Y * speed,
              autoAlpha: 0,
              scale: 0.94,
              ease: "none",
              stagger: 0.02,
            },
            0,
          );
        }

        // The rail arrives to catch them, a beat after they set off.
        if (rail) {
          tl.fromTo(
            rail,
            { autoAlpha: 0, x: -28 },
            { autoAlpha: 1, x: 0, ease: "none" },
            0.45,
          ).fromTo(
            railItems,
            { autoAlpha: 0, x: -18 },
            { autoAlpha: 1, x: 0, ease: "none", stagger: 0.08 },
            0.5,
          );
        }
      });

      media.add("(max-width: 1023.98px)", () => {
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

      return media;
    }

    return () => {
      mm?.revert();
    };
  });

  return null;
}
