"use client";

import { useGSAP } from "@gsap/react";
import { gsap, Flip, ScrollTrigger } from "@/lib/motion/gsap";
import { pin } from "@/lib/motion/tokens";
import { content } from "@/content";
import { NAV } from "@/components/nav";

const CAP_COUNT = 5;

const READING_LINE = 0.3;

/**
 * The hero chrome that becomes the side rail.
 *
 * The routes and the proof numbers are a single set of elements that live
 * here, not duplicated between a hero and a separate sidebar. On load they are
 * laid out as part of the hero — routes under the name, proofs at the lower
 * left. As the hero pins and scrolls, GSAP Flip carries those same elements
 * into a fixed glass rail on the left, the routes reflowing from a row into a
 * column, while the rail's own additions (name mark, one-liner, call to
 * action) fade in and the hero-only matter fades out. Nothing vanishes to be
 * replaced — it relocates.
 *
 * Desktop only. Below the rail breakpoint the chrome stays in its hero layout
 * and simply scrolls away with the section.
 */
export function HeroChrome() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-chrome]");
    const hero = document.querySelector<HTMLElement>("#intro");
    if (!root || !hero) return;

    const flipItems = gsap.utils.toArray<HTMLElement>("[data-chrome-flip]");
    const railOnly = gsap.utils.toArray<HTMLElement>("[data-chrome-rail]");
    const heroOnly = gsap.utils.toArray<HTMLElement>("[data-chrome-hero]");
    const panel = document.querySelector<HTMLElement>("[data-chrome-panel]");
    // The giant wordmark lives in its own layer (behind the portrait); it is
    // hero-only, so it lifts and fades as the rail forms.
    const wordmark = document.querySelector<HTMLElement>("[data-hero='title']");

    // The current route mark on the rail's own nav.
    const links = [...root.querySelectorAll<HTMLElement>("[data-rail-link]")];
    const sections = links
      .map((link) => {
        const id = link.dataset.railLink ?? "";
        return {
          link,
          el: id ? document.querySelector<HTMLElement>(`#${id}`) : null,
        };
      })
      .filter((s): s is { link: HTMLElement; el: HTMLElement } => !!s.el);
    let offsets: number[] = [];
    let activeRoute = -1;
    const measureRoutes = () => {
      offsets = sections.map(
        (s) => s.el.getBoundingClientRect().top + window.scrollY,
      );
    };
    const resolveRoute = () => {
      const line = window.scrollY + window.innerHeight * READING_LINE;
      let current = 0;
      for (let i = 0; i < offsets.length; i++) {
        if ((offsets[i] ?? 0) <= line) current = i;
      }
      if (current === activeRoute) return;
      activeRoute = current;
      for (const [i, s] of sections.entries()) {
        s.link.dataset.active = i === current ? "true" : "false";
      }
    };

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      let flip: gsap.core.Timeline | null = null;

      // Build (and rebuild on resize) the Flip that morphs the shared items
      // between the hero layout and the rail layout. Captured from the hero
      // state, played toward the rail state, and scrubbed by the pin.
      const build = () => {
        flip?.kill();
        gsap.set(flipItems, { clearProps: "all" });
        root.dataset.state = "hero";
        const state = Flip.getState(flipItems, {
          props: "gap,padding,borderRadius,fontSize",
        });
        root.dataset.state = "rail";
        flip = Flip.from(state, {
          absolute: true,
          scale: false,
          paused: true,
          nested: true,
        });
      };
      build();
      // Start with the rail parts hidden and the hero parts shown; the scrub
      // takes over from the first frame.
      gsap.set([...railOnly, panel].filter(Boolean), { autoAlpha: 0 });
      gsap.set(heroOnly, { autoAlpha: 1 });

      const st = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: () => `+=${String(window.innerHeight * pin.hero)}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        refreshPriority: 10,
        onRefresh: () => {
          build();
          measureRoutes();
        },
        onUpdate: (self) => {
          const p = self.progress;
          flip?.progress(p);
          // The rail's own parts fade in over the back half of the morph, the
          // hero-only parts fade out over the front half, so the two never
          // both read at full strength.
          // Panel first (masks the shared items still travelling), then its
          // own contents once they have arrived.
          if (panel) {
            gsap.set(panel, {
              autoAlpha: gsap.utils.clamp(0, 1, (p - 0.3) / 0.3),
            });
          }
          gsap.set(railOnly, {
            autoAlpha: gsap.utils.clamp(0, 1, (p - 0.6) / 0.3),
          });
          gsap.set(heroOnly, {
            autoAlpha: gsap.utils.clamp(0, 1, 1 - p / 0.45),
          });
          if (wordmark) {
            gsap.set(wordmark, {
              yPercent: -14 * p,
              autoAlpha: gsap.utils.clamp(0, 1, 1 - p / 0.55),
            });
          }
          resolveRoute();
        },
      });

      // Route tracking continues past the pin, for the rest of the page.
      const tracker = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: resolveRoute,
        onRefresh: () => {
          measureRoutes();
          activeRoute = -1;
          resolveRoute();
        },
      });
      measureRoutes();
      resolveRoute();

      return () => {
        st.kill();
        tracker.kill();
        flip?.kill();
      };
    });

    return () => {
      mm.revert();
    };
  });

  const first = content.intro.name.split(" ")[0] ?? content.intro.name;

  return (
    <div
      data-chrome
      data-state="hero"
      className="hero-chrome"
      aria-hidden="false"
    >
      {/* The rail's glass sheet — background only, fades up early so the
          shared items finish travelling inside it rather than over open page. */}
      <div data-chrome-panel className="hero-chrome-panel glass rounded-md" />

      {/* Rail-only header: the small name mark + role. */}
      <div data-chrome-rail className="hero-chrome-mark">
        <a
          href="#intro"
          className="type-display block text-title leading-none font-extrabold text-accent"
        >
          {first}
        </a>
        <p className="mt-1 font-mono text-fine tracking-wide text-slate uppercase">
          {content.intro.role}
        </p>
      </div>

      {/* Rail-only one-liner. */}
      <p
        data-chrome-rail
        className="hero-chrome-blurb text-label leading-snug text-slate"
      >
        {content.intro.line}
      </p>

      {/* Shared: the proof numbers. Gold in both states, compact on the rail. */}
      <dl data-chrome-flip className="hero-chrome-stats">
        {content.intro.proofs.map((proof) => (
          <div
            key={proof.label}
            className="hero-chrome-stat rounded-xs bg-accent"
          >
            <dd className="type-display font-semibold whitespace-nowrap text-ink">
              {proof.value}
            </dd>
            <dt className="font-mono text-fine text-ink/70">{proof.label}</dt>
          </div>
        ))}
      </dl>

      {/* Shared: the routes. Row in the hero, column on the rail. */}
      <nav data-chrome-flip aria-label="Primary" className="hero-chrome-nav">
        <ul className="hero-chrome-nav-list">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-rail-link={item.href.slice(1)}
                data-active="false"
                className="hero-chrome-link transition-micro font-mono text-label text-ink transition-colors hover:text-signal"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Rail-only call to action. */}
      <a
        data-chrome-rail
        href="#contact"
        className="hero-chrome-cta transition-micro rounded-xs bg-ink text-center font-mono text-label text-paper transition-colors hover:bg-signal"
      >
        start a conversation
      </a>

      {/* Hero-only: the capabilities on the right and the location footnote —
          they belong to the first screen and fade as the rail forms. */}
      <ul data-chrome-hero className="hero-chrome-caps">
        {content.skills.capabilities.slice(0, CAP_COUNT).map((capability) => (
          <li
            key={capability.claim}
            className="font-mono text-label text-slate"
          >
            {capability.claim}
          </li>
        ))}
      </ul>
      <p
        data-chrome-hero
        className="hero-chrome-tagline font-mono text-fine text-slate"
      >
        {content.about.location}
      </p>
    </div>
  );
}
