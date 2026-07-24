"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { scrub } from "@/lib/motion/tokens";

/**
 * The thread running through the journey — a line drawn down a lane on the
 * left of the cards, weaving toward each one, with a dot that lights as the
 * line reaches it. Geometry is measured from the cards themselves, so the path
 * stays attached at any width or copy length. Decorative: the beats are a real
 * ordered list on their own, so this is hidden from assistive tech.
 */
export function TimelinePath({ count }: { count: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      const container = svg?.closest<HTMLElement>("[data-timeline]");
      const path = svg?.querySelector<SVGPathElement>("[data-timeline-line]");
      if (!svg || !container || !path) return;

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

        // The lane sits a little in from the left; it leans gently left and
        // right between beats so the thread reads as a route, not a ruler.
        const laneX = Math.min(36, w * 0.06);
        const points = nodes.map((node, index) => {
          const r = node.getBoundingClientRect();
          return {
            x: laneX + (index % 2 === 0 ? -8 : 10),
            y: r.top - box.top + Math.min(40, r.height / 2),
          };
        });

        let d = `M ${String(points[0]?.x ?? laneX)} 0`;
        for (const [index, point] of points.entries()) {
          const previous = points[index - 1] ?? { x: point.x, y: 0 };
          const midY = (previous.y + point.y) / 2;
          d += ` C ${String(previous.x)} ${String(midY)}, ${String(point.x)} ${String(midY)}, ${String(point.x)} ${String(point.y)}`;
        }
        const last = points[points.length - 1];
        if (last) {
          const tailY = (last.y + h) / 2;
          d += ` C ${String(last.x)} ${String(tailY)}, ${String(last.x)} ${String(tailY)}, ${String(last.x)} ${String(h)}`;
        }
        path.setAttribute("d", d);
        // Re-derive the dash length here, not once at setup: the cards are
        // still hidden by their reveal when this first runs, so a length
        // measured then is far shorter than the finished path and the stroke
        // would repeat instead of drawing once.
        path.style.strokeDasharray = String(path.getTotalLength());

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
        path,
        { strokeDashoffset: () => path.getTotalLength() },
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

      // Each dot pops as the line arrives at its card, its halo pulsing out.
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
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {Array.from({ length: count }, (_, index) => (
        <circle
          key={`halo-${String(index)}`}
          data-timeline-halo
          r="6"
          fill="var(--accent)"
          opacity="0"
        />
      ))}
      {Array.from({ length: count }, (_, index) => (
        <circle
          key={`dot-${String(index)}`}
          data-timeline-dot
          r="5.5"
          fill="var(--accent)"
          stroke="var(--paper)"
          strokeWidth="3"
        />
      ))}
    </svg>
  );
}
