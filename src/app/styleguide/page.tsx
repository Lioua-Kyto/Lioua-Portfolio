import type { Metadata } from "next";
import { Label } from "@/components/primitives/Label";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false },
};

const SWATCHES = [
  { name: "paper", className: "bg-paper border border-ink/15" },
  { name: "surface", className: "bg-surface" },
  { name: "ink", className: "bg-ink" },
  { name: "slate", className: "bg-slate" },
  { name: "signal", className: "bg-signal" },
  { name: "ok", className: "bg-ok" },
  { name: "err", className: "bg-err" },
];

/**
 * Phase 1 deliverable (v3 brief §7): the type/label system demonstrable on
 * one route. Not linked from the site; noindexed.
 */
export default function StyleguidePage() {
  return (
    <main className="shell space-y-20 py-24">
      <header>
        <Label index="00">Styleguide — design system, v3</Label>
        <h1 className="type-serif mt-4 text-headline font-semibold">
          Three voices on paper
        </h1>
      </header>

      <section aria-label="Type scale" className="space-y-8">
        <div className="hairline pt-4">
          <Label index="01">Type scale</Label>
        </div>
        <p className="type-serif text-display font-semibold">Display Aa</p>
        <p className="type-serif text-headline font-semibold">Headline Aa</p>
        <p className="type-serif text-title font-medium">Title Aa</p>
        <p className="max-w-[52ch] text-lede">
          Lede — the opening voice of a section, set in the grotesk body face at
          a generous size.
        </p>
        <p className="max-w-[62ch] text-base">
          Body — General Sans at reading size. Plain, human, concrete. Real
          numbers over adjectives: 176ms → 38ms, stated flatly.
        </p>
        <p className="font-mono text-label text-slate">
          label — the mono micro voice · Fig. A · stack tags · coordinates
        </p>
        <p className="font-mono text-fine text-slate">
          fine — smallest annotations
        </p>
      </section>

      <section aria-label="Labels" className="space-y-4">
        <div className="hairline pt-4">
          <Label index="02">Label primitive</Label>
        </div>
        <p>
          <Label index="01">Background</Label>
        </p>
        <p>
          <Label>Fig. A — request lifecycle</Label>
        </p>
        <p>
          <Label>Django · PostgreSQL · Redis</Label>
        </p>
      </section>

      <section aria-label="Palette">
        <div className="hairline pt-4">
          <Label index="03">Palette</Label>
        </div>
        <ul className="mt-8 flex flex-wrap gap-6">
          {SWATCHES.map((swatch) => (
            <li key={swatch.name} className="w-28">
              <div className={`h-16 rounded-xs ${swatch.className}`} />
              <p className="mt-2 font-mono text-fine text-slate">
                {swatch.name}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Accent usage" className="max-w-[62ch] space-y-4">
        <div className="hairline pt-4">
          <Label index="04">Accent</Label>
        </div>
        <p className="text-base">
          The accent appears in{" "}
          <a href="#" className="text-signal underline underline-offset-4">
            links
          </a>{" "}
          and at most one highlight per view. Everything else is ink on paper.
        </p>
      </section>
    </main>
  );
}
