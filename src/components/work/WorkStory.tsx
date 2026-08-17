"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import type { Shot } from "@/content/schemas";

/**
 * A run of shots, grouped for layout. A plain capture is its own block; two
 * consecutive `facing` shots become one, so the pair can be laid out turned
 * toward each other with their argument held between them.
 */
type Block =
  | { kind: "stack"; shot: Shot; index: number }
  | { kind: "spread"; shot: Shot; index: number }
  | { kind: "facing"; left: Shot; right: Shot; index: number };

function group(shots: readonly Shot[]): Block[] {
  const blocks: Block[] = [];
  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i];
    if (!shot) continue;
    const next = shots[i + 1];
    if (shot.side === "facing" && next?.side === "facing") {
      blocks.push({ kind: "facing", left: shot, right: next, index: i });
      i += 1;
      continue;
    }
    blocks.push({
      kind: shot.side ? "spread" : "stack",
      shot,
      index: i,
    });
  }
  return blocks;
}

/**
 * The project's captures, told as a scroll sequence.
 *
 * Three shapes, chosen by the shot's own `side`. A `null` side keeps the
 * original stacked column — a framed capture with a small caption, which is
 * what a flat screenshot deserves. `left`/`right` open into a full spread:
 * the device render on its side, its one claim opposite at heading size.
 * `facing` pairs turn two renders toward each other across the text.
 *
 * The entrance follows the layout rather than being sprinkled over it. A
 * spread's image enters from the edge it sits against and its text from the
 * opposite one, so the block assembles toward its own centre. The facing pair
 * is the loudest thing on the page and earns it: both renders come in from
 * the far edges of the screen and close on the text between them.
 */
export function WorkStory({
  shots,
  onOpen,
}: {
  shots: readonly Shot[];
  onOpen: (shot: Shot, origin: DOMRect) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const blocks = group(shots);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      // Every entrance below reverses on the way back up, so scrolling down
      // through the page a second time plays it again rather than presenting
      // an already-assembled page. `reverse` runs the tween backwards on
      // leave-back; the fourth slot stays `none` so re-entering from below
      // does not fire a second play on top of the reverse.
      const TOGGLE = "play none none reverse";

      mm.add("(min-width: 768px)", () => {
        for (const figure of gsap.utils.toArray<HTMLElement>("[data-shot]")) {
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
                toggleActions: TOGGLE,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // Spreads: the two halves converge. `data-from` carries the sign, so
        // a left-sitting image travels right and its text comes back at it.
        for (const part of gsap.utils.toArray<HTMLElement>("[data-from]")) {
          const dir = part.dataset.from === "left" ? -1 : 1;
          const isMedia = part.dataset.role === "media";
          gsap.fromTo(
            part,
            { autoAlpha: 0, x: dir * (isMedia ? 64 : 40) },
            {
              autoAlpha: 1,
              x: 0,
              duration: isMedia ? 1 : 0.85,
              ease: "power3.out",
              delay: isMedia ? 0 : 0.12,
              scrollTrigger: {
                trigger: part.closest("[data-block]") ?? part,
                start: "top 85%",
                toggleActions: TOGGLE,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // The facing pair closes from off-screen. `xPercent` rather than a
        // pixel figure so the travel scales with the render's own width and
        // reads the same on a laptop and a wide desktop.
        for (const pair of gsap.utils.toArray<HTMLElement>("[data-facing]")) {
          const media = gsap.utils.toArray<HTMLElement>(
            "[data-facing-media]",
            pair,
          );
          const middle = pair.querySelector("[data-facing-text]");
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pair,
              start: "top 80%",
              toggleActions: TOGGLE,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(
            media,
            {
              autoAlpha: 0,
              xPercent: (i: number) => (i === 0 ? -120 : 120),
              rotate: (i: number) => (i === 0 ? -8 : 8),
            },
            {
              autoAlpha: 1,
              xPercent: 0,
              rotate: 0,
              duration: 1.15,
              ease: "power3.out",
            },
            0,
          );
          if (middle) {
            tl.fromTo(
              middle,
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" },
              0.45,
            );
          }
        }

        ScrollTrigger.refresh();
      });

      // A decode still changes a figure's height. Refresh once each has landed
      // so every trigger's start is measured against the final layout.
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

  /** A render on a transparent ground: no frame, no zoom affordance. */
  const render = (shot: Shot, index: number, extra?: string) => (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={1600}
      height={1200}
      sizes="(max-width: 767px) 92vw, 46vw"
      quality={92}
      priority={index === 0}
      loading={index === 0 ? undefined : "eager"}
      className={`h-auto w-full ${extra ?? ""}`}
    />
  );

  return (
    <div
      ref={root}
      className="mt-16 flex flex-col gap-[clamp(5rem,14vh,10rem)]"
    >
      {blocks.map((block) => {
        if (block.kind === "facing") {
          return (
            <div
              key={block.left.src}
              data-block
              data-facing
              className="work-facing"
            >
              <div data-facing-media className="work-facing-media">
                {render(block.left, block.index)}
              </div>
              <div data-facing-text className="work-facing-text">
                {block.left.title ? (
                  <h3 className="type-display text-title leading-tight font-semibold text-balance">
                    {block.left.title}
                  </h3>
                ) : null}
                {block.left.caption ? (
                  <p className="mt-4 text-base text-slate text-pretty">
                    {block.left.caption}
                  </p>
                ) : null}
              </div>
              <div data-facing-media className="work-facing-media">
                {render(block.right, block.index + 1)}
              </div>
            </div>
          );
        }

        if (block.kind === "spread") {
          const { shot, index } = block;
          const imageLeft = shot.side === "left";
          return (
            <div
              key={shot.src}
              data-block
              className={`work-spread ${imageLeft ? "" : "work-spread--flip"}`}
            >
              <div
                data-role="media"
                data-from={imageLeft ? "left" : "right"}
                className="work-spread-media"
              >
                {render(shot, index)}
              </div>
              <div
                data-from={imageLeft ? "right" : "left"}
                className="work-spread-text"
              >
                {shot.title ? (
                  <h3 className="type-display text-headline leading-[1.05] font-semibold text-balance">
                    {shot.title}
                  </h3>
                ) : null}
                {shot.caption ? (
                  <p className="mt-5 max-w-[46ch] text-lede text-slate text-pretty">
                    {shot.caption}
                  </p>
                ) : null}
              </div>
            </div>
          );
        }

        const { shot, index } = block;
        return (
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
        );
      })}
    </div>
  );
}
