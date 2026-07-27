import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { WorkGallery } from "@/components/work/WorkGallery";
import { ArchitectureBlock } from "@/components/work/ArchitectureBlock";

const KIND_LABEL: Record<string, string> = {
  flagship: "flagship build",
  client: "client work",
  apprenticeship: "apprenticeship",
  product: "personal product",
};

/** Every project is known at build time, so every page is static. */
export function generateStaticParams() {
  return content.work.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = content.work.find((w) => w.slug === slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: `${item.title} · Lioua Zeddam`,
      description: item.summary,
      images: item.cover ? [item.cover.src] : undefined,
    },
  };
}

/**
 * A project's own page: the claim up top, the numbers and decisions beside it,
 * then the captures walked through one at a time. Deliberately a route rather
 * than an overlay — it has a URL a recruiter can send on, and it is indexable.
 */
export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = content.work.find((w) => w.slug === slug);
  if (!item) notFound();

  const index = content.work.findIndex((w) => w.slug === slug);
  const next = content.work[(index + 1) % content.work.length];
  const stack = item.stack.split(" · ");

  return (
    <main className="pb-[clamp(4rem,12vh,9rem)]">
      <div className="shell">
        <p className="hairline flex flex-wrap items-center gap-x-4 gap-y-1 pt-4">
          <Link
            href="/#work"
            className="transition-micro font-mono text-label text-slate uppercase transition-colors hover:text-ink"
          >
            ← All work
          </Link>
          <Label>{KIND_LABEL[item.kind] ?? item.kind}</Label>
          <Label>{item.period}</Label>
        </p>

        <header className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <h1 className="type-display max-w-[12ch] text-display leading-[0.95] font-semibold">
            {item.title}
          </h1>
          <p className="type-display max-w-[34ch] border-l-2 border-accent pl-5 text-lede leading-snug font-medium text-accent">
            {item.hook}
          </p>
        </header>

        <p className="mt-12 max-w-[54ch] text-lede text-slate">
          {item.summary}
        </p>

        {/* The spec strip: role, stack, the one number, and how open the code
            is — the questions a reader has before they look at pictures. */}
        <dl className="mt-14 grid gap-x-12 gap-y-8 border-t border-ink/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-mono text-fine tracking-[0.08em] text-slate uppercase">
              Role
            </dt>
            <dd className="mt-2 text-base text-ink">{item.context}</dd>
          </div>
          <div>
            <dt className="font-mono text-fine tracking-[0.08em] text-slate uppercase">
              Stack
            </dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-ink/12 px-2.5 py-0.5 font-mono text-fine text-slate"
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-fine tracking-[0.08em] text-slate uppercase">
              Result
            </dt>
            <dd className="mt-2">
              {item.metric ? (
                <>
                  <span className="type-display block text-title font-semibold text-accent">
                    {item.metric.value}
                  </span>
                  <span className="mt-1 block max-w-[24ch] font-mono text-fine text-slate">
                    {item.metric.label}
                  </span>
                </>
              ) : (
                <span className="text-base text-slate">Not measured</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-fine tracking-[0.08em] text-slate uppercase">
              Access
            </dt>
            <dd className="mt-2 text-base text-slate">{item.access}</dd>
            <dd className="mt-3 flex flex-col gap-1">
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
            </dd>
          </div>
        </dl>

        {/* The decisions worth defending. */}
        <ol className="mt-20">
          {item.highlights.map((line, i) => (
            <li
              key={line}
              className="grid gap-4 border-t border-ink/10 py-8 sm:grid-cols-[4rem_1fr] sm:gap-10"
            >
              <span
                aria-hidden="true"
                className="type-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-none font-extrabold text-accent/25"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="max-w-[56ch] text-base text-ink">{line}</p>
            </li>
          ))}
        </ol>

        {item.diagram ? (
          <section className="mt-24" aria-label="Architecture">
            <h2 className="hairline pt-4">
              <Label index="A">Architecture</Label>
            </h2>
            <ArchitectureBlock diagram={item.diagram} />
          </section>
        ) : null}

        {item.gallery.length > 0 ? (
          <section className="mt-24" aria-label="Screens">
            <h2 className="hairline pt-4">
              <Label index="B">Screens</Label>
            </h2>
            <p className="mt-4 max-w-[46ch] font-mono text-fine text-slate">
              Click any screen to open it in the zoom viewer. Wheel to zoom, drag
              to pan.
            </p>
            <WorkGallery shots={item.gallery} />
          </section>
        ) : (
          <section className="mt-24" aria-label="Screens">
            <h2 className="hairline pt-4">
              <Label index="B">Screens</Label>
            </h2>
            <p className="mt-4 max-w-[46ch] text-base text-slate">
              Captures for this one are still to come.
            </p>
          </section>
        )}

        <nav
          aria-label="More work"
          className="mt-24 border-t border-ink/10 pt-8"
        >
          <Label>Next project</Label>
          <Link
            href={`/work/${next?.slug ?? ""}`}
            className="type-display transition-micro mt-3 block text-headline leading-tight font-semibold transition-colors hover:text-accent"
          >
            {next?.title} →
          </Link>
        </nav>
      </div>
    </main>
  );
}
