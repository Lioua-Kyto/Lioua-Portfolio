"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { pin, scrub } from "@/lib/motion/tokens";

// The shader is ~280 lines of GLSL and WebGL setup that a phone, a touch
// screen, or a reader who asked for less motion will never execute. Split out,
// those clients never download it either — and the effect draws over an image
// that is already painted, so arriving a tick late costs nothing visible.
const PortraitField = dynamic(
  () => import("@/components/hero/PortraitField").then((m) => m.PortraitField),
  { ssr: false },
);

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
  // The same three gates the shader itself checks, hoisted to render so the
  // chunk is never even requested when they fail. Read in an effect rather
  // than during render: a media query has no server answer, and deciding this
  // at first paint would be a hydration mismatch.
  const [shader, setShader] = useState(false);
  useEffect(() => {
    setShader(
      window.matchMedia("(pointer: fine)").matches &&
        window.matchMedia("(min-width: 1024px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

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
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
    >
      <div
        data-portrait-layer
        className="flex h-full w-full items-end justify-center"
      >
        {/* The shader draws over the image, pixel for pixel, and only takes
            the frame once it has one to give. Everything the scroll does to
            this layer — blur, fade, scale — applies to both at once. */}
        <div className="portrait-plate">
          <Image
            data-portrait
            src="/img/portrait.webp"
            alt=""
            // The source (re-encoded from assets/portrait/portrait.png) is
            // 2800x2100. Declaring the real size lets Next serve it crisp on
            // high-DPI screens without upscaling.
            width={2800}
            height={2100}
            priority
            fetchPriority="high"
            quality={90}
            sizes="(max-width: 768px) 150vw, 90vw"
            className="h-[92vh] w-auto max-w-none object-contain sm:h-[96vh]"
          />
          {shader ? <PortraitField src="/img/portrait.webp" /> : null}
        </div>
      </div>
    </div>
  );
}
