import Image from "next/image";
import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { RotatingWords } from "@/components/motion/RotatingWords";

/**
 * 00 — Intro: the giant name in accent gold with the portrait cutout layered
 * in front, floating proof cards, and the honest one-liner. The name is set
 * in --accent-deep so the large type still clears 3:1 on paper; the vivid
 * gold is reserved for solid fills with ink on top.
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
      {/* Giant name — the graphic backdrop. */}
      <div className="pointer-events-none absolute inset-x-0 top-[17vh] z-0">
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

      {/* Portrait — layered over the name, blurs away on scroll. */}
      <div
        data-portrait
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center"
      >
        <Image
          src="/img/portrait.webp"
          alt=""
          aria-hidden="true"
          width={1400}
          height={1050}
          priority
          sizes="(max-width: 768px) 150vw, 90vw"
          className="h-[62vh] w-auto max-w-none object-contain sm:h-[72vh]"
        />
      </div>

      {/* Chrome + copy sit above the portrait. */}
      <div className="relative z-20 shell flex grow flex-col pt-28 pb-12">
        <Label index="00">Intro</Label>

        <div className="mt-auto grid gap-8 md:grid-cols-2 md:items-end">
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
