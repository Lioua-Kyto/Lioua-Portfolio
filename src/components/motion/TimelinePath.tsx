"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";

/**
 * The thread running through the journey — a line that weaves down past the
 * cards, drawing itself as you scroll, a dot lighting at each beat. Past the
 * last beat it carries on as a dotted tail: the present, still being written.
 * Geometry is measured from the cards, so it stays attached at any width or
 * copy length. Decorative — the beats are a real ordered list on their own.
 */
export function TimelinePath({ count }: { count: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      const container = svg?.closest<HTMLElement>("[data-timeline]");
      const line = svg?.querySelector<SVGPathElement>("[data-timeline-line]");
      const tail = svg?.querySelector<SVGPathElement>("[data-timeline-tail]");
      if (!svg || !container || !line || !tail) return;

      const dots = gsap.utils.toArray<SVGCircleElement>(
        "[data-timeline-dot]",
        svg,
      );
      const halos = gsap.utils.toArray<SVGCircleElement>(
        "[data-timeline-halo]",
        svg,
      );

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

        // A wide weave: even beats hug the left lane, odd beats swing well to
        // the right, so the thread reads as a route with real deviation rather
        // than a ruler running straight down.
        // The lane is ~9rem (144px) wide; keep the swing inside it so the
        // thread never runs under a card.
        const laneX = 20;
        const amp = gsap.utils.clamp(52, 104, w * 0.09);
        const points = nodes.map((node, index) => {
          const r = node.getBoundingClientRect();
          return {
            x: laneX + (index % 2 === 0 ? 0 : amp),
            y: r.top - box.top + Math.min(44, r.height / 2),
          };
        });

        // Main thread: from the top, curving through each beat, swinging wide
        // between them (the mid control points exaggerate the horizontal lean).
        let d = `M ${String(points[0]?.x ?? laneX)} 0`;
        for (const [index, point] of points.entries()) {
          const prev = points[index - 1] ?? { x: point.x, y: 0 };
          const midY = (prev.y + point.y) / 2;
          d += ` C ${String(prev.x)} ${String(midY)}, ${String(point.x)} ${String(midY)}, ${String(point.x)} ${String(point.y)}`;
        }
        line.setAttribute("d", d);
        line.style.strokeDasharray = String(line.getTotalLength());

        // Dotted tail: continues from the last beat down toward the bottom —
        // the present, not yet uncovered.
        const last = points[points.length - 1] ?? { x: laneX, y: h * 0.7 };
        const tailEnd = h;
        const tailMidY = (last.y + tailEnd) / 2;
        tail.setAttribute(
          "d",
          `M ${String(last.x)} ${String(last.y)} C ${String(last.x + amp * 0.4)} ${String(tailMidY)}, ${String(laneX)} ${String(tailMidY)}, ${String(laneX)} ${String(tailEnd)}`,
        );

        for (const [index, point] of points.entries()) {
          for (const set of [dots, halos]) {
            const c = set[index];
            if (!c) continue;
            c.setAttribute("cx", String(point.x));
            c.setAttribute("cy", String(point.y));
          }
        }
      };

      draw();

      gsap.fromTo(
        line,
        { strokeDashoffset: () => line.getTotalLength() },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            end: "bottom 80%",
            scrub: scrub.rail,
            invalidateOnRefresh: true,
            onRefreshInit: draw,
          },
        },
      );

      // Each dot pops as the line arrives at its beat, its halo pulsing out.
      dots.forEach((dot, index) => {
        const node = gsap.utils.toArray<HTMLElement>(
          "[data-timeline-node]",
          container,
        )[index];
        if (!node) return;
        const halo = halos[index];
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: node,
            start: "top 68%",
            toggleActions: "play none none reverse",
          },
        });
        tl.fromTo(
          dot,
          { scale: 0, transformOrigin: "center" },
          { scale: 1, duration: 0.4, ease: "back.out(2.5)" },
        );
        if (halo) {
          tl.fromTo(
            halo,
            { scale: 0.4, opacity: 0.5, transformOrigin: "center" },
            { scale: 2.6, opacity: 0, duration: 0.7, ease: "power2.out" },
            "<",
          );
        }
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
        strokeDasharray="1 11"
        opacity="0.45"
      />
      {Array.from({ length: count }, (_, index) => (
        <circle
          key={`halo-${String(index)}`}
          data-timeline-halo
          r="7"
          fill="var(--accent)"
          opacity="0"
        />
      ))}
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
