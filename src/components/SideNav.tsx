"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/motion/gsap";
import { content } from "@/content";
import { NAV } from "@/components/nav";

/** Where the reading line sits, as a fraction of viewport height. */
const READING_LINE = 0.3;

/**
 * The displaced navigation: once the hero disperses, its parts land here as
 * one frosted sheet — name, claim, proof pair, routes, invitation. `HeroScene`
 * owns the arrival and flies each hero group into the matching
 * `data-rail-slot`; this component owns the markup and the current-route mark.
 *
 * Starts transparent (GSAP writes the inline opacity from scroll position) and
 * is desktop-only — below `lg` the hero's own nav is the only navigation.
 */
export function SideNav() {
  useGSAP(() => {
    const links = [
      ...document.querySelectorAll<HTMLElement>("[data-rail-link]"),
    ];
    const sections = links
      .map((link) => {
        const id = link.dataset.railLink ?? "";
        return {
          link,
          el: id ? document.querySelector<HTMLElement>(`#${id}`) : null,
        };
      })
      .filter((s): s is { link: HTMLElement; el: HTMLElement } => !!s.el);

    // Resolved from scroll position on every update rather than from each
    // section's own enter/leave events: those fire in an order that depends on
    // scroll direction and jump distance, so an anchor jump could leave a
    // later section's handler running last and light the wrong route.
    //
    // Offsets are cached and only re-read on refresh. Measuring rectangles per
    // frame forces a layout on every scrolled frame, which is enough on its
    // own to push blocking time past budget.
    let offsets: number[] = [];
    const measure = () => {
      offsets = sections.map(
        (section) => section.el.getBoundingClientRect().top + window.scrollY,
      );
    };

    let active = -1;
    const resolve = () => {
      const line = window.scrollY + window.innerHeight * READING_LINE;
      let current = 0;
      for (let i = 0; i < offsets.length; i++) {
        if ((offsets[i] ?? 0) <= line) current = i;
      }
      if (current === active) return;
      active = current;
      for (const [i, section] of sections.entries()) {
        section.link.dataset.active = i === current ? "true" : "false";
      }
    };

    const tracker = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: resolve,
      onRefresh: () => {
        measure();
        active = -1;
        resolve();
      },
    });
    measure();
    resolve();

    return () => {
      tracker.kill();
    };
  });

  return (
    <aside
      data-rail
      aria-label="Section navigation"
      className="glass fixed top-1/2 left-6 z-40 hidden w-60 -translate-y-1/2 rounded-md opacity-0 lg:block"
    >
      <div data-rail-item className="px-4 pt-4 pb-3">
        <a
          data-rail-slot="name"
          href="#intro"
          className="type-serif block text-title leading-none font-semibold text-accent-deep"
        >
          {content.intro.name.split(" ")[0]}
        </a>
        <p className="mt-1.5 font-mono text-fine tracking-wide text-slate uppercase">
          {content.intro.role}
        </p>
      </div>

      <p
        data-rail-item
        data-rail-slot="claim"
        className="border-t border-ink/8 px-4 py-3 text-label leading-snug text-slate"
      >
        {content.intro.line}
      </p>

      <dl
        data-rail-item
        data-rail-slot="stats"
        className="space-y-1.5 border-t border-ink/8 px-4 py-3"
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
        data-rail-slot="nav"
        className="border-t border-ink/8 px-2 py-2"
      >
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-rail-link={item.href.slice(1)}
                data-active="false"
                // The current route is marked with a rule in the margin, not a
                // filled block: the rail sits over live content, and a solid
                // swatch there reads as a button rather than a position.
                className="transition-micro relative block rounded-xs py-1.5 pr-2 pl-4 font-mono text-label text-slate transition-colors before:absolute before:top-1/2 before:left-0 before:h-3.5 before:w-0.5 before:-translate-y-1/2 before:scale-y-0 before:rounded-full before:bg-accent-deep before:transition-transform hover:text-ink data-[active=true]:text-ink data-[active=true]:before:scale-y-100"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div data-rail-item className="border-t border-ink/8 p-3">
        <a
          href="#contact"
          className="transition-micro block rounded-xs bg-ink px-3 py-2.5 text-center font-mono text-label text-paper transition-colors hover:bg-signal"
        >
          start a conversation
        </a>
      </div>
    </aside>
  );
}
