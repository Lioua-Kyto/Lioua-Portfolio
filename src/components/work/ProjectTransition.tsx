"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/motion/gsap";

/**
 * The way into a project.
 *
 * A card is a picture of a thing you are about to open, so opening it should
 * look like that and not like a page swap. The cover the reader clicked lifts
 * off the rail and grows to fill the screen while the ground rises under it;
 * once the screen is genuinely covered the route changes, and the cover clears
 * the moment the new page reports for duty.
 *
 * Two things this has to keep getting right. The push waits for an opaque
 * screen: pushing earlier let the home page tear down its pins in full view.
 * And the growth is transform-only — the first version animated width, height,
 * top and left, which forces a layout on every single frame and is why the
 * whole thing felt like it was dragging.
 *
 * It is also deliberately short. The project page has its heading and its
 * first capture on screen inside about 550ms; an overlay that runs longer than
 * that is not covering work, it is just making the reader wait.
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

      // The shot's box is fixed — a full-bleed frame inset by the page's own
      // gutter — and never changes. Only its transform does, which keeps the
      // whole travel on the compositor.
      const pad = Math.min(window.innerWidth, window.innerHeight) * 0.06;
      const w = window.innerWidth - pad * 2;
      const h = window.innerHeight - pad * 2;
      gsap.set(image, { top: pad, left: pad, width: w, height: h });

      const tl = gsap.timeline();
      // The ground closes first and a little faster than the image grows, so by
      // the time the route is pushed the screen is genuinely opaque. The image
      // keeps expanding over that opaque ground, landing as the project's hero.
      tl.fromTo(
        ground,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.42, ease: "power2.inOut" },
        0,
      );
      tl.fromTo(
        image,
        {
          x: rect.left - pad,
          y: rect.top - pad,
          scaleX: rect.width / w,
          scaleY: rect.height / h,
          transformOrigin: "left top",
          autoAlpha: 1,
        },
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.56,
          // A settle, not a slam: quick to leave the card, easing into the
          // full frame. This is the moment that reads as "opening".
          ease: "power3.out",
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
        0.42,
      );
    };

    window.addEventListener("project:open", open);
    return () => {
      window.removeEventListener("project:open", open);
    };
  }, [router]);

  // The exit waits for the arrival rather than a fixed clock: the new page's
  // first render is the expensive part, and animating through it drops frames.
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

    // Two frames for the new page to commit and paint its priority hero, then
    // let go. The cover the reader grew fades to the identical real image
    // underneath while the ground lifts away to uncover the rest of the page.
    const start = window.setTimeout(() => {
      const tl = gsap.timeline({ onComplete: clear });
      tl.to(image, { autoAlpha: 0, duration: 0.32, ease: "power2.out" }, 0);
      tl.to(
        ground,
        { yPercent: -100, duration: 0.44, ease: "power2.inOut" },
        0.06,
      );
    }, 80);

    // If the exit never runs — a slow render, a back button mid-flight — the
    // screen must not stay covered.
    const bail = window.setTimeout(() => {
      gsap.killTweensOf([image, ground]);
      gsap.set(ground, { yPercent: -100 });
      clear();
    }, 2200);

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
