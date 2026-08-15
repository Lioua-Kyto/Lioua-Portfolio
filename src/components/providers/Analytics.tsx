"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent, track } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

/**
 * GA4 and Clarity, mounted only once the reader has accepted.
 *
 * The consent defaults are already in the document head; this is the other
 * half — the tags themselves are not on the page at all until there is an
 * answer, so a reader who declines or never chooses is served a site with no
 * third-party requests in it. Consent lives in localStorage rather than in
 * React state alone, and `consent:change` carries an answer from the banner to
 * here without either component owning the other.
 *
 * With no IDs configured this renders nothing, so a fork or a preview
 * deployment measures no one by accident.
 */
export function Analytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(readConsent() === "granted");
    const onChange = () => {
      setGranted(readConsent() === "granted");
    };
    window.addEventListener("consent:change", onChange);
    return () => {
      window.removeEventListener("consent:change", onChange);
    };
  }, []);

  // Custom events, delegated from one listener on the document.
  //
  // The alternative — an onClick per instrumented element — turns every server
  // component holding a tracked link into a client component, which is a real
  // architectural cost paid for a analytics ping. A `data-track` attribute
  // costs nothing, works on server-rendered markup, and survives the element
  // being moved. `track()` is a no-op until GA exists, so this runs
  // unconditionally and needs no consent check of its own.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-track]");
      const name = el?.dataset.track;
      if (!name) return;
      const label = el.dataset.trackLabel;
      track(name, label ? { label } : undefined);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  if (!granted) return null;

  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {CLARITY_ID ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}");`}
        </Script>
      ) : null}
    </>
  );
}
