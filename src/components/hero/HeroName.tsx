import type { CSSProperties } from "react";
import { content } from "@/content";

/**
 * The wordmark, painted from its own fixed layer beneath the portrait.
 *
 * It cannot live inside the hero section: ScrollTrigger pins that section by
 * setting `position: fixed` on it, which creates a stacking context and traps
 * everything inside it below the portrait's layer. Lifting the name out is
 * what lets the portrait sit BETWEEN the name (behind, occluded by the head
 * and shoulders) and the rest of the hero (in front, legible).
 *
 * The hero reserves exactly `--name-size × --name-leading` of height in flow,
 * so the layout is identical to the name being in the document.
 */
export function HeroName() {
  const { intro } = content;
  const firstName = intro.name.split(" ")[0] ?? intro.name;

  return (
    <div
      data-hero="title"
      // On phones the wordmark sits lower so the portrait's head and shoulders
      // cross it — the occlusion that makes the layering read. On desktop it
      // stays near the top, where the pinned composition wants it.
      className="pointer-events-none absolute inset-x-0 top-[8vh] z-[5] px-[var(--pad)] sm:top-[4vh] lg:fixed"
    >
      {/* justify-between is what makes it truly full-bleed: the letters are
          distributed edge to edge whatever the font size resolves to, so the
          wordmark always spans the measure instead of leaving a ragged gap.
          The negative margins cancel the first and last glyphs' side bearings
          so the ink — not the letter box — meets the gutter; width stays auto
          so the negative margins widen the row rather than shifting it. */}
      <h1
        aria-label={intro.name}
        className="type-display -ml-[var(--name-bearing-left)] -mr-[var(--name-bearing-right)] flex justify-between text-name leading-[0.78] font-extrabold text-accent uppercase"
      >
        {firstName.split("").map((letter, index) => (
          <span
            key={`${letter}-${String(index)}`}
            aria-hidden="true"
            data-title-letter
            style={{ "--i": index } as CSSProperties}
            className="inline-block will-change-transform"
          >
            {letter}
          </span>
        ))}
      </h1>
    </div>
  );
}
