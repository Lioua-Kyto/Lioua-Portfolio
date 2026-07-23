import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { MaskText } from "@/components/motion/MaskText";

/**
 * 05 — Toolkit: the stack as a set of discipline cards (breedlove pattern) —
 * each numbered `T.0N` with an honest item count, a serif title, and the
 * tools as tags. Still no bars, percentages, or proficiency dots: a tag is
 * either in the list or it isn't.
 */
export function Toolkit() {
  const { inventory } = content.skills;
  const { sections } = content;

  return (
    <Section id="toolkit" index="05" label="Toolkit">
      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <MaskText
          as="h3"
          text={sections.toolkit.heading}
          className="type-serif block max-w-[16ch] text-headline font-medium"
        />
        <p data-reveal className="max-w-[38ch] font-mono text-label text-slate">
          {sections.toolkit.lede}
        </p>
      </div>

      <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {inventory.map((group, index) => (
          <li
            key={group.group}
            data-reveal
            className="transition-micro rounded-xs border border-ink/12 bg-surface/60 p-6 transition-colors hover:border-accent-deep/40"
          >
            <div className="flex items-baseline justify-between font-mono text-fine text-slate">
              <span className="text-signal">
                T.{String(index + 1).padStart(2, "0")}
              </span>
              <span>
                {group.items.length}{" "}
                {group.items.length === 1 ? "tool" : "tools"}
              </span>
            </div>

            <h4 className="type-serif mt-4 text-title font-medium">
              {group.group}
            </h4>

            <ul className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-xs border border-ink/10 bg-paper px-2.5 py-1 font-mono text-fine text-slate"
                >
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
