"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { pin, scrub } from "@/lib/motion/tokens";

/**
 * The portrait as a fixed backdrop: crisp and full-height while the hero owns
 * the screen, then blurring and receding across the hero's pinned run — and
 * staying there, softly, behind every following section. Scrubbed to scroll,
 * so it reverses exactly on the way back. It sits behind all content and is
 * purely decorative, so it never intercepts pointer events or the a11y tree.
 */
export function PortraitBackdrop() {
  useGSAP(() => {
    const image = document.querySelector<HTMLElement>("[data-portrait]");
    const hero = document.querySelector<HTMLElement>("#intro");
    if (!image || !hero) return;

    image.style.willChange = "transform, filter, opacity";

    const mm = gsap.matchMedia();

    // The blur runs the length of the hero's pin, so the portrait softens in
    // step with the elements dispersing over it.
    mm.add("(min-width: 1024px)", () => {
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
            end: () => `+=${String(window.innerHeight * pin.hero)}`,
            scrub: scrub.portrait,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    mm.add("(max-width: 1023.98px)", () => {
      gsap.fromTo(
        image,
        { filter: "blur(0px)", opacity: 1, scale: 1 },
        {
          filter: "blur(22px)",
          opacity: 0.16,
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: scrub.portrait,
          },
        },
      );
    });

    return () => {
      mm.revert();
      image.style.willChange = "";
    };
  });

  return (
    <div
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
        sizes="(max-width: 768px) 190vw, 110vw"
        className="h-[80vh] w-auto max-w-none object-contain sm:h-[96vh]"
      />
    </div>
  );
}
