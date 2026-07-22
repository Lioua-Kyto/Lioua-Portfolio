import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { Label } from "@/components/primitives/Label";

/**
 * Designed portrait placeholder (v3 brief §5/§6): framed, labeled, and
 * intentional until the real photo lands. Gets the scroll-blur treatment in
 * Phase 3 (motion spec §3).
 */
function PortraitFrame() {
  return (
    <figure data-portrait className="max-w-sm">
      <div
        className="flex aspect-[4/5] items-center justify-center rounded-xs bg-surface"
        aria-hidden="true"
      >
        <span className="type-serif text-display font-medium text-slate/40">
          LZ
        </span>
      </div>
      <figcaption className="mt-2 flex justify-between font-mono text-fine text-slate">
        <span>portrait — on its way</span>
        <span>fig. 01</span>
      </figcaption>
    </figure>
  );
}

/**
 * 01 — Background (v3 brief §3.01): the honest year-by-year arc, plus the
 * portrait. The heynesh borrow, true to the real path.
 */
export function Background() {
  const { timeline, about } = content;

  return (
    <Section id="background" index="01" label="Background">
      <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <PortraitFrame />
          <div className="mt-8 space-y-1 font-mono text-label text-slate">
            <p>{about.location}</p>
            <p>{about.languages}</p>
          </div>
        </div>

        <ol className="max-w-[62ch]">
          {timeline.map((beat) => (
            <li
              key={beat.year}
              data-reveal
              className="hairline grid gap-x-8 gap-y-2 py-8 first:border-t-0 first:pt-0 sm:grid-cols-[7rem_minmax(0,1fr)]"
            >
              <Label className="pt-1">{beat.year}</Label>
              <p className="text-base">{beat.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
