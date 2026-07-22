"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";

/**
 * A slow textural marquee (V3 motion spec §4) — one band of discipline
 * phrases looping between sections, easing to near-stop on hover. Two copies
 * of the track make the `-50%` loop seamless; reduced motion leaves it static.
 * Purely decorative, so `aria-hidden`.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const track = root?.querySelector<HTMLElement>("[data-marquee-track]");
      if (!root || !track) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(track, {
          xPercent: -50,
          duration: 40,
          ease: "none",
          repeat: -1,
        });
        const slow = () => {
          gsap.to(tween, { timeScale: 0.12, duration: 0.4 });
        };
        const resume = () => {
          gsap.to(tween, { timeScale: 1, duration: 0.4 });
        };
        root.addEventListener("pointerenter", slow);
        root.addEventListener("pointerleave", resume);
        return () => {
          root.removeEventListener("pointerenter", slow);
          root.removeEventListener("pointerleave", resume);
        };
      });
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
                className="type-serif flex items-center gap-8 pr-8 text-title font-medium text-slate/70"
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
