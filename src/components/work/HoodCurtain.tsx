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

        // Three beats, in order, so the seam is its own moment before the
        // doors move: a hairline of light appears on the shut join, widens to
        // full span, and only once it has gone do the doors part. Everything
        // is on one scrubbed timeline (total ~1), so the beats can't overlap
        // however fast the reader scrolls.

        // A — the seam: grows from a point and brightens, then fades, doors
        // still shut. One keyframed tween, not a fromTo-then-to: under scrub
        // the second tween's start value is ambiguous and the fade never ran.
        tl.fromTo(
          "[data-hood-seam]",
          { scaleX: 0.04, autoAlpha: 0 },
          {
            keyframes: {
              "0%": { scaleX: 0.04, autoAlpha: 0 },
              "55%": { scaleX: 1, autoAlpha: 1 },
              "100%": { scaleX: 1, autoAlpha: 0 },
            },
            ease: "none",
            duration: 0.26,
          },
          0,
        );

        // B — the doors part, revealing the machine behind. They only begin
        // once the seam is gone.
        tl.fromTo(
          "[data-hood-door='top']",
          { yPercent: 0 },
          { yPercent: -100, ease: "power2.inOut", duration: 0.66 },
          0.28,
        ).fromTo(
          "[data-hood-door='bottom']",
          { yPercent: 0 },
          { yPercent: 100, ease: "power2.inOut", duration: 0.66 },
          0.28,
        );

        // C — the title resolves in place, dead centre, as the gap opens, and
        // then simply stays. It used to dissolve before the pin released, which
        // read as the title "fading away" mid-scroll; now it holds full and
        // rides up with the curtain into the backend, where the sticky header
        // carries the same name on from the top. No y-travel — sliding it up to
        // centre was the older "teleport".
        tl.fromTo(
          "[data-hood-reveal]",
          { scale: 0.94, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, ease: "power2.out", duration: 0.4 },
          0.4,
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
