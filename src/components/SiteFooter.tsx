import Link from "next/link";
import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { FooterMark } from "@/components/FooterMark";

/**
 * One-line editorial footer — colophon voice, no link farm — closed by the
 * wordmark returning at full width as an outline. It is the page's last note:
 * the name arrives solid at the top and leaves as a drawn line at the bottom.
 * Each letter lights in accent under the cursor, so the mark answers back
 * without moving anything.
 */
export function SiteFooter({ inset = true }: { inset?: boolean }) {
  return (
    // The gutter clears the fixed side rail, which only exists on the home
    // page. A page without a rail must not reserve room for one — the column
    // reads pushed off-centre toward a sidebar that never arrives.
    <footer className={inset ? "lg:pl-60" : undefined}>
      {/* Above the mark, deliberately. The mark's glyphs are `inline-block` at
          a ~340px font size inside a 0.82 line-height, so their em boxes
          overflow well past the line and reach up into this row — which left
          the privacy link sitting under a decorative letter that swallowed
          every click. The row is content and the mark is ornament, so the row
          wins; the mark's cursor effect only loses the thin strip behind it. */}
      <div className="shell relative z-10 flex flex-wrap items-baseline justify-between gap-4 pt-6 pb-10">
        <Label>
          © {new Date().getFullYear()} {content.intro.name}
        </Label>
        {/* The one link the colophon has to carry: a privacy policy nobody can
            find is not a privacy policy. Styled as a label so it reads as part
            of the same line rather than as navigation reappearing at the end —
            but it is a plain anchor carrying its own classes, not a `Label`
            wrapped in a link. Nesting the span inside gave the anchor no text
            of its own to size a click target from. */}
        <span className="flex items-baseline gap-6">
          <Label>{content.about.location.toLowerCase()}</Label>
          <Link
            href="/privacy-policy"
            data-track="clicked_privacy"
            className="transition-micro font-mono text-label text-slate underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            privacy
          </Link>
        </span>
      </div>

      <div className="px-[var(--pad)] pb-[clamp(1rem,3vh,2.5rem)]">
        <FooterMark text={content.intro.name} />
      </div>
    </footer>
  );
}
