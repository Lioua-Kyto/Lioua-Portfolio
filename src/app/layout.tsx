import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Martian_Mono } from "next/font/google";
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
  openGraph: {
    type: "website",
    siteName: "Lioua Zeddam",
    title: content.site.title,
    description: content.site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: content.site.title,
    description: content.site.description,
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
      className={`${display.variable} ${martianMono.variable} ${generalSans.variable}`}
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
