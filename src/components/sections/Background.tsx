import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { MaskText } from "@/components/motion/MaskText";
import { TimelinePath } from "@/components/motion/TimelinePath";

/**
 * 01 — Background: the route so far, as a set of cards threaded by a line that
 * draws itself as you scroll, a dot lighting at each beat. The cards alternate
 * a small indent so the thread has to weave between them.
 */
export function Background() {
  const { timeline, about, sections } = content;

  return (
    <Section id="background" index="01" label="Background">
      <div className="mt-8">
        {/* The heading is not width-constrained — a narrow wrapper was forcing
            the display-size words onto one line each. */}
        <MaskText
          as="h3"
          text={sections.background.heading}
          className="type-display block text-display leading-[0.95] font-semibold"
        />
        <p data-reveal className="mt-4 max-w-[42ch] text-base text-slate">
          {sections.background.lede}
        </p>
        <div
          data-reveal
          className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-mono text-fine text-slate"
        >
          <span>{about.location}</span>
          <span>{about.languages}</span>
        </div>
      </div>

      {/* The thread weaves down a wide lane on the left; the cards sit to its
          right, each with a dot where the line reaches it. The lane is wide
          enough for the line to swing without crossing under the cards. */}
      <div data-timeline className="relative mt-16 pl-12 sm:pl-[9rem]">
        <TimelinePath count={timeline.length} />
        <ol className="space-y-10 sm:space-y-16">
          {timeline.map((beat, index) => (
            <li
              key={beat.year}
              data-timeline-node
              data-reveal
              className={index % 2 === 1 ? "sm:ml-[6%] lg:ml-[10%]" : undefined}
            >
              <article className="max-w-[44ch] rounded-md border border-ink/10 bg-surface/60 p-6 sm:p-7">
                <span className="type-display block text-[clamp(1.75rem,4vw,2.75rem)] leading-none font-extrabold whitespace-nowrap text-accent">
                  {beat.year}
                </span>
                <h4 className="type-display mt-3 text-title leading-tight font-semibold">
                  {beat.title}
                </h4>
                <p className="mt-3 text-base text-slate">{beat.text}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
