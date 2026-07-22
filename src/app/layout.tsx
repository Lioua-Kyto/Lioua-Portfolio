import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { content } from "@/content";
import "./globals.css";

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Variable.woff2", style: "normal" },
    { path: "./fonts/GeneralSans-VariableItalic.woff2", style: "italic" },
  ],
  weight: "200 700",
  variable: "--font-general-sans",
  display: "optional",
});

// Self-hosted Google instance pinned at wdth=125 (the only width the site
// uses) — 35KB vs 88KB for the full variable axis space.
const archivo = localFont({
  src: [{ path: "./fonts/ArchivoExpanded.woff2", style: "normal" }],
  weight: "500 800",
  variable: "--font-archivo",
  display: "optional",
  declarations: [{ prop: "font-stretch", value: "125%" }],
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${content.site.domain}`),
  title: {
    default: content.site.title,
    template: "%s · Lioua Zeddam",
  },
  description: content.site.description,
  openGraph: {
    type: "website",
    siteName: "Lioua Zeddam",
    title: content.site.title,
    description: content.site.description,
    url: "/",
  },
};

/** Person structured data — the site's single subject. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lioua Zeddam",
  jobTitle: "Full Stack Developer",
  url: `https://${content.site.domain}`,
  email: `mailto:${content.contact.email}`,
  sameAs: [
    `https://${content.contact.linkedin}`,
    `https://${content.contact.github}`,
  ],
};

/** Root layout: fonts, structured data, and the single Lenis provider. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${martianMono.variable} ${generalSans.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
