import type { Project } from "@/content/schemas";
import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { MaskText } from "@/components/motion/MaskText";
import { ProjectsRail } from "@/components/motion/ProjectsRail";

/**
 * Designed screenshot placeholder (v3 brief §5/§6): a framed, labeled plate
 * until real captures land — never a bare rectangle.
 */
function Plate({ project, figure }: { project: Project; figure: string }) {
  return (
    <figure>
      <div className="group aspect-[16/10] overflow-hidden rounded-xs bg-surface">
        <div
          className="transition-micro flex h-full items-center justify-center transition-transform duration-500 group-hover:scale-[1.05]"
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

function ProjectCard({
  project,
  figure,
}: {
  project: Project;
  figure: string;
}) {
  return (
    <article
      data-project-card
      className="w-[min(84vw,40rem)] shrink-0 lg:w-[min(52vw,44rem)]"
    >
      <Plate project={project} figure={figure} />
      <h3 className="type-serif mt-7 text-title font-medium">
        {project.title}
      </h3>
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
      <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {project.links.live ? (
          <a
            href={project.links.live}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            visit live site
          </a>
        ) : null}
        {project.links.source ? (
          <a
            href={project.links.source}
            className="transition-micro font-mono text-label text-signal underline underline-offset-4 transition-colors hover:text-ink"
          >
            read the source
          </a>
        ) : null}
      </p>
    </article>
  );
}

/**
 * 04 — Products (v3 brief §3.04): the plates, on a horizontal rail. The
 * section pins and the track travels right-to-left under the scroll, then
 * releases once the last project has passed. Markup only — `ProjectsRail`
 * drives the travel and measures the distance.
 */
export function Products() {
  return (
    <section
      id="products"
      aria-label="Products"
      data-projects
      className="py-[clamp(6rem,14vh,10rem)]"
    >
      <div className="shell lg:pl-60">
        <h2 className="hairline pt-4">
          <Label index="04">Products</Label>
        </h2>
        <MaskText
          as="p"
          text="Things I built end to end."
          className="type-serif mt-10 block max-w-[18ch] text-headline font-medium"
        />
      </div>

      {/* The viewport clips the rail; the track is wider than the screen. */}
      <div data-rail-viewport className="mt-14 overflow-hidden">
        <div
          data-rail-track
          className="flex w-max gap-10 px-[clamp(1.25rem,4.5vw,3.5rem)] lg:gap-16 lg:pl-60"
        >
          {content.projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              figure={`fig. 0${String(index + 2)}`}
            />
          ))}
        </div>
      </div>

      <ProjectsRail />
    </section>
  );
}
