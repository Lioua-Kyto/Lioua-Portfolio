import { content } from "@/content";
import { Label } from "@/components/primitives/Label";

/** One-line editorial footer — colophon voice, no link farm. */
export function SiteFooter() {
  return (
    <footer className="shell flex flex-wrap items-baseline justify-between gap-4 pt-6 pb-10 lg:pl-60">
      <Label>
        © {new Date().getFullYear()} {content.intro.name}
      </Label>
      <Label>{content.about.location.toLowerCase()}</Label>
    </footer>
  );
}
