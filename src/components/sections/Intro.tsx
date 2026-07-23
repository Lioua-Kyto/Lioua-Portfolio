import type { CSSProperties } from "react";
import { content } from "@/content";
import { NAV } from "@/components/nav";
import { RotatingWords } from "@/components/motion/RotatingWords";

/** Position in a group, read by the entrance keyframes as a delay multiplier. */
const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * 00 — Intro: the given name at full width, the section routes directly
 * beneath it, and the supporting matter flanking the portrait.
 *
 * Every group is two nested elements on purpose. The outer `data-hero` node is
 * the scroll layer: it carries the group to its place in the rail. The inner
 * `data-hero-in` node is the entrance layer. Splitting them lets both
 * animations exist from first paint without overwriting each other's opacity —
 * which is what forces the scroll choreography to be built late, and a
 * late-built pin corrupts every ScrollTrigger measured before it.
 */
export function Intro() {
  const { intro, about, skills } = content;

  return (
    <section
      id="intro"
      aria-label="Intro"
      // z-20 puts the hero's own stacking context above the portrait layer
      // (z-10) so the claim and stats read in front of the photo. The pin sets
      // position:fixed here, which makes this a stacking context — without an
      // explicit z-index it would default below the portrait and the whole
      // hero would be painted over.
      className="relative z-20 flex min-h-svh flex-col justify-between overflow-hidden pt-[4vh] pb-8"
    >
      {/* Reserves exactly the wordmark's height. The name itself is painted by
          <HeroName /> from a layer beneath the portrait, so the photo can sit
          between it and the rest of this section. */}
      <div
        aria-hidden="true"
        className="shrink-0"
        style={{ height: "calc(var(--name-size) * var(--name-leading))" }}
      />

      <nav aria-label="Primary" className="relative z-20 mt-5">
        <ul
          data-hero="nav"
          className="shell flex flex-wrap items-baseline gap-x-6 gap-y-2"
        >
          {NAV.map((item, index) => (
            <li key={item.href} data-hero-in style={stagger(index)}>
              <a
                href={item.href}
                className="transition-micro font-mono text-label text-ink transition-colors hover:text-signal"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative z-20 shell mt-auto grid grid-cols-1 items-end gap-5 pt-8 lg:grid-cols-[minmax(0,19rem)_1fr_minmax(0,19rem)] lg:gap-6">
        <dl data-hero="stats" className="grid grid-cols-3 gap-2 lg:grid-cols-1">
          {intro.proofs.map((proof, index) => (
            <div
              key={proof.label}
              data-hero-in
              style={stagger(index)}
              className="rounded-xs bg-accent px-3.5 py-2"
            >
              <dd className="type-display text-lede font-semibold whitespace-nowrap text-ink">
                {proof.value}
              </dd>
              <dt className="font-mono text-fine text-ink/70">{proof.label}</dt>
            </div>
          ))}
        </dl>

        {/* The claim takes the centre, over the portrait — the wide column is
            the only one that holds it without wrapping into a tall block, and
            the frosted panel keeps ink legible against the suit behind it. */}
        <div data-hero="lede" className="lg:justify-self-center">
          <div data-hero-in className="glass max-w-[34ch] rounded-sm px-5 py-4">
            <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-label text-slate">
              <span>{intro.role}</span>
              <span aria-hidden="true" className="text-signal">
                /
              </span>
              <RotatingWords words={intro.roleWords} className="text-ink" />
            </p>
            <p className="mt-2 text-lede">{intro.line}</p>
            <p className="mt-4 flex flex-wrap gap-2">
              <a
                href="#work"
                className="transition-micro rounded-xs bg-ink px-3.5 py-2 font-mono text-label text-paper transition-colors hover:bg-signal"
              >
                see the work
              </a>
              <a
                href="#contact"
                className="transition-micro rounded-xs border border-ink/25 px-3.5 py-2 font-mono text-label text-ink transition-colors hover:border-ink/50"
              >
                start a conversation
              </a>
            </p>
          </div>
        </div>

        <div data-hero="capabilities">
          <ul data-hero-in className="glass rounded-sm px-4 py-3">
            {skills.capabilities.slice(0, 5).map((capability) => (
              <li
                key={capability.claim}
                className="flex items-baseline gap-2.5 py-0.5 font-mono text-label text-slate"
              >
                <span aria-hidden="true" className="text-accent-deep">
                  ▸
                </span>
                {capability.claim}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p data-hero="tagline" className="relative z-20 shell mt-5">
        <span data-hero-in className="font-mono text-fine text-slate">
          {about.location}
        </span>
      </p>
    </section>
  );
}
