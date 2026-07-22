import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { MaskText } from "@/components/motion/MaskText";
import { RotatingWords } from "@/components/motion/RotatingWords";

/**
 * 00 — Intro (v3 brief §3.00): name, role, one honest line, rotating
 * descriptor, three proof numbers. The name mask-reveals on mount; the
 * supporting elements rise + fade via the hero timeline (Motion controller).
 */
export function Intro() {
  const { intro } = content;

  return (
    <section id="intro" aria-label="Intro" className="flex min-h-svh flex-col">
      <div className="shell flex grow flex-col pt-28 pb-12">
        <Label index="00">Intro</Label>

        <div className="my-auto max-w-5xl py-16">
          <MaskText
            as="h1"
            scroll={false}
            delay={0.15}
            text={intro.name}
            className="type-serif block text-display font-semibold"
          />
          <p
            data-hero-el
            className="mt-6 flex flex-wrap items-baseline gap-x-3 font-mono text-label text-slate"
          >
            <span>{intro.role}</span>
            <span aria-hidden="true" className="text-signal">
              /
            </span>
            <RotatingWords words={intro.roleWords} className="text-ink" />
          </p>
          <p data-hero-el className="mt-4 max-w-[36ch] text-lede">
            {intro.line}
          </p>
        </div>

        <dl
          data-hero-el
          className="grid gap-x-10 gap-y-8 sm:grid-cols-3 sm:gap-x-14"
        >
          {intro.proofs.map((proof) => (
            <div key={proof.label} className="hairline pt-4">
              <dd className="type-serif text-title font-medium">
                {proof.value}
              </dd>
              <dt className="mt-1 font-mono text-label text-slate">
                {proof.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
