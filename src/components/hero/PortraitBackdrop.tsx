"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { pin, scrub } from "@/lib/motion/tokens";

/**
 * The portrait as a fixed backdrop: it resolves in behind the name on load,
 * holds the first screen at full clarity, then softens and recedes across the
 * hero's pinned run and stays there, faintly, behind every later section.
 *
 * Two nested nodes, for the same reason the hero groups are split: the scroll
 * scrub owns the outer layer while the entrance owns the image itself, so
 * neither overwrites the other's opacity and both can be built at mount.
 */
export function PortraitBackdrop() {
  useGSAP(() => {
    const layer = document.querySelector<HTMLElement>("[data-portrait-layer]");
    const hero = document.querySelector<HTMLElement>("#intro");
    if (!layer || !hero) return;

    layer.style.willChange = "transform, filter, opacity";

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(
        layer,
        { filter: "blur(0px)", opacity: 1, scale: 1, yPercent: 0 },
        {
          filter: "blur(26px)",
          // Faint enough to read as paper texture behind the sections rather
          // than a figure competing with the body copy.
          opacity: 0.09,
          scale: 1.12,
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: () => `+=${String(window.innerHeight * pin.hero)}`,
            scrub: scrub.portrait,
            invalidateOnRefresh: true,
            refreshPriority: 10,
          },
        },
      );
    });

    mm.add("(max-width: 1023.98px)", () => {
      gsap.fromTo(
        layer,
        { filter: "blur(0px)", opacity: 1, scale: 1 },
        {
          filter: "blur(22px)",
          opacity: 0.09,
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
      layer.style.willChange = "";
    };
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        data-portrait-layer
        className="flex h-full w-full items-end justify-center"
      >
        <Image
          data-portrait
          src="/img/portrait.webp"
          alt=""
          // The source is 1280x960; declaring anything larger asks Next to
          // upscale it, which is what softened the face.
          width={1280}
          height={960}
          priority
          fetchPriority="high"
          // Cutting this to 82 saved 20KB and moved LCP by nothing at all —
          // the delay is request timing and first paint, not bytes — so the
          // face is kept at full quality.
          quality={90}
          sizes="(max-width: 768px) 150vw, 90vw"
          className="h-[80vh] w-auto max-w-none object-contain sm:h-[96vh]"
        />
      </div>
    </div>
  );
}
