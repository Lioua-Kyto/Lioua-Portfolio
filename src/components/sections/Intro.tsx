import { content } from "@/content";
import { Label } from "@/components/primitives/Label";

/**
 * 00 — Intro (v3 brief §3.00): name, role, one honest line, then three proof
 * numbers stated flatly. Above the fold; the Phase 3 hero timeline animates
 * these elements in reading order.
 */
export function Intro() {
  const { intro } = content;

  return (
    <section id="intro" aria-label="Intro" className="flex min-h-svh flex-col">
      <div className="shell flex grow flex-col pt-28 pb-12">
        <Label index="00">Intro</Label>

        <div className="my-auto max-w-5xl py-16">
          <h1
            data-hero-lead
            className="type-serif text-display font-semibold text-balance"
          >
            {intro.name}
          </h1>
          <p data-hero-el className="mt-6 font-mono text-label text-slate">
            {intro.role}
          </p>
          <p data-hero-el className="mt-3 max-w-[36ch] text-lede">
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
