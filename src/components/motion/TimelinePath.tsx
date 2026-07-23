"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";

/**
 * The thread running through the journey: a curved line drawn between the
 * beats as you scroll, with a marker lighting at each one as the line reaches
 * it. Geometry is measured from the beats themselves rather than hard-coded,
 * so the path stays attached to the text at any width or copy length.
 *
 * Decorative — the beats are a real ordered list on their own, and this is
 * hidden from assistive tech.
 */
export function TimelinePath({ count }: { count: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      const container = svg?.closest<HTMLElement>("[data-timeline]");
      const path = svg?.querySelector<SVGPathElement>("[data-timeline-line]");
      if (!svg || !container || !path) return;

      const markers = gsap.utils.toArray<SVGCircleElement>(
        "[data-timeline-marker]",
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

        // The line leans left and right between beats so it reads as a route
        // rather than a ruler.
        const points = nodes.map((node, index) => {
          const r = node.getBoundingClientRect();
          return {
            x: index % 2 === 0 ? w * 0.06 : w * 0.14,
            y: r.top - box.top + Math.min(36, r.height / 2),
          };
        });

        let d = `M ${String(points[0]?.x ?? 0)} 0`;
        for (const [index, point] of points.entries()) {
          const previous = points[index - 1] ?? { x: point.x, y: 0 };
          const midY = (previous.y + point.y) / 2;
          d += ` C ${String(previous.x)} ${String(midY)}, ${String(point.x)} ${String(midY)}, ${String(point.x)} ${String(point.y)}`;
        }
        const last = points[points.length - 1];
        if (last)
          d += ` C ${String(last.x)} ${String((last.y + h) / 2)}, ${String(last.x)} ${String((last.y + h) / 2)}, ${String(last.x)} ${String(h)}`;
        path.setAttribute("d", d);
        // The dash pattern has to be re-derived here, not once at setup: the
        // beats are still hidden by their reveal when this first runs, so a
        // length measured then is far shorter than the finished path and the
        // stroke would repeat instead of drawing once.
        path.style.strokeDasharray = String(path.getTotalLength());

        for (const [index, marker] of markers.entries()) {
          const point = points[index];
          if (!point) continue;
          marker.setAttribute("cx", String(point.x));
          marker.setAttribute("cy", String(point.y));
        }
      };

      draw();

      gsap.fromTo(
        path,
        { strokeDashoffset: () => path.getTotalLength() },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 75%",
            end: "bottom 75%",
            scrub: scrub.rail,
            invalidateOnRefresh: true,
            onRefreshInit: draw,
          },
        },
      );

      // Each marker lights as the line arrives at it.
      for (const marker of markers) {
        gsap.fromTo(
          marker,
          { scale: 0, transformOrigin: "center" },
          {
            scale: 1,
            duration: 0.4,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: marker,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
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
        stroke="var(--accent-deep)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      {Array.from({ length: count }, (_, index) => (
        <circle
          key={index}
          data-timeline-marker
          r="4.5"
          fill="var(--accent)"
          stroke="var(--paper)"
          strokeWidth="2.5"
        />
      ))}
    </svg>
  );
}
