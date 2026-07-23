"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotionEnabled } from "@/lib/motion/preference";
import { dur, ease } from "@/lib/motion/tokens";
import { content } from "@/content";
import { NAV } from "@/components/nav";

/**
 * The displaced navigation (heynesh pattern): once the hero scrolls away, the
 * name mark, nav routes, proof stats, and contact CTA settle into a fixed
 * rail on the left — the top header fades out as this fades in, so the chrome
 * reads as one set of components relocating rather than two separate bars.
 * Fully reversible: scrolling back to the hero returns everything.
 * Desktop only; small screens keep the simple top nav.
 */
export function SideNav() {
  const scope = useRef<HTMLElement>(null);
  const motionEnabled = useMotionEnabled();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const hero = document.querySelector("#intro");
      if (!hero) return;

      const items = root.querySelectorAll("[data-rail-item]");
      const travel = motionEnabled;

      gsap.set(root, { autoAlpha: 0, x: travel ? -24 : 0 });
      gsap.set(items, { autoAlpha: 0, x: travel ? -14 : 0 });

      const show = gsap
        .timeline({ paused: true })
        .to(root, {
          autoAlpha: 1,
          x: 0,
          duration: travel ? dur.reveal : dur.micro,
          ease: travel ? ease.out : "none",
        })
        .to(
          items,
          {
            autoAlpha: 1,
            x: 0,
            duration: travel ? dur.reveal : dur.micro,
            ease: travel ? ease.out : "none",
            stagger: travel ? 0.05 : 0,
          },
          travel ? "-=0.7" : "<",
        );

      ScrollTrigger.create({
        trigger: hero,
        start: "bottom 60%",
        onEnter: () => show.play(),
        onLeaveBack: () => show.reverse(),
      });
    },
    { scope, dependencies: [motionEnabled] },
  );

  return (
    <aside
      ref={scope}
      aria-label="Section navigation"
      className="fixed top-1/2 left-6 z-40 hidden w-56 -translate-y-1/2 lg:block"
    >
      <div data-rail-item className="rounded-xs bg-accent px-3 py-2">
        <a
          href="#intro"
          className="font-mono text-label font-semibold text-ink"
        >
          {content.intro.name.toLowerCase().replace(" ", ".")}
        </a>
      </div>

      <nav
        data-rail-item
        className="mt-3 rounded-xs border border-ink/12 bg-surface/70 p-3"
      >
        <ul className="space-y-1.5">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="transition-micro block font-mono text-label text-slate transition-colors hover:text-signal"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <dl
        data-rail-item
        className="mt-3 grid grid-cols-2 gap-3 rounded-xs border border-ink/12 bg-surface/70 p-3"
      >
        {content.intro.proofs.slice(0, 2).map((proof) => (
          <div key={proof.label}>
            <dd className="type-serif text-base font-semibold text-accent-deep">
              {proof.value}
            </dd>
            <dt className="mt-0.5 font-mono text-fine text-slate">
              {proof.label}
            </dt>
          </div>
        ))}
      </dl>

      <a
        data-rail-item
        href="#contact"
        className="transition-micro mt-3 block rounded-xs bg-ink px-3 py-2.5 text-center font-mono text-label text-paper transition-colors hover:bg-signal"
      >
        get in touch
      </a>
    </aside>
  );
}
