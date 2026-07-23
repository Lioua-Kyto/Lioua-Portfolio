import { content } from "@/content";
import { NAV } from "@/components/nav";
import { RotatingWords } from "@/components/motion/RotatingWords";

/**
 * 00 — Intro: the giant name spanning the viewport, the section routes sitting
 * directly beneath it, and the supporting matter arranged left and right of
 * the portrait backdrop. Every group carries a `data-hero` key so `HeroScene`
 * can bring it in on its own delay and send it out at its own speed.
 */
export function Intro() {
  const { intro, about, skills } = content;
  const [firstName, ...restName] = intro.name.split(" ");

  return (
    <section
      id="intro"
      aria-label="Intro"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-[6vh] pb-8"
    >
      {/* The giant name — the graphic plate, over the portrait layer. */}
      <div data-hero="title" className="pointer-events-none relative z-20">
        <h1
          aria-label={intro.name}
          className="type-serif shell text-giant font-semibold text-accent-deep"
        >
          {[firstName ?? "", restName.join(" ")].map((line) => (
            <span
              key={line}
              aria-hidden="true"
              className="block overflow-hidden pb-[0.08em]"
            >
              <span data-hero-word className="block will-change-transform">
                {line}
              </span>
            </span>
          ))}
        </h1>
      </div>

      {/* The routes live under the name — they travel to the rail on scroll. */}
      <nav aria-label="Primary" className="relative z-20 mt-6">
        <ul className="shell flex flex-wrap items-baseline gap-x-6 gap-y-2">
          {NAV.map((item) => (
            <li key={item.href} data-hero="nav">
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

      {/* The portrait stands in the middle column, so the matter around it
          flanks rather than covers it — and the two text blocks that do sit
          over it carry a translucent paper panel, since the suit behind them
          is nearly as dark as the ink. */}
      <div className="relative z-20 shell mt-auto grid grid-cols-1 items-end gap-5 pt-8 lg:grid-cols-[minmax(0,19rem)_1fr_minmax(0,19rem)] lg:gap-6">
        {/* Left — the proof numbers. */}
        {/* Value and label share a line: stacked, three of these cost enough
            height to push the claim below the fold on a laptop screen. */}
        <dl className="grid grid-cols-3 gap-2 lg:grid-cols-1">
          {intro.proofs.map((proof) => (
            <div
              key={proof.label}
              data-hero="stats"
              className="rounded-xs bg-accent px-3.5 py-2"
            >
              <dd className="type-serif text-lede font-semibold whitespace-nowrap text-ink">
                {proof.value}
              </dd>
              <dt className="font-mono text-fine text-ink/70">{proof.label}</dt>
            </div>
          ))}
        </dl>

        {/* The claim takes the centre, over the portrait — the wide column is
            the only one that holds it without wrapping into a tall block. */}
        <div
          data-hero="lede"
          className="max-w-[34ch] rounded-xs bg-paper/85 p-4 backdrop-blur-sm lg:justify-self-center"
        >
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
              href="#products"
              className="transition-micro rounded-xs bg-ink px-3.5 py-2 font-mono text-label text-paper transition-colors hover:bg-signal"
            >
              see the work
            </a>
            <a
              href="#contact"
              className="transition-micro rounded-xs border border-ink/25 px-3.5 py-2 font-mono text-label text-ink transition-colors hover:border-ink/50"
            >
              get in touch
            </a>
          </p>
        </div>

        {/* Right — what that actually means in practice. */}
        <ul className="rounded-xs bg-paper/85 p-3 backdrop-blur-sm">
          {skills.capabilities.slice(0, 5).map((capability) => (
            <li
              key={capability.claim}
              data-hero="capabilities"
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

      <p
        data-hero="tagline"
        className="relative z-20 shell mt-10 font-mono text-fine text-slate"
      >
        {about.location}
      </p>
    </section>
  );
}
