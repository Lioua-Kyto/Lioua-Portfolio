"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";
import { useMotionEnabled } from "@/lib/motion/preference";

/**
 * The portrait as a fixed backdrop: crisp and large while the hero owns the
 * screen, then blurring and receding as you scroll out of it — and staying
 * there, softly, behind every following section. Scrubbed to scroll, so it
 * reverses exactly on the way back. It sits behind all content and is purely
 * decorative, so it never intercepts pointer events or the a11y tree.
 */
export function PortraitBackdrop() {
  const scope = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();

  useGSAP(
    () => {
      const image =
        scope.current?.querySelector<HTMLElement>("[data-portrait]");
      const hero = document.querySelector("#intro");
      if (!image || !hero) return;

      if (!motionEnabled) {
        // Static: settle straight to the soft backdrop state, no scrubbing.
        gsap.set(image, { filter: "blur(22px)", opacity: 0.16, scale: 1.08 });
        return;
      }

      image.style.willChange = "transform, filter, opacity";
      gsap.fromTo(
        image,
        { filter: "blur(0px)", opacity: 1, scale: 1, yPercent: 0 },
        {
          filter: "blur(26px)",
          opacity: 0.16,
          scale: 1.12,
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: scrub.portrait,
          },
        },
      );

      return () => {
        image.style.willChange = "";
      };
    },
    { scope, dependencies: [motionEnabled] },
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 flex items-end justify-center overflow-hidden"
    >
      <Image
        data-portrait
        src="/img/portrait.webp"
        alt=""
        width={1400}
        height={1050}
        priority
        sizes="(max-width: 768px) 170vw, 95vw"
        className="h-[68vh] w-auto max-w-none object-contain sm:h-[80vh]"
      />
    </div>
  );
}
