"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { prefersReducedMotion } from "@/lib/motion/reduced";
import { ease } from "@/lib/motion/tokens";

const HOLD_S = 1.9;
const SWAP_S = 0.55;

/**
 * The hero's rotating descriptor: a stack of honest role words cycling with a
 * vertical slide + fade, one every ~2.4s, looping. All words occupy one grid
 * cell; only transforms/opacity animate. With motion off they crossfade in
 * place instead. The full list is the accessible label.
 */
export function RotatingWords({
  words,
  className,
}: {
  words: readonly string[];
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-word]", root);
      const first = items[0];
      if (!first || items.length < 2) return;

      const travel = !prefersReducedMotion();
      gsap.set(items, { yPercent: travel ? 100 : 0, autoAlpha: 0 });
      gsap.set(first, { yPercent: 0, autoAlpha: 1 });

      const tl = gsap.timeline({ repeat: -1 });
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const next = items[(index + 1) % items.length];
        if (!item || !next) continue;
        tl.to(item, {
          yPercent: travel ? -100 : 0,
          autoAlpha: 0,
          duration: SWAP_S,
          ease: travel ? ease.inOut : "none",
          delay: HOLD_S,
        }).fromTo(
          next,
          { yPercent: travel ? 100 : 0, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: SWAP_S,
            ease: travel ? ease.inOut : "none",
          },
          "<",
        );
      }
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-label={words.join(", ")}
      className={["relative inline-grid", className].filter(Boolean).join(" ")}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${String(index)}`}
          data-word
          aria-hidden="true"
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {word}
        </span>
      ))}
    </span>
  );
}
