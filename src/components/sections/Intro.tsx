import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { RotatingWords } from "@/components/motion/RotatingWords";

/**
 * 00 — Intro: the giant name in accent gold over the portrait backdrop, with
 * the honest one-liner and proof cards. Everything here is marked
 * `data-hero-exit` so it travels up and fades as the hero scrolls away,
 * leaving the softened portrait behind it.
 */
export function Intro() {
  const { intro } = content;
  const [firstName, ...restName] = intro.name.split(" ");

  return (
    <section
      id="intro"
      aria-label="Intro"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* Giant name — the graphic backdrop, over the portrait layer. */}
      <div
        data-hero-exit
        className="pointer-events-none absolute inset-x-0 top-[17vh] z-20"
      >
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

      <div className="relative z-20 shell flex grow flex-col pt-28 pb-12">
        <Label index="00">Intro</Label>

        <div
          data-hero-exit
          className="mt-auto grid gap-8 md:grid-cols-2 md:items-end"
        >
          <div data-hero-el className="max-w-[34ch]">
            <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-label text-slate">
              <span>{intro.role}</span>
              <span aria-hidden="true" className="text-signal">
                /
              </span>
              <RotatingWords words={intro.roleWords} className="text-ink" />
            </p>
            <p className="mt-3 text-lede">{intro.line}</p>
          </div>

          <dl className="grid grid-cols-3 gap-3 md:justify-self-end">
            {intro.proofs.map((proof) => (
              <div
                key={proof.label}
                data-hero-el
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
        </div>
      </div>
    </section>
  );
}
