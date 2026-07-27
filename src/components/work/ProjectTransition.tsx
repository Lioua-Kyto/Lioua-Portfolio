"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/motion/gsap";

/**
 * The way into a project.
 *
 * A card is a picture of a thing you are about to open, so opening it should
 * look like that and not like a page swap. The cover the reader clicked lifts
 * off the rail, grows to fill the screen, and the darker ground of the project
 * page rises under it; on the other side the cover settles and lets go. The
 * route change happens underneath, hidden by the moment the image owns the
 * screen — which is also what buys the new page its render.
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
  /** Set while a transition owns the screen, so the arrival knows to clear. */
  const flying = useRef(false);

  useEffect(() => {
    const open = (event: CustomEvent<ProjectOpenDetail>) => {
      const box = layer.current;
      const image = shot.current;
      const ground = veil.current;
      if (!box || !image || !ground || flying.current) return;

      const { href, src, rect } = event.detail;
      flying.current = true;
      box.dataset.on = "true";
      image.style.backgroundImage = `url("${src}")`;

      // Where it ends: a full-bleed frame with the page's own gutter, so the
      // cover lands where a reader expects a project to live rather than
      // stretching edge to edge and distorting.
      const pad = Math.min(window.innerWidth, window.innerHeight) * 0.06;
      const to = {
        top: pad,
        left: pad,
        width: window.innerWidth - pad * 2,
        height: window.innerHeight - pad * 2,
      };

      gsap.set(image, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: 12,
      });
      gsap.set(ground, { yPercent: 100 });

      const tl = gsap.timeline();
      tl.to(ground, { yPercent: 0, duration: 0.62, ease: "expo.inOut" }, 0);
      tl.to(
        image,
        {
          ...to,
          borderRadius: 4,
          duration: 0.72,
          ease: "expo.inOut",
        },
        0,
      );
      // Pushed while the cover still holds the screen: the new page gets to
      // mount and lay out behind a frame that is already opaque.
      tl.call(
        () => {
          router.push(href);
        },
        undefined,
        0.42,
      );
      // Then it lets go — the cover clears upward and the project is there.
      tl.to(
        image,
        { autoAlpha: 0, scale: 1.06, duration: 0.5, ease: "power2.inOut" },
        0.95,
      );
      tl.to(
        ground,
        {
          yPercent: -100,
          duration: 0.66,
          ease: "expo.inOut",
          onComplete: () => {
            box.dataset.on = "false";
            gsap.set(image, { clearProps: "all" });
            flying.current = false;
          },
        },
        1.02,
      );
    };

    window.addEventListener("project:open", open);
    return () => {
      window.removeEventListener("project:open", open);
    };
  }, [router]);

  // A transition that never finished — a slow push, a back button pressed
  // mid-flight — must not leave the screen covered.
  useEffect(() => {
    if (!flying.current) return;
    const timer = setTimeout(() => {
      const box = layer.current;
      if (!box || !flying.current) return;
      gsap.killTweensOf([shot.current, veil.current]);
      box.dataset.on = "false";
      flying.current = false;
    }, 2600);
    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <div ref={layer} data-on="false" className="project-transition">
      <div ref={veil} className="project-transition-ground" />
      <div ref={shot} className="project-transition-shot" />
    </div>
  );
}
