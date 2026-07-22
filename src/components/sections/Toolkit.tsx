import { content } from "@/content";
import { Section } from "@/components/primitives/Section";

/**
 * 05 — Toolkit (v3 brief §3.05): the stack as grouped plain lists. No bars,
 * no percentages, no dots — editorial columns only.
 */
export function Toolkit() {
  const { inventory } = content.skills;

  return (
    <Section id="toolkit" index="05" label="Toolkit">
      <div className="mt-14 columns-2 gap-x-14 md:columns-3 lg:columns-4">
        {inventory.map((group) => (
          <div
            key={group.group}
            data-reveal
            className="mb-10 break-inside-avoid"
          >
            <h3 className="font-mono text-label text-slate">
              {group.group.toLowerCase()}
            </h3>
            <ul className="mt-3 space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
