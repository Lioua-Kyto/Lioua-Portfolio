"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { dur, ease, stagger, scrub } from "@/lib/motion/tokens";

/**
 * The site's motion controller. One `useGSAP` scope covers the page; a single
 * `matchMedia` authors both branches (full motion / reduced). Everything is
 * REVERSIBLE — scrolling back plays each reveal backwards, so nothing needs a
 * reload to see again.
 *   - the giant hero name rises from behind its mask on mount;
 *   - supporting hero elements rise + fade beneath it;
 *   - section reveals batch in on enter and back out on leave-back;
 *   - the hero portrait blurs and scales as the hero scrolls away (scrubbed,
 *     so it's inherently reversible).
 */
export function Motion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Giant name — mask reveal on mount.
        gsap.from("[data-hero-word]", {
          yPercent: 108,
          duration: dur.slow,
          ease: ease.out,
          stagger: 0.09,
        });

        // Hero supporting elements rise + fade under the name.
        gsap.from("[data-hero-el]", {
          y: 28,
          autoAlpha: 0,
          duration: dur.reveal,
          ease: ease.out,
          stagger: stagger.hero,
          delay: 0.4,
        });

        // Section reveals — reversible: in on enter, out on leave-back.
        const targets = root.querySelectorAll("[data-reveal]");
        if (targets.length > 0) {
          gsap.set(targets, { y: 44, autoAlpha: 0 });
          ScrollTrigger.batch("[data-reveal]", {
            start: "top 90%",
            onEnter: (batch) => {
              gsap.to(batch, {
                y: 0,
                autoAlpha: 1,
                duration: dur.reveal,
                ease: ease.out,
                stagger: stagger.tight,
                overwrite: true,
              });
            },
            onLeaveBack: (batch) => {
              gsap.to(batch, {
                y: 44,
                autoAlpha: 0,
                duration: dur.micro,
                ease: ease.out,
                overwrite: true,
              });
            },
          });
          // Anything the 90% line can never reach (page bottom) still shows.
          ScrollTrigger.create({
            trigger: document.documentElement,
            start: () => ScrollTrigger.maxScroll(window) - 1,
            onEnter: () => {
              gsap.to(targets, { y: 0, autoAlpha: 1, duration: dur.reveal });
            },
          });
        }

        // Hero portrait softens as the hero scrolls away (scrubbed = reversible).
        const portrait = root.querySelector<HTMLElement>("[data-portrait]");
        const hero = root.querySelector<HTMLElement>("#intro");
        if (portrait && hero) {
          portrait.style.willChange = "transform, filter";
          gsap.fromTo(
            portrait,
            { filter: "blur(0px)", scale: 1, yPercent: 0 },
            {
              filter: "blur(7px)",
              scale: 1.07,
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: scrub.portrait,
              },
            },
          );
        }

        return () => {
          if (portrait) portrait.style.willChange = "";
        };
      });

      // Reduced motion: no movement, parallax, or blur — but a gentle
      // opacity-only fade so the page still feels alive rather than dead.
      // Opacity transitions don't trigger vestibular responses (§6).
      media.add("(prefers-reduced-motion: reduce)", () => {
        const targets = root.querySelectorAll("[data-reveal]");
        if (targets.length === 0) return;
        gsap.set(targets, { autoAlpha: 0 });
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 92%",
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              duration: dur.micro,
              ease: "none",
              stagger: 0.04,
              overwrite: true,
            });
          },
          onLeaveBack: (batch) => {
            gsap.to(batch, {
              autoAlpha: 0,
              duration: dur.micro,
              ease: "none",
              overwrite: true,
            });
          },
        });
        ScrollTrigger.create({
          trigger: document.documentElement,
          start: () => ScrollTrigger.maxScroll(window) - 1,
          onEnter: () => {
            gsap.to(targets, { autoAlpha: 1, duration: dur.micro });
          },
        });
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
