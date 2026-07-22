"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { dur, ease, stagger, scrub } from "@/lib/motion/tokens";

/**
 * The site's motion controller (V3 motion spec §2–4, §6). One `useGSAP`
 * scope covers the whole page; a single `matchMedia` authors the reduced
 * branch (nothing hidden, nothing moves) alongside the full branch:
 *   - hero timeline, once on mount (headline y-only so it never opacity-gates
 *     LCP; supporting elements rise + fade, staggered in reading order);
 *   - section reveals — the workhorse — batched with a stagger, played once,
 *     with a terminal flush so nothing below the last trigger stays hidden;
 *   - the portrait blur, scrubbed to scroll.
 * Children stay server-rendered; only this scope div is client.
 */
export function Motion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero supporting elements rise + fade under the mask-revealing name.
        gsap.from("[data-hero-el]", {
          y: 28,
          autoAlpha: 0,
          duration: dur.reveal,
          ease: ease.out,
          stagger: stagger.hero,
          delay: 0.35,
        });

        // Section reveals — the workhorse. Hide, then batch-reveal on enter;
        // a max-scroll trigger flushes anything the 82% line can't reach.
        const pending = new Set<Element>(
          root.querySelectorAll("[data-reveal]"),
        );
        if (pending.size > 0) {
          gsap.set([...pending], { y: 44, autoAlpha: 0 });
          const reveal = (batch: readonly Element[]) => {
            for (const el of batch) pending.delete(el);
            gsap.to(batch, {
              y: 0,
              autoAlpha: 1,
              duration: dur.reveal,
              ease: ease.out,
              stagger: stagger.tight,
              overwrite: true,
            });
          };
          ScrollTrigger.batch("[data-reveal]", {
            start: "top 82%",
            onEnter: reveal,
          });
          ScrollTrigger.create({
            trigger: document.documentElement,
            start: () => ScrollTrigger.maxScroll(window) - 1,
            once: true,
            onEnter: () => {
              reveal([...pending]);
            },
          });
        }

        // Portrait blur — scrubbed. blur is GPU-heavy, so will-change is set
        // for the life of the scrub and cleared on teardown (§6).
        const portrait = root.querySelector<HTMLElement>("[data-portrait]");
        if (portrait) {
          portrait.style.willChange = "transform, filter";
          gsap.fromTo(
            portrait,
            { filter: "blur(0px)", scale: 1 },
            {
              filter: "blur(6px)",
              scale: 1.06,
              ease: "none",
              scrollTrigger: {
                trigger: portrait,
                start: "top 80%",
                end: "bottom 30%",
                scrub: scrub.portrait,
              },
            },
          );
        }

        return () => {
          if (portrait) portrait.style.willChange = "";
        };
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
