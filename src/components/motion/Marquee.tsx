"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";

/**
 * A textural band of discipline phrases between sections, drawn left to right
 * by the scroll. Two copies of the track make the `-50%` travel seamless.
 *
 * It is scroll-driven rather than autoplaying, which is the same bargain the
 * rest of the site makes: motion that only advances while the reader is
 * actively scrolling carries none of the vestibular risk of a loop that plays
 * on its own, so it does not have to be stilled under prefers-reduced-motion —
 * where, as an autoplaying marquee, it simply never moved. Decorative, so
 * hidden from assistive tech.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const track = root?.querySelector<HTMLElement>("[data-marquee-track]");
      if (!root || !track) return;

      // Travels left to right: the track starts shifted a full copy to the
      // left and walks back to zero as the band crosses the viewport, so it
      // reads against the direction the Work rail above it just moved.
      gsap.fromTo(
        track,
        { xPercent: -50 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: scrub.rail,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="hairline overflow-hidden border-b border-b-ink/14 py-6 select-none"
    >
      <div data-marquee-track className="flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0">
            {items.map((item) => (
              <li
                key={`${String(copy)}-${item}`}
                className="type-display flex items-center gap-8 pr-8 text-title font-medium text-slate/70"
              >
                {item}
                <span className="text-signal" aria-hidden="true">
                  ·
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
