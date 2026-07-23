import type { ReactNode } from "react";
import { Label } from "./Label";

/**
 * Editorial section shell: semantic `<section>`, generous vertical rhythm,
 * the shared content column, and the numbered mono label row (v3 brief §3).
 * Sections compose their own internal spreads.
 */
export function Section({
  id,
  index,
  label,
  children,
}: {
  id: string;
  /** Section number for the label row, e.g. `01`. */
  index: string;
  /** Terse label text, e.g. `Background`. */
  label: string;
  children: ReactNode;
}) {
  return (
    // lg:pl-60 clears the fixed side rail, which only appears past the hero.
    <section
      id={id}
      aria-label={label}
      className="py-[clamp(6rem,14vh,10rem)] lg:pl-60"
    >
      <div className="shell">
        {/* The mono label doubles as the section's h2 so the document reads
            h1 → h2 → h3 with no skipped levels. */}
        <h2 className="hairline pt-4">
          <Label index={index}>{label}</Label>
        </h2>
        {children}
      </div>
    </section>
  );
}
