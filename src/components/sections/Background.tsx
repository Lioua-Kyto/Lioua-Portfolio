import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { Label } from "@/components/primitives/Label";
import { MaskText } from "@/components/motion/MaskText";
import { TimelinePath } from "@/components/motion/TimelinePath";

/**
 * 01 — Background: the route so far, drawn. Each beat arrives in turn and the
 * thread between them is traced as you scroll.
 */
export function Background() {
  const { timeline, about, sections } = content;

  return (
    <Section id="background" index="01" label="Background">
      <div className="mt-10 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <MaskText
            as="h3"
            text={sections.background.heading}
            className="type-display block max-w-[14ch] text-headline font-medium"
          />
          <p data-reveal className="mt-5 max-w-[38ch] text-base text-slate">
            {sections.background.lede}
          </p>
          <div
            data-reveal
            className="mt-8 space-y-1 font-mono text-label text-slate"
          >
            <p>{about.location}</p>
            <p>{about.languages}</p>
            <p className="pt-3 text-ink">{about.education}</p>
          </div>
        </div>

        <div data-timeline className="relative">
          <TimelinePath count={timeline.length} />
          <ol className="max-w-[62ch] sm:pl-[18%]">
            {timeline.map((beat) => (
              <li
                key={beat.year}
                data-timeline-node
                data-reveal
                className="py-8 first:pt-0"
              >
                <Label className="text-signal">{beat.year}</Label>
                <h3 className="type-display mt-2 text-title leading-tight font-semibold">
                  {beat.title}
                </h3>
                <p className="mt-2 text-base text-slate">{beat.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
