import type { Work as WorkItem } from "@/content/schemas";
import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { MaskText } from "@/components/motion/MaskText";
import { WorkReveal } from "@/components/motion/WorkReveal";

const KIND_LABEL: Record<WorkItem["kind"], string> = {
  client: "client work",
  apprenticeship: "apprenticeship",
  product: "personal product",
};

/** One work card — the hook leads, the detail earns it. */
function Card({ item, index }: { item: WorkItem; index: number }) {
  return (
    <article
      data-work-card
      data-index={index}
      className="inset-0 flex flex-col justify-center lg:absolute"
    >
      <p className="flex items-center gap-3 font-mono text-fine tracking-wide text-slate uppercase">
        <span className="text-accent-deep">{KIND_LABEL[item.kind]}</span>
        <span aria-hidden="true" className="text-ink/20">
          /
        </span>
        <span>{item.period}</span>
      </p>

      <h3 className="type-display mt-4 text-headline leading-[1.05] font-semibold">
        {item.title}
      </h3>

      {/* The hook is the star — set it big, like a spoken line. */}
      <p className="type-display mt-4 max-w-[24ch] text-title leading-tight font-medium text-accent-deep">
        {item.hook}
      </p>

      <p className="mt-5 max-w-[54ch] text-base text-slate">{item.summary}</p>

      {item.metric ? (
        <p className="mt-6 flex items-baseline gap-3">
          <span className="type-display text-title font-semibold whitespace-nowrap text-ink">
            {item.metric.value}
          </span>
          <span className="max-w-[28ch] font-mono text-fine text-slate">
            {item.metric.label}
          </span>
        </p>
      ) : null}

      <ul className="mt-6 max-w-[54ch] space-y-2">
        {item.highlights.map((line) => (
          <li key={line} className="flex gap-3 text-base text-ink/85">
            <span
              aria-hidden="true"
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-deep"
            />
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Label>{item.stack}</Label>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Label>{item.access}</Label>
        {item.links.live ? (
          <a
            href={item.links.live}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            visit live site
          </a>
        ) : null}
        {item.links.source ? (
          <a
            href={item.links.source}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            read the source
          </a>
        ) : null}
      </div>
    </article>
  );
}

/**
 * 03 — Work: client engagements and personal products as one body of work.
 *
 * On wide screens the section pins and the right column shows one project at a
 * time — scrolling advances the stack while a sticky left column keeps the
 * heading and a running index in view. On narrow screens it degrades to a
 * plain stacked list. `WorkReveal` drives the pin and the card switching.
 */
export function Work() {
  const { work, sections } = content;

  return (
    <section
      id="work"
      aria-label="Work"
      data-work
      className="relative z-10 overflow-hidden bg-paper lg:flex lg:h-svh lg:items-center"
    >
      <div className="shell grid w-full gap-x-16 gap-y-10 py-20 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:py-0 lg:pl-60">
        {/* Left — the sticky context and running index. */}
        <div className="lg:self-center">
          <h2 className="hairline pt-4">
            <Label index="03">Work</Label>
          </h2>
          <MaskText
            as="p"
            text={sections.work.heading}
            className="type-display mt-6 block max-w-[14ch] text-display leading-[0.95] font-semibold"
          />
          <p data-reveal className="mt-5 max-w-[38ch] text-base text-slate">
            {sections.work.lede}
          </p>

          <ol className="mt-10 hidden space-y-1 lg:block">
            {work.map((item, index) => (
              <li key={item.slug}>
                <span
                  data-work-index={index}
                  data-active={index === 0 ? "true" : "false"}
                  className="transition-micro flex items-baseline gap-3 font-mono text-label text-slate/60 transition-colors data-[active=true]:text-ink"
                >
                  <span className="text-fine tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.title}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Right — one card at a time (stacked on mobile). */}
        <div
          data-work-stage
          className="relative space-y-16 lg:h-[74vh] lg:space-y-0 lg:self-center"
        >
          {work.map((item, index) => (
            <Card key={item.slug} item={item} index={index} />
          ))}
        </div>
      </div>

      <WorkReveal count={work.length} />
    </section>
  );
}
