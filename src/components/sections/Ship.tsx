import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { MaskText } from "@/components/motion/MaskText";

/**
 * 04 — Delivery: the conversion beat between the work and the toolkit.
 *
 * A sticky heading on the left, the four practices stacked as ruled entries on
 * the right — a different rhythm from Philosophy's three-column grid above, so
 * the two persuasion sections don't read as the same block twice. Motion is the
 * site's own: `MaskText` on the titles and `data-reveal` on the bodies, so the
 * section rises into place on the same cascade as everything else.
 */
export function Ship() {
  const { delivery } = content;

  return (
    <Section id="ship" index="04" label="Delivery">
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <MaskText
            as="h3"
            text={delivery.heading}
            className="type-display block max-w-[12ch] text-display leading-[0.95] font-semibold"
          />
          <p
            data-reveal
            className="mt-6 max-w-[40ch] border-l-2 border-accent pl-5 text-lede text-slate"
          >
            {delivery.lede}
          </p>
        </div>

        <ol>
          {delivery.practices.map((practice, index) => (
            <li
              key={practice.title}
              className="grid gap-x-8 gap-y-3 border-t border-ink/12 py-9 first:border-t-0 first:pt-0 sm:grid-cols-[3.5rem_1fr]"
            >
              <span
                aria-hidden="true"
                className="type-display text-title leading-none font-semibold text-accent/40 tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="max-w-[52ch]">
                <MaskText
                  as="h4"
                  text={practice.title}
                  className="type-display block text-title leading-tight font-medium"
                />
                <p data-reveal className="mt-3 text-base text-slate">
                  {practice.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
