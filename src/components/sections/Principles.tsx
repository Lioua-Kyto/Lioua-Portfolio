import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { MaskText } from "@/components/motion/MaskText";

/**
 * 02 — Philosophy: three opinions, each one cashed out on a real project.
 *
 * Laid out as full-width ruled entries rather than a three-column grid: the
 * claim gets display size, the reasoning sits beside it, and an "in practice"
 * line underneath makes each belief answer for itself. The wide measure and the
 * per-entry rhythm are what give the section the height its content deserves —
 * a short three-up grid read like filler.
 */
export function Principles() {
  const { principles, sections } = content;

  return (
    <Section id="principles" index="02" label="Philosophy">
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
        <MaskText
          as="h3"
          text={sections.principles.heading}
          className="type-display block max-w-[13ch] text-display leading-[0.95] font-semibold"
        />
        {/* The lede is set against an accent rule so the section opens with a
            stated position rather than a caption. */}
        <p
          data-reveal
          className="max-w-[46ch] border-l-2 border-accent pl-5 text-lede text-slate"
        >
          {sections.principles.lede}
        </p>
      </div>

      <ol className="mt-20">
        {principles.map((principle, index) => (
          <li
            key={principle.title}
            className="hairline grid gap-6 py-14 sm:py-16 lg:grid-cols-[6rem_1.05fr_1fr] lg:gap-12"
          >
            <span
              aria-hidden="true"
              className="type-display text-[clamp(2.5rem,5vw,4rem)] leading-none font-extrabold text-accent/25"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <MaskText
              as="h4"
              text={principle.title}
              className="type-display block max-w-[16ch] text-headline leading-[1.05] font-medium"
            />

            <div className="max-w-[46ch]">
              <p data-reveal className="text-base text-slate">
                {principle.body}
              </p>
              {/* The receipt: the belief, cashed out on something that shipped. */}
              <p
                data-reveal
                className="mt-6 border-t border-ink/10 pt-4 text-base text-ink"
              >
                <span className="mr-2 font-mono text-fine tracking-[0.08em] text-accent uppercase">
                  In practice
                </span>
                {principle.practice}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
