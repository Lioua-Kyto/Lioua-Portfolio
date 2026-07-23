"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { dur, ease, stagger } from "@/lib/motion/tokens";

/**
 * The site's section-reveal controller: everything marked `data-reveal` rises
 * and fades in as it enters, and drops back out on the way up, so no reveal
 * needs a reload to see again. The hero's own choreography lives in
 * `HeroScene`; this handles every section below it.
 */
export function Motion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const targets = root.querySelectorAll("[data-reveal]");
      if (targets.length === 0) return;

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
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
