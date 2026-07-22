import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { Label } from "@/components/primitives/Label";

/**
 * 03 — Experience (v3 brief §3.03): Rezervitoo and Faderco as editorial
 * features — outcomes-first prose, the one metric pulled out as a quote,
 * honest code-access labels.
 */
export function Experience() {
  const { experience } = content;

  return (
    <Section id="experience" index="03" label="Experience">
      <div className="mt-14 space-y-24">
        {experience.map((entry) => (
          <article key={entry.company}>
            <div
              data-reveal
              className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2"
            >
              <h3 className="type-serif text-headline font-medium">
                {entry.company}
              </h3>
              <Label>
                {entry.role} · {entry.engagement} · {entry.period}
              </Label>
            </div>

            <div className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div className="max-w-[62ch] space-y-5">
                {entry.story.map((line) => (
                  <p key={line} data-reveal className="text-base">
                    {line}
                  </p>
                ))}
              </div>

              <aside data-reveal className="lg:pl-10">
                <blockquote className="hairline pt-5">
                  <p className="type-serif text-headline font-medium">
                    {entry.pull.value}
                  </p>
                  <footer className="mt-2">
                    <Label>{entry.pull.label}</Label>
                  </footer>
                </blockquote>
                <dl className="mt-8 space-y-2">
                  {entry.readouts.map((readout) => (
                    <div key={readout.label} className="flex gap-4">
                      <dt className="w-24 shrink-0 font-mono text-fine text-slate">
                        {readout.label}
                      </dt>
                      <dd className="font-mono text-fine text-ink">
                        {readout.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-8">
                  <Label>{entry.access}</Label>
                </p>
              </aside>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
