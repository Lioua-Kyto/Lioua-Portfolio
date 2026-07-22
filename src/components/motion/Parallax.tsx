"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";

/**
 * Scroll parallax for imagery: the inner content drifts against the scroll
 * inside an overflow-hidden frame, scrubbed to position through the shared
 * ScrollTrigger↔Lenis loop (no new listener). The inner is scaled up so the
 * drift never reveals an edge. Reduced motion leaves it still.
 */
export function Parallax({
  children,
  className,
  amount = 12,
}: {
  children: ReactNode;
  className?: string;
  /** Percent of travel across a full viewport pass. */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const inner = root?.querySelector<HTMLElement>("[data-parallax-inner]");
      if (!root || !inner) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          inner,
          { yPercent: -amount / 2 },
          {
            yPercent: amount / 2,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className={["overflow-hidden", className].filter(Boolean).join(" ")}
    >
      <div
        data-parallax-inner
        className="h-[118%] w-full will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
