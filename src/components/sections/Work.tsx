import Image from "next/image";
import Link from "next/link";
import type { Work as WorkItem } from "@/content/schemas";
import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { MaskText } from "@/components/motion/MaskText";
import { WorkRail } from "@/components/motion/WorkRail";

const KIND_LABEL: Record<WorkItem["kind"], string> = {
  flagship: "flagship build",
  client: "client work",
  apprenticeship: "apprenticeship",
  product: "personal product",
};

/**
 * One card on the rail: numbered, tagged, and led by the spoken hook. Only the
 * card at the centre of the track is at full strength — the rest sit back, so
 * the eye always knows which one it is reading.
 */
function Card({ item, index }: { item: WorkItem; index: number }) {
  const tags = item.stack.split(" · ").slice(0, 3);

  return (
    <article
      data-work-card
      data-index={index}
      data-active={index === 0 ? "true" : "false"}
      className="work-card transition-micro relative flex w-[min(88vw,34rem)] shrink-0 flex-col opacity-40 transition-opacity duration-500 data-[active=true]:opacity-100"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="type-display text-title leading-none font-semibold text-accent tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex flex-wrap justify-end gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-ink/12 px-2.5 py-0.5 font-mono text-fine text-slate"
            >
              {tag}
            </span>
          ))}
        </span>
      </div>

      {/* The capture, when there is one. Phone screens are contained rather
          than cropped — cover would show a sliver of a 1080×2400 screen. The
          initial stays as the fallback so a project without shots is still a
          designed box, never a bare one. */}
      <div className="group relative mt-3 aspect-[16/10] max-h-[34vh] overflow-hidden rounded-xs bg-surface">
        {item.cover ? (
          <Image
            src={item.cover.src}
            alt={item.cover.alt}
            fill
            sizes="(max-width: 1023px) 88vw, 34rem"
            quality={90}
            className={`transition-transform duration-500 group-hover:scale-[1.04] ${
              item.cover.fit === "contain" ? "object-contain" : "object-cover"
            } object-top`}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full items-center justify-center transition-transform duration-500 group-hover:scale-[1.04]"
          >
            <span className="type-display text-display font-semibold text-accent/20">
              {item.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <p className="mt-3 flex items-center gap-3 font-mono text-fine tracking-wide text-slate uppercase">
        <span className="text-accent">{KIND_LABEL[item.kind]}</span>
        <span aria-hidden="true" className="text-ink/20">
          /
        </span>
        <span>{item.period}</span>
      </p>

      <h3 className="type-display mt-1.5 text-title leading-tight font-semibold">
        {/* The whole card reads as one target: the link stretches over it so
            the image and the hook are clickable too, without nesting the
            card's own links inside an anchor. */}
        <Link href={`/work/${item.slug}`} className="work-card-link">
          {item.title}
        </Link>
      </h3>

      {/* The hook carries the card — the line said out loud. The longer
          summary is deliberately left off here: on a pinned rail the card has
          to fit the screen, and the hook is the part that lands. */}
      <p className="type-display mt-2 max-w-[30ch] text-lede leading-snug font-medium text-accent">
        {item.hook}
      </p>

      {item.metric ? (
        <p className="mt-3 flex items-baseline gap-3">
          <span className="type-display text-title font-semibold whitespace-nowrap">
            {item.metric.value}
          </span>
          <span className="max-w-[26ch] font-mono text-fine text-slate">
            {item.metric.label}
          </span>
        </p>
      ) : null}

      <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
        <Label>{item.access}</Label>
        {item.links.live ? (
          <a
            href={item.links.live}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            visit live site →
          </a>
        ) : null}
        {item.links.source ? (
          <a
            href={item.links.source}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            read the source →
          </a>
        ) : null}
      </p>
    </article>
  );
}

/**
 * 03 — Work: client engagements and personal products as one body of work,
 * on a horizontal rail. The section pins and the track travels right to left
 * under the scroll, brightening each card as it reaches the middle, then
 * releases once the last one has passed. On narrow screens it is a normal
 * swipeable row. `WorkRail` drives the travel.
 */
export function Work() {
  const { work, sections } = content;

  return (
    <section
      id="work"
      aria-label="Work"
      data-work
      className="relative z-10 overflow-hidden bg-paper lg:flex lg:h-svh lg:flex-col lg:justify-center"
    >
      <div className="shell lg:pl-60">
        <h2 className="hairline pt-4">
          <Label index="03">Work</Label>
        </h2>
        <div className="mt-5 grid gap-x-16 gap-y-3 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-end">
          <MaskText
            as="p"
            text={sections.work.heading}
            className="type-display block max-w-[14ch] text-headline leading-[0.95] font-semibold"
          />
          <p data-reveal className="max-w-[42ch] text-base text-slate">
            {sections.work.lede}
          </p>
        </div>
      </div>

      {/* The viewport clips the rail; the track is wider than the screen and
          starts clear of the fixed nav (left-6 + w-60) so cards clip at that
          edge instead of sliding underneath it. */}
      <div data-rail-viewport className="mt-8 overflow-hidden lg:ml-[18.5rem]">
        <div
          data-rail-track
          className="flex w-max gap-8 px-[clamp(1.25rem,4.5vw,3.5rem)] lg:gap-12"
        >
          {work.map((item, index) => (
            <Card key={item.slug} item={item} index={index} />
          ))}
        </div>
      </div>

      <WorkRail />
    </section>
  );
}
