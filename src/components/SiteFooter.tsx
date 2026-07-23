import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { MotionToggle } from "@/components/motion/MotionToggle";

/** One-line editorial footer — colophon voice, no link farm. */
export function SiteFooter() {
  return (
    <footer className="shell flex flex-wrap items-baseline justify-between gap-4 pt-6 pb-10 lg:pl-60">
      <Label>
        © {new Date().getFullYear()} {content.intro.name}
      </Label>
      <span className="flex items-baseline gap-6">
        <Label>{content.about.location.toLowerCase()}</Label>
        <MotionToggle />
      </span>
    </footer>
  );
}
