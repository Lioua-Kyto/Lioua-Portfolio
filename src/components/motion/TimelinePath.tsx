"use client";

import { useId, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";

/**
 * The thread running through the journey — a line that weaves down past the
 * cards, drawing itself as you scroll, a dot lighting exactly as the line
 * reaches each beat. Past the last beat it carries on as a dashed tail: the
 * present, still being written. Everything is on one scrubbed timeline, so the
 * dots and the tail can never run ahead of the drawing line.
 *
 * Decorative — the beats are a real ordered list on their own.
 */
export function TimelinePath({ count }: { count: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const clipId = useId().replace(/:/g, "");

  useGSAP(
    () => {
      const svg = ref.current;
      const container = svg?.closest<HTMLElement>("[data-timeline]");
      const line = svg?.querySelector<SVGPathElement>("[data-timeline-line]");
      const tail = svg?.querySelector<SVGPathElement>("[data-timeline-tail]");
      const clipRect = svg?.querySelector<SVGRectElement>("[data-tail-clip]");
      if (!svg || !container || !line || !tail || !clipRect) return;

      const dots = gsap.utils.toArray<SVGCircleElement>(
        "[data-timeline-dot]",
        svg,
      );

      // The draw fractions at which each dot is reached (filled in by draw()).
      let dotFractions: number[] = [];

      const draw = () => {
        const nodes = gsap.utils.toArray<HTMLElement>(
          "[data-timeline-node]",
          container,
        );
        if (nodes.length === 0) return;

        const box = container.getBoundingClientRect();
        const w = box.width;
        const h = box.height;
        svg.setAttribute("viewBox", `0 0 ${String(w)} ${String(h)}`);

        // A wide weave inside the left lane: even beats hug the lane, odd beats
        // swing out, so the thread reads as a route with real deviation.
        const laneX = 20;
        const amp = gsap.utils.clamp(52, 104, w * 0.09);
        const points = nodes.map((node, index) => {
          const r = node.getBoundingClientRect();
          return {
            x: laneX + (index % 2 === 0 ? 0 : amp),
            y: r.top - box.top + Math.min(44, r.height / 2),
          };
        });

        const seg = (
          from: { x: number; y: number },
          to: { x: number; y: number },
        ) => {
          const midY = (from.y + to.y) / 2;
          return ` C ${String(from.x)} ${String(midY)}, ${String(to.x)} ${String(midY)}, ${String(to.x)} ${String(to.y)}`;
        };

        // Main thread: the top down through every beat.
        let d = `M ${String(points[0]?.x ?? laneX)} 0`;
        for (const [index, point] of points.entries()) {
          d += seg(points[index - 1] ?? { x: point.x, y: 0 }, point);
        }
        line.setAttribute("d", d);
        const mainLen = line.getTotalLength();
        line.style.strokeDasharray = String(mainLen);

        // Dashed tail: from the last beat down to the bottom.
        const last = points[points.length - 1] ?? { x: laneX, y: h * 0.7 };
        const tailY = h;
        tail.setAttribute(
          "d",
          `M ${String(last.x)} ${String(last.y)}${seg({ x: last.x + amp * 0.35, y: last.y }, { x: laneX, y: tailY })}`,
        );
        // The clip starts at the last beat and grows down to reveal the tail.
        clipRect.setAttribute("x", "0");
        clipRect.setAttribute("y", String(last.y));
        clipRect.setAttribute("width", String(w));
        clipRect.setAttribute("height", "0");

        // Each dot's fraction of the main draw (measured, not guessed).
        const probe = line.cloneNode() as SVGPathElement;
        let sub = `M ${String(points[0]?.x ?? laneX)} 0`;
        dotFractions = points.map((point, index) => {
          sub += seg(points[index - 1] ?? { x: point.x, y: 0 }, point);
          probe.setAttribute("d", sub);
          return mainLen === 0 ? 0 : probe.getTotalLength() / mainLen;
        });

        for (const [index, point] of points.entries()) {
          const dot = dots[index];
          if (!dot) continue;
          dot.setAttribute("cx", String(point.x));
          dot.setAttribute("cy", String(point.y));
        }
      };

      draw();

      // One scrubbed timeline: line draws over 0→8, each dot pops the instant
      // the draw reaches it, and the tail is revealed over 8→10 — after the
      // solid line has arrived at the last beat.
      const build = () => {
        const tl = gsap.timeline();
        tl.fromTo(
          line,
          { strokeDashoffset: () => line.getTotalLength() },
          { strokeDashoffset: 0, ease: "none", duration: 8 },
          0,
        );
        dots.forEach((dot, i) => {
          tl.fromTo(
            dot,
            { scale: 0, transformOrigin: "center" },
            { scale: 1, ease: "back.out(2)", duration: 0.4 },
            (dotFractions[i] ?? 0) * 8,
          );
        });
        tl.fromTo(
          clipRect,
          { attr: { height: 0 } },
          {
            attr: {
              height: () => {
                const box = container.getBoundingClientRect();
                return box.height - Number(clipRect.getAttribute("y") ?? 0);
              },
            },
            ease: "none",
            duration: 2,
          },
          8,
        );
        return tl;
      };

      ScrollTrigger.create({
        animation: build(),
        trigger: container,
        start: "top 68%",
        end: "bottom 78%",
        scrub: scrub.rail,
        invalidateOnRefresh: true,
        onRefreshInit: draw,
      });
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
    >
      <defs>
        <clipPath id={`tail-${clipId}`} clipPathUnits="userSpaceOnUse">
          <rect data-tail-clip x="0" y="0" width="0" height="0" />
        </clipPath>
      </defs>
      <path
        data-timeline-line
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        data-timeline-tail
        fill="none"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="butt"
        strokeDasharray="11 9"
        opacity="0.55"
        clipPath={`url(#tail-${clipId})`}
      />
      {Array.from({ length: count }, (_, index) => (
        <circle
          key={`dot-${String(index)}`}
          data-timeline-dot
          r="6"
          fill="var(--accent)"
          stroke="var(--paper)"
          strokeWidth="3"
        />
      ))}
    </svg>
  );
}
