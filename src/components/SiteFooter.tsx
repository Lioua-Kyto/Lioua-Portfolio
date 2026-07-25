import { content } from "@/content";
import { Label } from "@/components/primitives/Label";

/**
 * One-line editorial footer — colophon voice, no link farm — closed by the
 * wordmark returning at full width as an outline. It is the page's last note:
 * the name arrives solid at the top and leaves as a drawn line at the bottom.
 * Each letter lights in accent under the cursor, so the mark answers back
 * without moving anything.
 */
export function SiteFooter() {
  const firstName =
    content.intro.name.split(" ")[0] ?? content.intro.name;

  return (
    <footer className="lg:pl-60">
      <div className="shell flex flex-wrap items-baseline justify-between gap-4 pt-6 pb-10">
        <Label>
          © {new Date().getFullYear()} {content.intro.name}
        </Label>
        <Label>{content.about.location.toLowerCase()}</Label>
      </div>

      <div
        aria-hidden="true"
        className="footer-mark select-none px-[var(--pad)] pb-[clamp(1rem,3vh,2.5rem)]"
      >
        <span className="type-display -ml-[var(--name-bearing-left)] -mr-[var(--name-bearing-right)] flex justify-between text-[clamp(4rem,17vw,15rem)] leading-[0.8] font-extrabold uppercase">
          {firstName.split("").map((letter, index) => (
            <span key={`${letter}-${String(index)}`} className="footer-mark-letter">
              {letter}
            </span>
          ))}
        </span>
      </div>
    </footer>
  );
}
