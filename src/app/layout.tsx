import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { RouteScrollReset } from "@/components/providers/RouteScrollReset";
import { AnchorScroll } from "@/components/providers/AnchorScroll";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PageTransition } from "@/components/providers/PageTransition";
import { Analytics } from "@/components/providers/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { CONSENT_BOOTSTRAP } from "@/lib/analytics";
import { content } from "@/content";
import "./globals.css";

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Variable.woff2", style: "normal" },
    { path: "./fonts/GeneralSans-VariableItalic.woff2", style: "italic" },
  ],
  weight: "200 700",
  variable: "--font-general-sans",
  display: "swap",
});

// Display voice — Bricolage Grotesque. A contemporary variable grotesque with
// an optical-size axis and quirky, humane terminals: distinctive at giant
// sizes without the "AI luxury serif" default a Fraunces/Playfair would carry.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${content.site.domain}`),
  title: {
    default: content.site.title,
    template: "%s · Lioua Zeddam",
  },
  description: content.site.description,
  // The site has one subject and one name to rank for. `applicationName` and
  // `authors` are what let a search engine tie the domain to the person rather
  // than treating it as an unattributed portfolio template.
  applicationName: "Lioua Zeddam",
  authors: [{ name: "Lioua Zeddam", url: `https://${content.site.domain}` }],
  creator: "Lioua Zeddam",
  publisher: "Lioua Zeddam",
  // Self-referencing canonical on the root; every other route declares its own.
  // Without it the apex and any tracking-parameter variant compete as separate
  // documents for the same query.
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    // `website`, not `profile`. Both are valid Open Graph, but `profile` is a
    // person object and the scrapers treat it as a lesser citizen for link
    // cards. This page is a site, and the Person is already declared properly
    // in the JSON-LD below where it actually earns something.
    type: "website",
    siteName: "Lioua Zeddam",
    title: content.site.title,
    description: content.site.description,
    url: "/",
    locale: "en_GB",
    // No `images` here on purpose. `opengraph-image.tsx` is a file convention
    // and beats anything set in this object, so listing an image here would be
    // a line that looks authoritative and silently does nothing.
  },
  twitter: {
    card: "summary_large_image",
    title: content.site.title,
    description: content.site.description,
  },
  // No `google-site-verification` here by design — it is issued per property
  // and belongs in Search Console's DNS or file method, not committed to a
  // public repo.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

/**
 * Person structured data — the site's single subject.
 *
 * `sameAs` is the load-bearing property: it is how a search engine decides the
 * GitHub account, the LinkedIn profile and this domain are one entity rather
 * than three, which is what a name query has to resolve to. `knowsAbout` is
 * drawn from the skills inventory so the graph and the page cannot drift apart.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `https://${content.site.domain}/#person`,
  name: "Lioua Zeddam",
  givenName: "Lioua",
  familyName: "Zeddam",
  jobTitle: "Full Stack Developer",
  description: content.site.description,
  url: `https://${content.site.domain}`,
  image: `https://${content.site.domain}/img/portrait.webp`,
  email: `mailto:${content.contact.email}`,
  knowsLanguage: content.about.languages,
  knowsAbout: content.skills.inventory.flatMap((group) => group.items),
  address: {
    "@type": "PostalAddress",
    addressCountry: "DZ",
  },
  sameAs: [
    `https://${content.contact.linkedin}`,
    `https://${content.contact.github}`,
  ],
};

/** The site itself, bound to the person above so the two are one graph. */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `https://${content.site.domain}/#website`,
  url: `https://${content.site.domain}`,
  name: content.site.title,
  description: content.site.description,
  inLanguage: "en",
  author: { "@id": `https://${content.site.domain}/#person` },
  publisher: { "@id": `https://${content.site.domain}/#person` },
};

/** Root layout: fonts, structured data, and the single Lenis provider. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${martianMono.variable} ${generalSans.variable}`}
    >
      <head>
        {/* Set before first paint so a reload never restores a mid-page
            scroll — the site always opens at the top of the hero. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "history.scrollRestoration='manual';",
          }}
        />
        {/* Consent Mode v2 defaults, denied, before anything Google-shaped can
            run. Inline in the head rather than through `next/script` because
            "first" is the entire contract: a tag that loads ahead of its
            defaults has already made its own decision. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_BOOTSTRAP }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personJsonLd, siteJsonLd]),
          }}
        />
        <SmoothScrollProvider>
          <RouteScrollReset />
          <AnchorScroll />
          <PageTransition>{children}</PageTransition>
        </SmoothScrollProvider>
        <CookieConsent />
        <Analytics />
        {/* Core Web Vitals from real visits, which is the only place the LCP
            number that matters can come from — a lab run on a CI box is a
            proxy for it, not a measurement of it.
            Not behind the consent gate, unlike GA and Clarity: it sets no
            cookie, identifies nobody, and reports timings rather than
            behaviour. Gating it would also mean only ever measuring the
            performance of people who accepted, which is the half least likely
            to have bounced on a slow load. Disclosed in the privacy policy. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
