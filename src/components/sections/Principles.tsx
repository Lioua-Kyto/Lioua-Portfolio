import { content } from "@/content";
import { Section } from "@/components/primitives/Section";

/**
 * 02 — How I build (v3 brief §3.02): a few genuine principles, not a
 * manifesto. Short serif claims, plain-body explanations.
 */
export function Principles() {
  const { principles } = content;

  return (
    <Section id="principles" index="02" label="How I build">
      <div className="mt-14 grid gap-x-14 gap-y-12 md:grid-cols-3">
        {principles.map((principle) => (
          <div key={principle.title} data-reveal className="max-w-[38ch]">
            <h3 className="type-serif text-title font-medium">
              {principle.title}
            </h3>
            <p className="mt-4 text-base text-slate">{principle.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
