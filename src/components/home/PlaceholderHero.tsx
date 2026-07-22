"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { dur, ease, stagger } from "@/lib/motion/tokens";

/**
 * Placeholder hero with the v3 intro pattern in miniature (motion spec §2):
 * SSR renders everything visible (LCP-safe), then a once-on-mount timeline
 * takes over pre-paint — elements rise 24px and settle in reading order.
 * Reduced motion is an authored matchMedia branch: no timeline, content
 * simply visible. Replaced by the real hero when the v3 layout lands.
 */
export function PlaceholderHero({
  name,
  thesis,
}: {
  name: string;
  thesis: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-el]", {
          y: 24,
          opacity: 0,
          duration: dur.reveal,
          ease: ease.out,
          stagger: stagger.hero,
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope}>
      <h1 data-hero-el className="type-display text-hero font-extrabold">
        {name}
      </h1>
      <p data-hero-el className="mt-6 max-w-[40ch] text-editorial text-slate">
        {thesis}
      </p>
    </div>
  );
}
