import type { Project } from "@/content/schemas";
import { content } from "@/content";
import { Section } from "@/components/primitives/Section";
import { Label } from "@/components/primitives/Label";

/**
 * Designed screenshot placeholder (v3 brief §5/§6): a framed, labeled plate
 * until real captures land — never a bare rectangle. The inner element gets
 * the zoom-within-frame hover in Phase 3.
 */
function Plate({ project, figure }: { project: Project; figure: string }) {
  return (
    <figure data-reveal="plate">
      <div className="group overflow-hidden rounded-xs bg-surface">
        <div
          data-plate-inner
          className="transition-micro flex aspect-[16/10] items-center justify-center transition-transform group-hover:scale-[1.04]"
          aria-hidden="true"
        >
          <span className="type-serif text-display font-medium text-slate/35">
            {project.title.charAt(0)}
          </span>
        </div>
      </div>
      <figcaption className="mt-2 flex justify-between gap-6 font-mono text-fine text-slate">
        <span>{project.title.toLowerCase()} — capture pending</span>
        <span>{figure}</span>
      </figcaption>
    </figure>
  );
}

function ProjectInfo({ project }: { project: Project }) {
  return (
    <div data-reveal>
      <h3 className="type-serif text-title font-medium">{project.title}</h3>
      <p className="mt-3 max-w-[48ch] text-base text-slate">
        {project.summary}
      </p>
      <p className="mt-5">
        <Label>{project.stack}</Label>
      </p>
      <p className="mt-2">
        <Label>
          {project.roleLine} · {project.repoLabel}
        </Label>
      </p>
      {project.links.live ? (
        <p className="mt-4">
          <a
            href={project.links.live}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            visit live site
          </a>
        </p>
      ) : null}
      {project.links.source ? (
        <p className="mt-2">
          <a
            href={project.links.source}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            read the source
          </a>
        </p>
      ) : null}
    </div>
  );
}

/**
 * 04 — Products (v3 brief §3.04): the plates. BrewPhoria leads (the public,
 * confident one); asymmetric editorial spreads, never centered cards.
 */
export function Products() {
  const [lead, ...rest] = content.projects;

  return (
    <Section id="products" index="04" label="Products">
      <div className="mt-14 space-y-24">
        {lead ? (
          <div className="grid items-end gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <Plate project={lead} figure="fig. 02" />
            <ProjectInfo project={lead} />
          </div>
        ) : null}

        <div className="grid gap-x-16 gap-y-20 md:grid-cols-2">
          {rest.map((project, index) => (
            <div
              key={project.slug}
              className={index % 2 === 1 ? "md:mt-24" : undefined}
            >
              <Plate project={project} figure={`fig. 0${String(index + 3)}`} />
              <div className="mt-8">
                <ProjectInfo project={project} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
