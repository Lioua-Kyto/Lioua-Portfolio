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
      className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-[14vh] pb-10"
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

      <div className="relative z-20 shell mt-auto grid grid-cols-1 items-end gap-8 pt-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,4fr)_minmax(0,3fr)]">
        {/* Left — the proof numbers. */}
        <dl className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          {intro.proofs.map((proof) => (
            <div
              key={proof.label}
              data-hero="stats"
              className="rounded-xs bg-accent px-4 py-3"
            >
              <dd className="type-serif text-title font-semibold text-ink">
                {proof.value}
              </dd>
              <dt className="mt-1 font-mono text-fine text-ink/70">
                {proof.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* Centre — the claim. */}
        <div data-hero="lede" className="max-w-[34ch]">
          <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-label text-slate">
            <span>{intro.role}</span>
            <span aria-hidden="true" className="text-signal">
              /
            </span>
            <RotatingWords words={intro.roleWords} className="text-ink" />
          </p>
          <p className="mt-3 text-lede">{intro.line}</p>
          <p className="mt-6 flex flex-wrap gap-3">
            <a
              href="#products"
              className="transition-micro rounded-xs bg-ink px-4 py-2.5 font-mono text-label text-paper transition-colors hover:bg-signal"
            >
              see the work
            </a>
            <a
              href="#contact"
              className="transition-micro rounded-xs border border-ink/20 px-4 py-2.5 font-mono text-label text-ink transition-colors hover:border-ink/50"
            >
              get in touch
            </a>
          </p>
        </div>

        {/* Right — what that actually means in practice. */}
        <ul className="space-y-1.5 lg:justify-self-end">
          {skills.capabilities.slice(0, 5).map((capability) => (
            <li
              key={capability.claim}
              data-hero="capabilities"
              className="flex items-baseline gap-2.5 font-mono text-label text-slate"
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
