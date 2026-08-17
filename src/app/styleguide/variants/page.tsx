import type { Metadata } from "next";
import Image from "next/image";
import { Label } from "@/components/primitives/Label";

export const metadata: Metadata = {
  title: "Wide-capture variants",
  robots: { index: false, follow: false },
};

/**
 * Three candidate treatments for the 16:9 desktop captures, on the same three
 * shots so they can be judged against each other rather than described.
 *
 * Not linked from the site and noindexed. Delete this route once a variant is
 * locked in — a comparison surface that outlives the decision becomes a second
 * design system nobody is maintaining.
 */

const SHOTS = [
  {
    src: "/work/Rezervitoo/dashboard.webp",
    alt: "Rezervitoo's provider dashboard showing bookings, listings and revenue.",
    title: "One dashboard, four kinds of provider",
    body: "Hotels, hostels, agencies and hosts wanted four schemas. They share one polymorphic model instead, so a new provider type is configuration rather than a migration.",
  },
  {
    src: "/work/Rezervitoo/swagger-api.webp",
    alt: "The Rezervitoo API browsable in Swagger, showing documented booking endpoints.",
    title: "Every endpoint documented, not just written",
    body: "The whole surface is browsable and typed. A front-end developer joining the project reads the contract instead of asking what a field means.",
  },
  {
    src: "/work/Rezervitoo/reports.webp",
    alt: "Rezervitoo's reporting view with revenue and occupancy over time.",
    title: "Numbers a provider can act on",
    body: "Occupancy and revenue are aggregated server-side and cached, so the reporting view opens in the time it takes to paint rather than the time it takes to count.",
  },
] as const;

const URL_LABEL = "rezervitoo.com";

function Chrome({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="wc-chrome">
      <div className="wc-chrome-bar">
        <span className="truncate">{URL_LABEL}</span>
      </div>
      <span className="wc-chrome-media">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 92vw, 84rem"
          quality={90}
          priority={priority}
          className="object-cover object-top"
        />
      </span>
    </div>
  );
}

export default function VariantsPage() {
  return (
    <main className="py-24">
      <div className="shell">
        <Label index="00">Wide-capture variants</Label>
        <h1 className="type-display mt-4 max-w-[20ch] text-headline leading-[1.02] font-semibold">
          Three ways to show a 16:9 capture
        </h1>
        <p className="mt-5 max-w-[58ch] text-lede text-slate">
          The same three shots, three times. Pick one and the other two get
          deleted along with this page.
        </p>
      </div>

      {/* ---- A ---- */}
      <section className="mt-[clamp(4rem,10vh,7rem)]">
        <div className="shell">
          <h2 className="hairline pt-4">
            <Label index="A">Plate</Label>
          </h2>
          <p className="mt-3 max-w-[62ch] text-base text-slate">
            Full-column capture under a two-column header. The image is the
            widest thing on the page and the claim reads as a standfirst above
            it. Quietest of the three, and the closest to the existing pages.
          </p>

          <div className="mt-12 flex flex-col gap-[clamp(4rem,9vh,6rem)]">
            {SHOTS.map((shot, i) => (
              <article key={shot.src}>
                <div className="wc-plate-head">
                  <h3 className="type-display text-title leading-tight font-semibold text-balance">
                    {shot.title}
                  </h3>
                  <p className="text-base text-slate text-pretty">
                    {shot.body}
                  </p>
                </div>
                <Chrome src={shot.src} alt={shot.alt} priority={i === 0} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- B ---- */}
      <section className="mt-[clamp(6rem,14vh,10rem)]">
        <div className="shell">
          <h2 className="hairline pt-4">
            <Label index="B">Band</Label>
          </h2>
          <p className="mt-3 max-w-[62ch] text-base text-slate">
            The capture breaks the column and runs the full viewport, with the
            claim underneath in an offset column. Loudest of the three, and the
            only one that uses the whole screen.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-[clamp(5rem,12vh,8rem)]">
          {SHOTS.map((shot) => (
            <article key={shot.src} className="wc-band">
              {/* No chrome here on purpose: a browser window that spans the
                  whole viewport is a contradiction, and at this width the
                  bleed is the statement. */}
              <span className="wc-chrome-media">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="100vw"
                  quality={90}
                  className="object-cover object-top"
                />
              </span>
              <div className="wc-band-text">
                <div className="wc-band-inner">
                  <h3 className="type-display text-title leading-tight font-semibold text-balance">
                    {shot.title}
                  </h3>
                  <p className="max-w-[54ch] text-base text-slate text-pretty">
                    {shot.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---- C ---- */}
      <section className="mt-[clamp(6rem,14vh,10rem)]">
        <div className="shell">
          <h2 className="hairline pt-4">
            <Label index="C">Margin note</Label>
          </h2>
          <p className="mt-3 max-w-[62ch] text-base text-slate">
            The capture keeps two thirds and the argument runs as a slim column
            in the margin, alternating sides. Reads like the printed page the
            rest of the site is set as, and alternates without becoming another
            fifty-fifty zigzag.
          </p>

          <div className="mt-12 flex flex-col gap-[clamp(4rem,10vh,7rem)]">
            {SHOTS.map((shot, i) => (
              <article
                key={shot.src}
                className={`wc-note ${i % 2 === 1 ? "wc-note--flip" : ""}`}
              >
                <div className="wc-note-media">
                  <Chrome src={shot.src} alt={shot.alt} />
                </div>
                <div className="wc-note-text">
                  <h3 className="type-display text-title leading-tight font-semibold text-balance">
                    {shot.title}
                  </h3>
                  <p className="mt-3 text-base text-slate text-pretty">
                    {shot.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
