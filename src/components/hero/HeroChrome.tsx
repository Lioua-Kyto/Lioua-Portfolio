"use client";

import { useGSAP } from "@gsap/react";
import { gsap, Flip, ScrollTrigger } from "@/lib/motion/gsap";
import { pin } from "@/lib/motion/tokens";
import { content } from "@/content";
import { NAV_LEFT, NAV_RIGHT } from "@/components/nav";

const READING_LINE = 0.3;

type Route = { label: string; href: string };

function NavGroup({
  routes,
  align,
}: {
  routes: readonly Route[];
  align: string;
}) {
  return (
    <ul data-chrome-flip className={`hero-chrome-nav ${align}`}>
      {routes.map((item) => (
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
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33 0-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

/**
 * The hero chrome that becomes the side rail.
 *
 * The routes, proof numbers, and working philosophy are a single set of
 * elements — not duplicated between a hero and a separate sidebar. On load the
 * routes flank the portrait, the proofs sit lower-left, and the philosophy sits
 * lower-right. As the section pins and scrolls, GSAP Flip carries those same
 * elements into a fixed glass rail on the left; the rail's own additions (full
 * name mark, social links, call to action) fade in and the hero-only footnote
 * fades out. Nothing vanishes to be replaced — it relocates.
 *
 * Desktop only. Below the rail breakpoint the chrome is a plain hero that
 * scrolls away.
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
    const wordmark = document.querySelector<HTMLElement>("[data-hero='title']");

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
      // Two links can point at the same section (e.g. home + intro); mark all.
      const activeId = sections[current]?.link.dataset.railLink;
      for (const s of sections) {
        s.link.dataset.active =
          s.link.dataset.railLink === activeId ? "true" : "false";
      }
    };

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      let flip: gsap.core.Timeline | null = null;

      const build = () => {
        flip?.kill();
        gsap.set(flipItems, { clearProps: "all" });
        root.dataset.state = "hero";
        const state = Flip.getState(flipItems, {
          props: "gap,padding,borderRadius,fontSize,textAlign",
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

  return (
    <div data-chrome data-state="hero" className="hero-chrome">
      {/* The rail's glass sheet — fades up early so the shared items finish
          travelling inside it rather than over open page. */}
      <div data-chrome-panel className="hero-chrome-panel glass rounded-md" />

      {/* Rail-only header: the full name mark + role. */}
      <div data-chrome-rail className="hero-chrome-mark">
        <a
          href="#intro"
          className="type-display block text-lede leading-[1.05] font-extrabold text-accent"
        >
          {content.intro.name}
        </a>
        <p className="mt-1 font-mono text-fine tracking-wide text-slate uppercase">
          {content.intro.role}
        </p>
      </div>

      {/* Shared: the working philosophy — hero right, then the rail. */}
      <p data-chrome-flip className="hero-chrome-philosophy text-slate">
        {content.intro.philosophy}
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

      {/* Shared: the routes, flanking the portrait, converging on the rail.
          One nav landmark; two lists positioned independently for the split. */}
      <nav aria-label="Primary" className="hero-chrome-navwrap">
        <NavGroup routes={NAV_LEFT} align="hero-chrome-nav--left" />
        <NavGroup routes={NAV_RIGHT} align="hero-chrome-nav--right" />
      </nav>

      {/* Rail-only: social links. */}
      <div data-chrome-rail className="hero-chrome-socials">
        <a
          href={`https://${content.contact.github}`}
          aria-label="GitHub"
          rel="me noopener"
          className="transition-micro text-slate transition-colors hover:text-ink"
        >
          <GithubIcon />
        </a>
        <a
          href={`https://${content.contact.linkedin}`}
          aria-label="LinkedIn"
          rel="me noopener"
          className="transition-micro text-slate transition-colors hover:text-ink"
        >
          <LinkedinIcon />
        </a>
      </div>

      {/* Rail-only call to action. */}
      <a
        data-chrome-rail
        href="#contact"
        className="hero-chrome-cta transition-micro rounded-xs bg-ink text-center font-mono text-label text-paper transition-colors hover:bg-signal"
      >
        start a conversation
      </a>

      {/* Hero-only footnote. */}
      <p
        data-chrome-hero
        className="hero-chrome-tagline font-mono text-fine text-slate"
      >
        {content.about.location}
      </p>
    </div>
  );
}
