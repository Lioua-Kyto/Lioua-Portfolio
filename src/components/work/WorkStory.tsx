"use client";

import Image from "next/image";
import { useRef } from "react";
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
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        for (const figure of gsap.utils.toArray<HTMLElement>("[data-shot]")) {
          // Reveal as the figure's top crosses into the lower viewport, and
          // hold — no reverse — so a shot never blinks out on the way back.
          // `invalidateOnRefresh` re-reads the start whenever an image finishes
          // decoding and shifts the layout, which is what stopped the reveal
          // firing late (its start had been measured against a shorter page).
          // No parallax on the media any more: it needed the frame to overflow
          // the image, which cropped the 16:9 captures. The entrance is enough.
          gsap.fromTo(
            figure,
            { autoAlpha: 0, y: 32 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: figure,
                start: "top 92%",
                invalidateOnRefresh: true,
              },
            },
          );
        }
        ScrollTrigger.refresh();
      });

      // The captures are eager, so the reader is never waiting on the network
      // to see one — but a decode still changes the figure's height slightly.
      // Refresh once each has landed so every trigger's start is measured
      // against the final layout, not the reserved-but-empty boxes.
      const images = [...scope.querySelectorAll("img")];
      let pending = images.filter((img) => !img.complete).length;
      const settle = () => {
        pending -= 1;
        if (pending <= 0) ScrollTrigger.refresh();
      };
      for (const img of images) {
        if (img.complete) continue;
        img.addEventListener("load", settle, { once: true });
        img.addEventListener("error", settle, { once: true });
      }

      return () => {
        mm.revert();
        for (const img of images) {
          img.removeEventListener("load", settle);
          img.removeEventListener("error", settle);
        }
      };
    },
    { scope: root, dependencies: [shots] },
  );

  return (
    <div ref={root} className="mt-16 flex flex-col gap-[clamp(4rem,10vh,8rem)]">
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
                // The first capture is above the fold and the image the
                // opening transition dissolves into, so it is preloaded with
                // priority. The rest load eagerly rather than lazily: a project
                // has only a handful of captures, they are the substance of the
                // page, and lazy loading was why a shot only appeared once the
                // reader had already scrolled onto it.
                priority={index === 0}
                loading={index === 0 ? undefined : "eager"}
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
