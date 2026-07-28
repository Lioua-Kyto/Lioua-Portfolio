"use client";

import { useId, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";

/** Three dashes: 11 on, 9 off, 11, 9, 11 — the run ends on a dash, not a gap. */
const DASH_RUN = 11 * 3 + 9 * 2;

/**
 * The thread running through the journey — a line that weaves down past the
 * cards, drawing itself as you scroll, a dot lighting exactly as the line
 * reaches each beat. Past the last beat the solid line carries on down, turns,
 * and runs out to the right underneath the last card before breaking into three
 * dashes: the present, still being written, leaving the page sideways rather
 * than stopping at a wall. Everything is on one scrubbed timeline, so the dots
 * and the tail can never run ahead of the drawing line.
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
      const dashes = svg?.querySelector<SVGPathElement>(
        "[data-timeline-dashes]",
      );
      const clipRect = svg?.querySelector<SVGRectElement>("[data-tail-clip]");
      if (!svg || !container || !line || !tail || !dashes || !clipRect) return;

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

        // A weave inside the left lane: even beats hug the lane, odd beats
        // swing out, so the thread reads as a route with real deviation. The
        // lane is only ~3rem wide on a phone, so the swing has to shrink with
        // it or the thread crosses under the cards.
        const narrow = w < 640;
        const laneX = narrow ? 11 : 20;
        const amp = narrow
          ? Math.max(12, w * 0.05)
          : gsap.utils.clamp(52, 104, w * 0.09);
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

        // Past the last beat the line stays a line: down the lane, then it
        // turns and runs out to the right underneath the last card, and only
        // out there does it break into exactly three dashes. The thread leaves
        // the page sideways rather than stopping at a wall.
        const last = points[points.length - 1] ?? { x: laneX, y: h * 0.7 };
        const lastNode = nodes[nodes.length - 1];
        const floorY = Math.min(
          lastNode ? lastNode.getBoundingClientRect().bottom - box.top + 34 : h,
          h - 6,
        );
        const runX = Math.min(w * 0.42, laneX + 300);
        tail.setAttribute(
          "d",
          [
            `M ${String(last.x)} ${String(last.y)}`,
            // Down the lane first, so the turn reads as a turn.
            `C ${String(last.x)} ${String(last.y + (floorY - last.y) * 0.42)},`,
            `${String(laneX)} ${String(floorY - 4)},`,
            `${String(Math.min(runX, laneX + 108))} ${String(floorY)}`,
            `L ${String(runX)} ${String(floorY)}`,
          ].join(" "),
        );
        dashes.setAttribute(
          "d",
          `M ${String(runX)} ${String(floorY)} L ${String(Math.min(runX + DASH_RUN, w))} ${String(floorY)}`,
        );
        const tailLen = tail.getTotalLength();
        tail.style.strokeDasharray = String(tailLen);
        // The clip is the dashes alone, opening left to right so the three of
        // them arrive in turn rather than all at once.
        clipRect.setAttribute("x", String(runX));
        clipRect.setAttribute("y", String(floorY - 12));
        clipRect.setAttribute("width", "0");
        clipRect.setAttribute("height", "24");

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
          tail,
          { strokeDashoffset: () => tail.getTotalLength() },
          { strokeDashoffset: 0, ease: "none", duration: 1.4 },
          8,
        );
        tl.fromTo(
          clipRect,
          { attr: { width: 0 } },
          { attr: { width: DASH_RUN }, ease: "none", duration: 0.6 },
          9.4,
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
      className="pointer-events-none absolute inset-0 block h-full w-full"
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
        strokeLinecap="round"
        opacity="0.75"
        clipPath={`url(#tail-${clipId})`}
      />
      <path
        data-timeline-dashes
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
