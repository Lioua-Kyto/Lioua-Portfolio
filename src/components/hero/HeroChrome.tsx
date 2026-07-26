"use client";

import { Fragment, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { pin } from "@/lib/motion/tokens";
import { content } from "@/content";
import { NAV } from "@/components/nav";

const READING_LINE = 0.3;

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

function WhatsappIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M12.04 2A9.9 9.9 0 0 0 2.1 11.9c0 1.75.46 3.46 1.34 4.97L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01a9.9 9.9 0 0 0 9.9-9.9A9.9 9.9 0 0 0 12.04 2Zm0 18.14a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.2 8.2 0 1 1 6.99 3.87Zm4.5-6.15c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.13-.16.24-.63.79-.78.96-.14.16-.28.18-.53.06-.24-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.24-.29.36-.43.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.65 4.2 3.71.59.26 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.45-.59 1.66-1.17.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

/**
 * The hero chrome that becomes the side rail.
 *
 * The routes and proof numbers are a single set of elements — not duplicated
 * between a hero and a separate sidebar. On load the routes sit as one row
 * under the wordmark and the proofs stack lower-left. As the section pins and
 * scrolls, each card and each link travels to the rail on its own stagger, so
 * the block dissolves one piece at a time rather than sliding as a slab. The
 * wordmark slides and tightens into the rail intact, and the last name fades in
 * beside it. The working philosophy is hero-only: its words lift and fade left
 * to right as the hero gives way.
 *
 * Desktop only. Below the rail breakpoint the chrome is a plain hero that
 * scrolls away.
 */
export function HeroChrome() {
  const firstName = content.intro.name.split(" ")[0] ?? content.intro.name;
  const lastName = content.intro.name.split(" ").slice(1).join(" ");
  const philoWords = content.intro.philosophy.split(" ");

  // The rail's live details: a ticking local clock and copy-to-clipboard on the
  // address. Both write straight to the DOM — a state update here would
  // re-render the chrome that GSAP is mid-scrub on.
  useEffect(() => {
    const clock = document.querySelector<HTMLElement>("[data-rail-clock]");
    const button = document.querySelector<HTMLElement>("[data-copy-email]");
    const label = document.querySelector<HTMLElement>("[data-copy-label]");

    const tick = () => {
      if (!clock) return;
      clock.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Algiers",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());
    };
    tick();
    const timer = window.setInterval(tick, 30_000);

    let restore: number | undefined;
    const copy = () => {
      void navigator.clipboard.writeText(content.contact.email).then(() => {
        if (!label) return;
        label.textContent = "copied";
        window.clearTimeout(restore);
        restore = window.setTimeout(() => {
          label.textContent = content.contact.email;
        }, 1600);
      });
    };
    button?.addEventListener("click", copy);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(restore);
      button?.removeEventListener("click", copy);
    };
  }, []);

  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-chrome]");
    const hero = document.querySelector<HTMLElement>("#intro");
    if (!root || !hero) return;

    const railOnly = gsap.utils.toArray<HTMLElement>("[data-chrome-rail]");
    const heroOnly = gsap.utils.toArray<HTMLElement>("[data-chrome-hero]");
    const panel = document.querySelector<HTMLElement>("[data-chrome-panel]");

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
      const activeId = sections[current]?.link.dataset.railLink;
      for (const s of sections) {
        s.link.dataset.active =
          s.link.dataset.railLink === activeId ? "true" : "false";
      }
    };

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const rootFont = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const title = document.querySelector<HTMLElement>("[data-hero='title']");
      const h1 = title?.querySelector<HTMLElement>("h1") ?? null;
      const caps = document.querySelector<HTMLElement>(".hero-chrome-caps");
      const firstMark = document.querySelector<HTMLElement>("[data-chrome-first]");
      const role = document.querySelector<HTMLElement>(".hero-chrome-role");
      const statLeaves = gsap.utils.toArray<HTMLElement>('[data-morph="stat"]');
      const navLeaves = gsap.utils.toArray<HTMLElement>('[data-morph="nav"]');
      const words = gsap.utils.toArray<HTMLElement>("[data-philo-word]");
      const morphLeaves = [...statLeaves, ...navLeaves];

      let tl: gsap.core.Timeline | null = null;
      // The wordmark rides its own timeline so it can be swapped for a crisp,
      // real-font copy once it settles (a 20x transform scale of a 600px font
      // rasterises soft). These carry the settled crisp form between builds.
      let titleTl: gsap.core.Timeline | null = null;
      let landedFont = 0;
      let crisped = false;

      const build = () => {
        tl?.kill();
        titleTl?.kill();
        crisped = false;
        gsap.set(morphLeaves, { clearProps: "transform" });
        if (h1) gsap.set(h1, { clearProps: "transform,width,fontSize" });
        for (const el of [caps, role]) {
          if (!el) continue;
          el.style.left = "";
          el.style.top = "";
          el.style.fontSize = "";
        }

        // Measure both layouts by toggling the state class, then rest on hero
        // (the layout that matches the first paint, so nothing has to move at
        // progress 0). The transforms below carry each leaf to its rail spot.
        root.dataset.state = "hero";
        const heroRect = new Map<HTMLElement, DOMRect>();
        for (const el of morphLeaves)
          heroRect.set(el, el.getBoundingClientRect());
        let titleHero: DOMRect | null = null;
        let titleTight = 0;
        let titleFont = 0;
        if (h1) {
          titleHero = h1.getBoundingClientRect();
          titleFont = parseFloat(getComputedStyle(h1).fontSize);
          // `max-content` is what shrinks the justify-between flex row to the
          // letters' true width — plain `auto` stretches it to the full column.
          const prev = h1.style.width;
          h1.style.width = "max-content";
          titleTight = h1.getBoundingClientRect().width;
          h1.style.width = prev;
        }
        // The landing spot is the chrome-layer copy's own CSS position, sized
        // to the rail name, so the travelling title and its replacement agree
        // without either being positioned from the other.
        landedFont = 1.3 * rootFont;
        if (firstMark) firstMark.style.fontSize = `${String(landedFont)}px`;
        const anchor = firstMark?.getBoundingClientRect() ?? null;

        root.dataset.state = "rail";
        const railRect = new Map<HTMLElement, DOMRect>();
        for (const el of morphLeaves)
          railRect.set(el, el.getBoundingClientRect());
        root.dataset.state = "hero";

        const timeline = gsap.timeline({ paused: true });

        const addLeaf = (el: HTMLElement, start: number, arrive: number) => {
          const a = heroRect.get(el);
          const b = railRect.get(el);
          if (!a || !b) return;
          timeline.fromTo(
            el,
            { x: 0, y: 0, scale: 1 },
            {
              x: b.left - a.left,
              y: b.top - a.top,
              scale: a.width ? b.width / a.width : 1,
              transformOrigin: "left top",
              ease: "power3.inOut",
              duration: arrive - start,
            },
            start,
          );
        };
        // Staggered windows: each leaf starts and settles at a different point,
        // so they travel at visibly different speeds instead of as one slab.
        statLeaves.forEach((el, i) => {
          addLeaf(el, 0.06 + i * 0.11, 0.72 + i * 0.08);
        });
        navLeaves.forEach((el, i) => {
          addLeaf(el, 0.12 + i * 0.055, 0.74 + i * 0.04);
        });

        // Philosophy words lift away, left to right — they do not go to the rail.
        words.forEach((word, i) => {
          timeline.fromTo(
            word,
            { yPercent: 0, autoAlpha: 1 },
            {
              yPercent: -130,
              autoAlpha: 0,
              ease: "power2.in",
              duration: 0.22,
            },
            0.02 + i * 0.018,
          );
        });

        // The wordmark itself slides and tightens into the rail, never fading:
        // it translates to the rail anchor, scales down to a rail-sized name,
        // and its width collapses to `max-content` so the spread letters close
        // up. The landed name is a fixed 1.3rem — small enough that
        // "LIOUA ZEDDAM" fits the rail side by side. It rides `titleTl` so the
        // scaled transform can be swapped for a crisp real-font copy at settle.
        if (h1 && titleHero && anchor && titleTight && titleFont) {
          const scale = landedFont / titleFont;
          titleTl = gsap.timeline({ paused: true });
          titleTl.fromTo(
            h1,
            { x: 0, y: 0, scale: 1, width: titleHero.width },
            {
              x: anchor.left - titleHero.left,
              y: anchor.top - titleHero.top,
              scale,
              width: titleTight,
              transformOrigin: "left top",
              ease: "power3.inOut",
              duration: 1,
            },
            0,
          );

          // The replacement copy's own box gives the landed footprint, so the
          // last name butts against the mark's true edge.
          const landedW = anchor.width;
          const landedH = anchor.height;

          // The last name lands right beside the wordmark; the role sits under
          // the name line. caps matches the wordmark's font exactly, so the two
          // read as one name.
          if (caps) {
            caps.style.left = `${String(anchor.left + landedW + 0.4 * rootFont)}px`;
            caps.style.top = `${String(anchor.top)}px`;
            caps.style.fontSize = `${String(landedFont)}px`;
          }
          if (role) {
            role.style.left = `${String(anchor.left)}px`;
            role.style.top = `${String(anchor.top + landedH + 0.3 * rootFont)}px`;
          }
        }

        tl = timeline;
        return timeline;
      };

      build();
      gsap.set([...railOnly, panel].filter(Boolean), { autoAlpha: 0 });
      gsap.set(heroOnly, { autoAlpha: 1 });

      // Everything the pin drives, as a pure function of progress. A refresh
      // rebuilds the timeline from scratch, so it has to re-apply the current
      // progress too — otherwise a refresh triggered while the rail is showing
      // (an in-page jump does exactly that) left the shared items back in their
      // hero positions with the rail still faded up over them.
      const apply = (p: number) => {
        tl?.progress(p);

          // The wordmark travels over p [0.04, 0.86]. At settle it hands off to
          // the chrome-layer copy sitting at the same spot: the travelling
          // element lives under the portrait (so it is never seen in front of
          // it) but is therefore also under the glass panel, which blurs it.
          // The copy is above the panel, so the mark comes to rest sharp.
          if (h1 && titleTl) {
            const tp = gsap.utils.clamp(0, 1, (p - 0.04) / 0.82);
            if (tp >= 0.999) {
              if (!crisped) {
                crisped = true;
                gsap.set(h1, { autoAlpha: 0 });
                if (firstMark) gsap.set(firstMark, { autoAlpha: 1 });
              }
            } else {
              if (crisped) {
                crisped = false;
                gsap.set(h1, { autoAlpha: 1 });
                if (firstMark) gsap.set(firstMark, { autoAlpha: 0 });
              }
              titleTl.progress(tp);
            }
          }

          if (panel) {
            gsap.set(panel, {
              autoAlpha: gsap.utils.clamp(0, 1, (p - 0.3) / 0.3),
            });
          }
          gsap.set(railOnly, {
            autoAlpha: gsap.utils.clamp(0, 1, (p - 0.62) / 0.26),
          });
          gsap.set(heroOnly, {
            autoAlpha: gsap.utils.clamp(0, 1, 1 - p / 0.4),
          });
          // The route numbers belong to the rail only; `data-state` stays
          // "hero" (the morph is pure transform), so the rail look is flagged
          // separately.
          root.dataset.rail = p > 0.62 ? "true" : "false";
          resolveRoute();
        };

      const st = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: () => `+=${String(window.innerHeight * pin.hero)}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        refreshPriority: 10,
        onRefresh: (self) => {
          build();
          measureRoutes();
          apply(self.progress);
        },
        onUpdate: (self) => {
          apply(self.progress);
        },
      });

      const threadFill = document.querySelector<HTMLElement>(
        "[data-thread-fill]",
      );
      const tracker = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        // Refresh last. Pins add their spacers during refresh, so a tracker
        // that measured earlier saw a page without the Work section's pin
        // distance in it: the thread read 100% at the end of Work and the
        // route offsets past it were wrong.
        refreshPriority: -10,
        onUpdate: (self) => {
          if (threadFill) gsap.set(threadFill, { scaleY: self.progress });
          resolveRoute();
        },
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
        tl?.kill();
        titleTl?.kill();
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

      {/* The wordmark's landing spot. The sliding title travels behind the
          portrait and hands off to this copy the instant it arrives: same
          place, same size, but painted in the chrome layer above the glass, so
          it is not blurred by the panel's backdrop-filter the way the layer
          underneath it is. The swap is invisible because the positions match. */}
      <span
        data-chrome-first
        className="hero-chrome-first type-display font-extrabold whitespace-nowrap text-accent uppercase leading-none"
      >
        {firstName}
      </span>

      {/* Rail-only: the last name lands beside the wordmark, and the role
          sits under the name line. Both JS-positioned against the wordmark. */}
      <span
        data-chrome-rail
        className="hero-chrome-caps type-display font-extrabold whitespace-nowrap text-accent uppercase leading-none"
      >
        {lastName}
      </span>
      <span
        data-chrome-rail
        className="hero-chrome-role font-mono text-fine tracking-wide text-slate uppercase"
      >
        {content.intro.role}
      </span>

      {/* Rail-only: the reading thread. The rail's own edge is the progress
          instrument — it fills as the page is read, the same drawn-line idea
          the Background section's timeline uses. */}
      <div data-chrome-rail className="hero-chrome-thread">
        <span data-thread-fill className="hero-chrome-thread-fill" />
      </div>

      {/* Rail-only: live status. A working signal and the local clock — the
          two things a client or recruiter checks first. */}
      <div data-chrome-rail className="hero-chrome-status">
        <span className="hero-chrome-dot" aria-hidden="true" />
        <span className="font-mono text-fine tracking-wide text-ink uppercase">
          Available for work
        </span>
      </div>
      <p
        data-chrome-rail
        className="hero-chrome-clock font-mono text-fine tracking-wide text-slate uppercase"
      >
        <span data-rail-clock>--:--</span> local · Algeria
      </p>

      {/* Rail-only: the module rules. Hairlines group the rail into masthead
          blocks — identity, proof, routes, contact. */}
      <div data-chrome-rail className="hero-chrome-rule hero-chrome-rule--a" />
      <div data-chrome-rail className="hero-chrome-rule hero-chrome-rule--b" />
      <div data-chrome-rail className="hero-chrome-rule hero-chrome-rule--c" />

      {/* Hero-only: the working philosophy. Its words lift and fade left to
          right on scroll rather than relocating to the rail. */}
      <p className="hero-chrome-philosophy type-display font-medium text-ink">
        {philoWords.map((word, i) => (
          <Fragment key={`${word}-${String(i)}`}>
            <span data-philo-word className="inline-block will-change-transform">
              {word}
            </span>
            {i < philoWords.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </p>

      {/* Shared: the proof numbers. Each card travels to the rail on its own
          stagger. The accent is spent only on the value and a thin left rule. */}
      <dl className="hero-chrome-stats">
        {content.intro.proofs.map((proof) => (
          <div key={proof.label} data-morph="stat" className="hero-chrome-stat">
            <dd className="type-display font-semibold whitespace-nowrap text-accent">
              {proof.value}
            </dd>
            <dt className="font-mono text-fine text-slate">{proof.label}</dt>
          </div>
        ))}
      </dl>

      {/* Shared: the routes. One row under the wordmark on load; each link
          travels to the rail column independently. */}
      <nav aria-label="Primary" className="hero-chrome-navwrap">
        <ul className="hero-chrome-nav">
          {NAV.map((item) => (
            <li key={item.href} data-morph="nav">
              <a
                href={item.href}
                data-rail-link={item.href.slice(1)}
                data-active="false"
                className="hero-chrome-link transition-micro font-mono text-label transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Rail-only: social links. */}
      <div data-chrome-rail className="hero-chrome-socials">
        <a
          href={`https://${content.contact.github}`}
          aria-label="GitHub"
          rel="me noopener"
          className="hero-chrome-social transition-micro"
        >
          <GithubIcon />
        </a>
        <a
          href={`https://${content.contact.linkedin}`}
          aria-label="LinkedIn"
          rel="me noopener"
          className="hero-chrome-social transition-micro"
        >
          <LinkedinIcon />
        </a>
        {content.contact.whatsapp ? (
          <a
            href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, "")}`}
            aria-label="WhatsApp"
            rel="me noopener"
            className="hero-chrome-social transition-micro"
          >
            <WhatsappIcon />
          </a>
        ) : null}
      </div>

      {/* Rail-only: the address, one click away. Recruiters copy it far more
          often than they open a mail client. */}
      <button
        data-chrome-rail
        data-copy-email
        type="button"
        className="hero-chrome-email transition-micro font-mono text-fine text-slate transition-colors hover:text-ink"
      >
        <span data-copy-label className="truncate">
          {content.contact.email}
        </span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3 w-3 shrink-0">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M9 9V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4M5 9h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"
          />
        </svg>
      </button>

      {/* Rail-only call to action. */}
      <a
        data-chrome-rail
        href="#contact"
        className="hero-chrome-cta transition-micro rounded-xs font-mono text-fine"
      >
        <span>Let&apos;s talk</span>
        <span aria-hidden="true" className="hero-chrome-cta-arrow">
          →
        </span>
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
