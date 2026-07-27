"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";

/**
 * The seam between a project's two layers.
 *
 * The surface layer ends against a paper panel split across the middle. As the
 * section pins, the two halves draw apart like a bonnet opening and the machine
 * underneath is revealed: an ink ground that starts held back and settles
 * forward as the gap widens. It is one composed switch, not decoration — the
 * page genuinely changes register here, from what a user sees to what runs
 * underneath, and the motion is what makes that legible.
 *
 * The doors default to open in CSS, so with no JavaScript the reveal is simply
 * already done rather than a paper panel stuck over the content.
 */
export function HoodCurtain({ title }: { title: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // The doors are parked open in CSS so a no-JS page is simply already
        // revealed. Arming resets that transform to none, which matters:
        // GSAP composes yPercent on top of whatever transform it finds, so
        // leaving the CSS translate in place made the doors start open and
        // slide further open instead of parting.
        root.classList.add("is-armed");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${String(window.innerHeight * 1.1)}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          "[data-hood-door='top']",
          { yPercent: 0 },
          { yPercent: -100, ease: "power2.inOut", duration: 1 },
          0,
        )
          .fromTo(
            "[data-hood-door='bottom']",
            { yPercent: 0 },
            { yPercent: 100, ease: "power2.inOut", duration: 1 },
            0,
          )
          // The seam is the light in the gap: brightest as the doors part, gone
          // once they are out of the way.
          .fromTo(
            "[data-hood-seam]",
            { scaleX: 0.12, autoAlpha: 1 },
            { scaleX: 1, autoAlpha: 0, ease: "power2.out", duration: 0.7 },
            0,
          )
          .fromTo(
            "[data-hood-reveal]",
            { scale: 0.72, autoAlpha: 0, y: 24 },
            { scale: 1, autoAlpha: 1, y: 0, ease: "power3.out", duration: 0.9 },
            0.15,
          );

        ScrollTrigger.refresh();
      });

      return () => {
        mm.revert();
        root.classList.remove("is-armed");
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className="hood-curtain">
      <div data-hood-reveal className="hood-reveal">
        <p className="font-mono text-fine tracking-[0.24em] uppercase">
          Under the hood
        </p>
        <p className="type-display mt-4 max-w-[16ch] text-display leading-[0.95] font-semibold">
          {title}
        </p>
      </div>

      <div data-hood-door="top" className="hood-door hood-door--top" />
      <div data-hood-door="bottom" className="hood-door hood-door--bottom" />
      <span data-hood-seam className="hood-seam" aria-hidden="true" />
    </div>
  );
}
