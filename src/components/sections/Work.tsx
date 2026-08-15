import Image from "next/image";
import type { Work as WorkItem } from "@/content/schemas";
import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { MaskText } from "@/components/motion/MaskText";
import { WorkRail } from "@/components/motion/WorkRail";
import { ProjectLink } from "@/components/work/ProjectLink";

/**
 * One card on the rail: numbered, tagged, and led by the spoken hook. Every
 * card reads at full strength — the covers' greyscale-to-colour hover is the
 * rail's only emphasis.
 */
function Card({ item, index }: { item: WorkItem; index: number }) {
  // Every card is one shape: a 16:9 frame with the type stacked under it. A
  // phone app's cover is a tall screenshot, and it is now contained inside that
  // same frame rather than given a 9:19 one of its own. A rail where one card
  // is a different shape reads as a layout that could not decide, and the odd
  // card pulls the eye for a reason that says nothing about the work. `fit`
  // chooses only how the image meets the frame, never the frame itself.
  const contained = item.cover?.fit === "contain";
  const tags = item.stack.split(" · ").slice(0, 3);

  const header = (
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
  );

  // The capture, in its native frame. Muted to greyscale so the rail reads as
  // one palette, resolving to full colour on hovering the thumbnail — the
  // thumbnail alone, not the card. The initial letter is the fallback so a
  // shot-less project is still a box.
  //
  // It is a link rather than a div for a hover reason, not a navigation one:
  // the title's stretched `::after` covers the whole card, so it paints over
  // the image and takes every pointer event landing there — a plain div could
  // never receive `:hover` at all. As an anchor the cover is lifted above that
  // overlay by the existing `.work-card a:not(.work-card-link)` rule, so it
  // hovers on its own and keeps the click the overlay was giving it.
  const cover = (
    <ProjectLink
      href={`/work/${item.slug}`}
      // Out of the tab order — the title link beside it is the card's one stop
      // — but not `aria-hidden`, which would take the capture's alt text with
      // it. A screen reader still gets "Rezervitoo dashboard, listings and
      // bookings"; it just does not get a second tab stop to reach it.
      tabIndex={-1}
      data-card-cover
      data-track="project_viewed"
      data-track-label={item.slug}
      className="group/cover relative mt-3 block aspect-[16/9] w-full overflow-hidden rounded-xs bg-surface"
    >
      {item.cover ? (
        <Image
          src={item.cover.src}
          alt={item.cover.alt}
          fill
          sizes="(max-width: 1023px) 88vw, 34rem"
          quality={90}
          // A tall phone capture is contained and centred — pillarboxed on the
          // card's own surface, which reads as the screen sitting on a plinth.
          // Cropping it to 16:9 instead would show a band of one screen.
          //
          // Plain `transition`, not `transition-[filter,transform]`: Tailwind
          // v4 compiles `scale-*` to the standalone CSS `scale` property, not
          // to `transform`, so naming `transform` transitioned nothing and the
          // zoom snapped. The default list covers filter and scale both.
          className={`grayscale transition duration-700 ease-out group-hover/cover:scale-[1.04] group-hover/cover:grayscale-0 ${
            contained
              ? "object-contain object-center"
              : "object-cover object-top"
          }`}
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full items-center justify-center transition duration-700 ease-out group-hover/cover:scale-[1.04]"
        >
          <span className="type-display text-display font-semibold text-accent/20">
            {item.title.charAt(0)}
          </span>
        </div>
      )}
    </ProjectLink>
  );

  const meta = (
    <>
      {/* Title and year on one line, held apart. The kind label ("flagship
          build", "personal product") is gone: it graded the work for the
          reader before they had looked at it, and a card that has to announce
          its own importance is doing the hook's job badly. The year is the one
          piece of filing a reader actually wants here. */}
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="type-display text-title leading-tight font-semibold">
          {/* The whole card reads as one target: the link stretches over it so
              the image and the hook are clickable too, without nesting the
              card's own links inside an anchor. */}
          <ProjectLink
            href={`/work/${item.slug}`}
            className="work-card-link"
            data-track="project_viewed"
            data-track-label={item.slug}
          >
            {item.title}
          </ProjectLink>
        </h3>
        <span className="shrink-0 font-mono text-fine tracking-wide text-slate tabular-nums">
          {item.period}
        </span>
      </div>

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

      {/* Only real destinations. The access line ("live site", "internal
          tool") described what the buttons already prove by existing or not:
          a project with a live link has one, a private client build has
          neither and says so on its own page. */}
      <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 empty:mt-0">
        {item.links.live ? (
          <a
            href={item.links.live}
            data-track="clicked_live_site"
            data-track-label={item.slug}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            visit live site →
          </a>
        ) : null}
        {item.links.source ? (
          <a
            href={item.links.source}
            data-track="clicked_github"
            data-track-label={item.slug}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            read the source →
          </a>
        ) : null}
      </p>
    </>
  );

  return (
    <article
      data-work-card
      data-index={index}
      className="work-card group relative flex w-[min(88vw,34rem)] shrink-0 flex-col"
    >
      {header}
      {cover}
      {meta}
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
      id="projects"
      aria-label="Work"
      data-work
      className="relative z-10 overflow-hidden bg-paper lg:flex lg:h-svh lg:flex-col lg:justify-center"
    >
      <div className="shell lg:pl-60">
        <h2 className="hairline pt-4">
          <Label index="03">Projects</Label>
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
          className="flex w-max items-start gap-8 px-[clamp(1.25rem,4.5vw,3.5rem)] lg:gap-12"
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
