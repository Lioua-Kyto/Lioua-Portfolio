import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import { Label } from "@/components/primitives/Label";
import { SiteFooter } from "@/components/SiteFooter";
import { ConsentWithdrawal } from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site measures, who processes it, and how to switch it off.",
  alternates: { canonical: "/privacy-policy" },
  // A policy page earns no search traffic and dilutes the queries that matter.
  robots: { index: false, follow: true },
};

/** The date the policy below was last materially changed. */
const UPDATED = "15 August 2026";

/**
 * The country alone. `about.location` is a composed strapline — "Algeria ·
 * working worldwide (UTC+1)" — which reads fine as a standalone label and badly
 * inside a sentence, and a policy naming its controller wants the jurisdiction,
 * not the availability.
 */
const COUNTRY =
  content.about.location.split(" · ")[0] ?? content.about.location;

/**
 * One clause: a numbered mono label, then the paragraph. The same instrument
 * the home page numbers its sections with — a policy laid out in the site's own
 * editorial furniture rather than in the grey legal boilerplate everyone has
 * learned to scroll past.
 */
function Clause({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="hairline grid gap-x-16 gap-y-3 pt-5 pb-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <h2>
        <Label index={index} className="uppercase tracking-[0.08em]">
          {title}
        </Label>
      </h2>
      <div className="max-w-[62ch] space-y-4 text-base text-slate">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <>
      {/* The same back row a project page opens with — a hairline, the route
          out on the left, the page's own marker on the right. No rail gutter
          anywhere on this page: the rail is the home hero's, and reserving
          15rem for it here pushed the whole column off centre. */}
      <main className="shell pt-4">
        <p className="hairline flex flex-wrap items-center gap-x-4 gap-y-1 pt-4">
          <Link
            href="/"
            className="transition-micro font-mono text-label text-slate uppercase transition-colors hover:text-ink"
          >
            ← Back to the site
          </Link>
          <Label className="ml-auto">Last updated {UPDATED}</Label>
        </p>

        <div className="pt-[clamp(4rem,12vh,7rem)]">
          <h1 className="type-display max-w-[16ch] text-headline leading-[0.95] font-semibold">
            What this site knows about you
          </h1>
          <p className="mt-5 max-w-[58ch] text-lede text-slate">
            Short version: it counts visits, and only if you let it. There is no
            account to make, nothing to buy, and no advertising anywhere on it.
          </p>

          <div className="mt-[clamp(3rem,8vh,5rem)]">
            <Clause index="01" title="Who runs this">
              <p>
                This site is a personal portfolio published by{" "}
                {content.intro.name}, a full stack developer based in {COUNTRY}.
                Any question about this policy, or about data held on you, goes
                to{" "}
                <a
                  href={`mailto:${content.contact.email}`}
                  className="transition-micro text-ink underline underline-offset-4 transition-colors hover:text-signal"
                >
                  {content.contact.email}
                </a>
                .
              </p>
            </Clause>

            <Clause index="02" title="What gets collected">
              <p>
                With your consent, two analytics services record anonymised
                information about the visit itself — never anything that
                identifies you by name:
              </p>
              <ul className="space-y-2">
                <li>
                  <span className="text-ink">Pages and navigation.</span> Which
                  pages were opened, in what order, and how long each was open.
                </li>
                <li>
                  <span className="text-ink">Session behaviour.</span> Scroll
                  depth, clicks, and heatmaps — aggregate maps of where readers
                  move on a page, used to judge whether the work is actually
                  being seen.
                </li>
                <li>
                  <span className="text-ink">Technical context.</span>{" "}
                  Approximate region, device type, browser, screen size, and the
                  referring site.
                </li>
              </ul>
              <p>
                IP addresses are anonymised before storage. Nothing you type
                into the contact form is sent to either service.
              </p>
            </Clause>

            <Clause index="03" title="Who processes it">
              <p>
                <span className="text-ink">Google Analytics 4</span> (Google
                Ireland Ltd) for page and traffic measurement, and{" "}
                <span className="text-ink">Microsoft Clarity</span> (Microsoft
                Corp) for session heatmaps. Both act as processors on this
                site&apos;s behalf, both may store data outside your country,
                and both are bound by their own published terms.
              </p>
              <p>
                Neither is used for advertising. Google Consent Mode is
                configured so that ad storage, ad user data, and ad
                personalisation are denied permanently — not merely until you
                accept, but on every request this site ever makes.
              </p>
              <p>
                One thing does run without asking:{" "}
                <span className="text-ink">Vercel Speed Insights</span>, which
                reports how quickly pages rendered for you. It sets no cookie,
                identifies nobody, and records timings rather than anything you
                did. It is here because a site that loads badly on your
                connection is worth knowing about, and measuring only the people
                who accepted would hide exactly the visits that went worst.
              </p>
            </Clause>

            <Clause index="04" title="Consent, and taking it back">
              <p>
                Analytics are off until you accept them. That is literal: with
                no answer stored, or with a declined one, the Google and
                Microsoft scripts are never requested at all, so there is
                nothing to send. Your answer is kept in your browser&apos;s
                local storage, not on a server, and it is the only thing this
                site stores without asking.
              </p>
              <p>
                You can change it whenever you like, here, and it takes effect
                on the next page load:
              </p>
              <ConsentWithdrawal />
            </Clause>

            <Clause index="05" title="Your rights">
              <p>
                You can ask what data is held on you, ask for it to be corrected
                or erased, object to it being processed, or ask for a copy of
                it. Write to the address in section 01 and you will get an
                answer within thirty days. If you are in the EU or UK and the
                answer does not satisfy you, you can complain to your national
                data protection authority.
              </p>
            </Clause>

            <Clause index="06" title="Changes">
              <p>
                If this policy changes materially, the date at the top changes
                with it and the consent banner is raised again so the choice is
                made against the current terms rather than the old ones.
              </p>
            </Clause>
          </div>

          <p className="py-[clamp(3rem,8vh,5rem)]">
            <Link
              href="/"
              className="transition-micro font-mono text-label text-ink transition-colors hover:text-signal"
            >
              → back to the work
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter inset={false} />
    </>
  );
}
