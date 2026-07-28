"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/motion/gsap";

/**
 * The way into a project.
 *
 * A card is a picture of a thing you are about to open, so opening it should
 * look like that and not like a page swap. The cover the reader clicked lifts
 * off the rail and grows while the ground rises under it; once the screen is
 * genuinely covered the route changes, and the cover clears when the new page
 * says it has arrived.
 *
 * The order matters more than it looks. Pushing while the ground was still
 * rising meant the home page tore down its pins in full view — the work rail
 * un-pinned and slid back across the screen — and the new page's first render
 * competed with the tween for the same frames, which is what made the whole
 * thing feel sluggish. The push now happens behind an opaque screen, and
 * nothing animates while React is doing its heaviest work.
 *
 * Mounted once in the root layout so it outlives the navigation. Work cards
 * ask for it by dispatching `project:open`; anything that cannot be measured
 * (no cover, modified click, reduced hardware) simply navigates as before.
 */

export interface ProjectOpenDetail {
  href: string;
  src: string;
  rect: { top: number; left: number; width: number; height: number };
}

declare global {
  interface WindowEventMap {
    "project:open": CustomEvent<ProjectOpenDetail>;
  }
}

export function ProjectTransition() {
  const layer = useRef<HTMLDivElement>(null);
  const shot = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  /** The route being travelled to, or null when nothing is in flight. */
  const target = useRef<string | null>(null);

  useEffect(() => {
    const open = (event: CustomEvent<ProjectOpenDetail>) => {
      const box = layer.current;
      const image = shot.current;
      const ground = veil.current;
      if (!box || !image || !ground || target.current) return;

      const { href, src, rect } = event.detail;
      target.current = href;
      box.dataset.on = "true";
      image.style.backgroundImage = `url("${src}")`;

      // Where it ends: a full-bleed frame with the page's own gutter, so the
      // cover lands where a reader expects a project to live rather than
      // stretching edge to edge and distorting.
      const pad = Math.min(window.innerWidth, window.innerHeight) * 0.06;

      gsap.set(image, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: 12,
        autoAlpha: 1,
        scale: 1,
      });
      gsap.set(ground, { yPercent: 100 });

      const tl = gsap.timeline();
      tl.to(ground, { yPercent: 0, duration: 0.5, ease: "expo.inOut" }, 0);
      tl.to(
        image,
        {
          top: pad,
          left: pad,
          width: window.innerWidth - pad * 2,
          height: window.innerHeight - pad * 2,
          borderRadius: 4,
          duration: 0.56,
          ease: "expo.inOut",
        },
        0,
      );
      // Only once the ground has fully covered. Before this frame the home
      // page is still visible, and unmounting it releases the work rail's pin,
      // which slides the whole section across the screen on its way out.
      tl.call(
        () => {
          router.push(href);
        },
        undefined,
        0.5,
      );
    };

    window.addEventListener("project:open", open);
    return () => {
      window.removeEventListener("project:open", open);
    };
  }, [router]);

  // The exit waits for the arrival rather than running on a fixed clock: the
  // new page's first render is the expensive part, and animating through it is
  // what dropped frames. A timeout is only the safety net.
  useEffect(() => {
    const want = target.current;
    const box = layer.current;
    const image = shot.current;
    const ground = veil.current;
    if (!want || !box || !image || !ground) return;
    if (pathname !== want) return;

    let done = false;
    const clear = () => {
      if (done) return;
      done = true;
      target.current = null;
      box.dataset.on = "false";
      gsap.set(image, { clearProps: "all" });
    };

    // One frame for the new page to paint, then let go.
    const start = window.setTimeout(() => {
      const tl = gsap.timeline({ onComplete: clear });
      tl.to(
        image,
        { autoAlpha: 0, scale: 1.05, duration: 0.42, ease: "power2.out" },
        0,
      );
      tl.to(
        ground,
        { yPercent: -100, duration: 0.6, ease: "expo.inOut" },
        0.08,
      );
    }, 90);

    // If the exit never runs — a slow render, a back button mid-flight — the
    // screen must not stay covered.
    const bail = window.setTimeout(() => {
      gsap.killTweensOf([image, ground]);
      gsap.set(ground, { yPercent: -100 });
      clear();
    }, 2600);

    return () => {
      clearTimeout(start);
      clearTimeout(bail);
    };
  }, [pathname]);

  return (
    <div ref={layer} data-on="false" className="project-transition">
      <div ref={veil} className="project-transition-ground" />
      <div ref={shot} className="project-transition-shot" />
    </div>
  );
}
