import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { MaskText } from "@/components/motion/MaskText";

/**
 * 02 — How I build (v3 brief §3.02): a few genuine principles, not a
 * manifesto. Short serif claims, plain-body explanations.
 */
export function Principles() {
  const { principles, sections } = content;

  return (
    <Section id="principles" index="02" label="How I build">
      <div className="mt-10 max-w-[46ch]">
        <MaskText
          as="h3"
          text={sections.principles.heading}
          className="type-display block text-headline font-medium"
        />
        <p data-reveal className="mt-4 text-base text-slate">
          {sections.principles.lede}
        </p>
      </div>
      <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-3">
        {principles.map((principle) => (
          <div key={principle.title} className="max-w-[38ch]">
            <MaskText
              as="h4"
              text={principle.title}
              className="type-display block text-title font-medium"
            />
            <p data-reveal className="mt-4 text-base text-slate">
              {principle.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
