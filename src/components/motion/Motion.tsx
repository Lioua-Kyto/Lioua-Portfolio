"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { dur, ease, stagger } from "@/lib/motion/tokens";
import { useMotionEnabled } from "@/lib/motion/preference";

/**
 * The site's motion controller. One `useGSAP` scope covers the page and
 * branches on the motion preference (OS default, overridable in-page).
 * Everything is REVERSIBLE — scrolling back plays each reveal backwards, so
 * nothing needs a reload to see again.
 *   - the giant hero name rises from behind its mask on mount;
 *   - hero content travels up and fades as the hero scrolls away;
 *   - section reveals batch in on enter and back out on leave-back.
 * With motion off, the same content simply fades in — no travel, no scrub.
 */
export function Motion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const targets = root.querySelectorAll("[data-reveal]");

      if (!motionEnabled) {
        // Reduced: gentle opacity-only fades, no movement (vestibular-safe).
        if (targets.length === 0) return;
        gsap.set(targets, { clearProps: "transform" });
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
        return;
      }

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

      // Hero content travels up and clears out as the hero scrolls away,
      // leaving the softened portrait behind. Scrubbed = reversible.
      const hero = root.querySelector("#intro");
      if (hero) {
        gsap.to("[data-hero-exit]", {
          yPercent: -22,
          autoAlpha: 0,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom 40%",
            scrub: 0.4,
          },
        });
      }

      // Section reveals — reversible: in on enter, out on leave-back.
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
    },
    { scope, dependencies: [motionEnabled] },
  );

  return <div ref={scope}>{children}</div>;
}
