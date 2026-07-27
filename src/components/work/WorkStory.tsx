"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import type { Shot } from "@/content/schemas";

/**
 * The project's captures, told as a scroll sequence.
 *
 * Each capture rises and settles as it enters, and drifts a little slower than
 * the page while it is on screen — the parallax is what makes a column of
 * screenshots read as a walkthrough rather than a contact sheet. Any shot opens
 * in the zoom-and-pan viewer, which is where the detail actually lives.
 */
export function WorkStory({
  shots,
  onOpen,
}: {
  shots: readonly Shot[];
  onOpen: (shot: Shot, origin: DOMRect) => void;
}) {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      for (const figure of gsap.utils.toArray<HTMLElement>("[data-shot]")) {
        const media = figure.querySelector<HTMLElement>("[data-shot-media]");
        if (!media) continue;

        gsap.fromTo(
          figure,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: figure, start: "top 82%" },
          },
        );

        gsap.fromTo(
          media,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: figure,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      }
      ScrollTrigger.refresh();
    });

    return () => {
      mm.revert();
    };
  }, [shots]);

  return (
    <div className="mt-16 flex flex-col gap-[clamp(4rem,10vh,8rem)]">
      {shots.map((shot, index) => (
        <figure key={shot.src} data-shot className="work-shot">
          <button
            type="button"
            onClick={(event) => {
              onOpen(shot, event.currentTarget.getBoundingClientRect());
            }}
            className="work-shot-button group"
            aria-label={`Open ${shot.alt} in the zoom viewer`}
          >
            <span data-shot-media className="work-shot-media">
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 767px) 92vw, (max-width: 1279px) 88vw, 77rem"
                quality={90}
                className={
                  shot.fit === "contain" ? "object-contain" : "object-cover"
                }
              />
            </span>
            <span className="work-shot-zoom font-mono text-fine uppercase">
              Zoom
            </span>
          </button>

          <figcaption className="work-shot-caption">
            <span className="font-mono text-fine text-accent tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              {shot.caption ? (
                <span className="text-base text-ink">{shot.caption}</span>
              ) : (
                <span className="text-base text-slate">{shot.alt}</span>
              )}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
