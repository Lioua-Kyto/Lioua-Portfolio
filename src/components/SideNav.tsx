"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/motion/gsap";
import { content } from "@/content";
import { NAV } from "@/components/nav";

/**
 * The displaced navigation: once the hero disperses, its parts settle here as
 * a stack of cards — name mark, claim, proof pair, routes, contact. The
 * arrival itself is choreographed by `HeroScene`, which owns the single
 * timeline that carries the hero out and this in; this component owns only the
 * markup and the active-route highlight.
 *
 * Starts transparent (GSAP writes the inline opacity from scroll position) and
 * is desktop-only — below `lg` the hero's own nav is the only navigation.
 */
export function SideNav() {
  useGSAP(() => {
    const links = [
      ...document.querySelectorAll<HTMLElement>("[data-rail-link]"),
    ];

    // Exactly one route is current. Sections overlap around the 55% line —
    // and a pinned section holds it for its whole run — so each trigger
    // claims the highlight outright rather than toggling its own on and off,
    // which would leave two lit at once.
    const claim = (id: string) => {
      for (const link of links) {
        link.dataset.active = link.dataset.railLink === id ? "true" : "false";
      }
    };

    for (const link of links) {
      const id = link.dataset.railLink;
      if (!id) continue;
      const section = document.querySelector<HTMLElement>(`#${id}`);
      if (!section) continue;

      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => {
          claim(id);
        },
        onEnterBack: () => {
          claim(id);
        },
      });
    }
  });

  return (
    <aside
      data-rail
      aria-label="Section navigation"
      className="fixed top-1/2 left-6 z-40 hidden w-56 -translate-y-1/2 opacity-0 lg:block"
    >
      <div data-rail-item className="rounded-xs bg-accent px-3 py-2.5">
        <a
          href="#intro"
          className="font-mono text-label font-semibold text-ink"
        >
          {content.intro.name.toLowerCase().replace(" ", ".")}
        </a>
        <p className="mt-0.5 font-mono text-fine text-ink/70">
          {content.intro.role.toLowerCase()}
        </p>
      </div>

      <p
        data-rail-item
        className="mt-2 rounded-xs border border-ink/12 bg-surface p-3 text-label leading-snug text-slate"
      >
        {content.intro.line}
      </p>

      {/* One per row: 224px of rail is too narrow to set these side by side
          without the longer figure breaking across four lines. */}
      <dl
        data-rail-item
        className="mt-2 space-y-2 rounded-xs border border-ink/12 bg-surface p-3"
      >
        {content.intro.proofs.slice(0, 2).map((proof) => (
          <div key={proof.label} className="flex items-baseline gap-2">
            <dd className="type-serif text-base font-semibold whitespace-nowrap text-accent-deep">
              {proof.value}
            </dd>
            <dt className="font-mono text-fine text-slate">{proof.label}</dt>
          </div>
        ))}
      </dl>

      <nav
        data-rail-item
        className="mt-2 rounded-xs border border-ink/12 bg-surface p-2"
      >
        <ul className="space-y-0.5">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-rail-link={item.href.slice(1)}
                data-active="false"
                className="transition-micro block rounded-xs px-2 py-1.5 font-mono text-label text-slate transition-colors hover:text-signal data-[active=true]:bg-accent data-[active=true]:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a
        data-rail-item
        href="#contact"
        className="transition-micro mt-2 block rounded-xs bg-ink px-3 py-2.5 text-center font-mono text-label text-paper transition-colors hover:bg-signal"
      >
        get in touch
      </a>
    </aside>
  );
}
