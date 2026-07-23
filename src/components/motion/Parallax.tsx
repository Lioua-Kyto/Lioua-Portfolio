"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { useMotionEnabled } from "@/lib/motion/preference";

/**
 * Scroll parallax for imagery: the inner content drifts against the scroll
 * inside an overflow-hidden frame, scrubbed through the shared
 * ScrollTrigger↔Lenis loop (no new listener). The inner is taller than the
 * frame so the drift never reveals an edge. With motion off it sits still.
 */
export function Parallax({
  children,
  className,
  style,
  amount = 12,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Percent of travel across a full viewport pass. */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();

  useGSAP(
    () => {
      const root = ref.current;
      const inner = root?.querySelector<HTMLElement>("[data-parallax-inner]");
      if (!root || !inner) return;
      if (!motionEnabled) {
        gsap.set(inner, { clearProps: "transform" });
        return;
      }
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
    },
    { scope: ref, dependencies: [motionEnabled] },
  );

  return (
    <div
      ref={ref}
      style={style}
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
