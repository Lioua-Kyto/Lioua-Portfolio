import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { Label } from "@/components/primitives/Label";
import { MaskText } from "@/components/motion/MaskText";

/**
 * 01 — Background: the honest year-by-year arc. The portrait now leads the
 * hero, so this section belongs entirely to the timeline — the beats reveal
 * as they scroll in and reverse on the way back.
 */
export function Background() {
  const { timeline, about } = content;

  return (
    <Section id="background" index="01" label="Background">
      <div className="mt-10 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <MaskText
            as="h3"
            text="Start small, grow big."
            className="type-serif block max-w-[12ch] text-headline font-medium"
          />
          <div
            data-reveal
            className="mt-8 space-y-1 font-mono text-label text-slate"
          >
            <p>{about.location}</p>
            <p>{about.languages}</p>
            <p className="pt-3 text-ink">{about.education}</p>
          </div>
        </div>

        <ol className="max-w-[62ch]">
          {timeline.map((beat) => (
            <li
              key={beat.year}
              data-reveal
              className="hairline grid gap-x-8 gap-y-2 py-8 first:border-t-0 first:pt-0 sm:grid-cols-[7rem_minmax(0,1fr)]"
            >
              <Label className="pt-1 text-signal">{beat.year}</Label>
              <p className="text-base">{beat.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
