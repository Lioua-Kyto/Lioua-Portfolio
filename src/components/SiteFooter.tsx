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
export function SiteFooter() {
  return (
    <footer className="lg:pl-60">
      <div className="shell flex flex-wrap items-baseline justify-between gap-4 pt-6 pb-10">
        <Label>
          © {new Date().getFullYear()} {content.intro.name}
        </Label>
        <Label>{content.about.location.toLowerCase()}</Label>
      </div>

      <div className="px-[var(--pad)] pb-[clamp(1rem,3vh,2.5rem)]">
        <FooterMark text={content.intro.name} />
      </div>
    </footer>
  );
}
