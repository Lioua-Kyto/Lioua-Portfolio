"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readConsent, writeConsent, type Consent } from "@/lib/analytics";

/** Record the answer, tell `Analytics` to (un)mount, and drop the banner. */
function answer(consent: Consent) {
  writeConsent(consent);
  window.dispatchEvent(new Event("consent:change"));
}

/**
 * The consent banner — a bottom rule with the ask and two equal answers.
 *
 * Deliberately not a modal and deliberately not a dark overlay: it asks for
 * permission to count visits, which does not warrant seizing the page. Accept
 * and decline are the same size and the same weight, because a banner that
 * makes one of them hard to find is not asking a question.
 *
 * It only renders when there is no stored answer, and it clears the rail on
 * desktop so it never lands over the fixed sidebar.
 */
export function CookieConsent() {
  // Starts closed and opens from an effect: the answer lives in localStorage,
  // which the server cannot read, so rendering it open would flash the banner
  // at every reader who already dismissed it.
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (readConsent() === null) setAsking(true);
    const onChange = () => {
      setAsking(readConsent() === null);
    };
    window.addEventListener("consent:change", onChange);
    return () => {
      window.removeEventListener("consent:change", onChange);
    };
  }, []);

  if (!asking) return null;

  return (
    <div role="dialog" aria-label="Cookie consent" className="consent-bar">
      <p className="max-w-[62ch] text-label text-slate">
        Performance and session metrics are tracked anonymously via Google
        Analytics and Microsoft Clarity. Zero advertising tracking. You control
        the execution state.{" "}
        <Link
          href="/privacy-policy"
          className="transition-micro text-ink underline underline-offset-4 transition-colors hover:text-signal"
        >
          What gets collected
        </Link>
      </p>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => {
            answer("denied");
          }}
          className="consent-button transition-micro"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => {
            answer("granted");
          }}
          className="consent-button consent-button--accept transition-micro"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

/**
 * The withdrawal control on the privacy page. The policy says the reader can
 * change their mind, so the page it says that on is where the switch belongs —
 * a link to a cookie settings pane they have to go hunting for is the same
 * sentence with the action removed.
 */
export function ConsentWithdrawal() {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    setConsent(readConsent());
  }, []);

  return (
    <p className="mt-4 flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={() => {
          const next = consent === "granted" ? "denied" : "granted";
          answer(next);
          setConsent(next);
        }}
        className="consent-button consent-button--accept transition-micro"
      >
        {consent === "granted" ? "Turn analytics off" : "Turn analytics on"}
      </button>
      <span className="font-mono text-fine text-slate">
        currently{" "}
        <span className="text-ink">{consent === "granted" ? "on" : "off"}</span>
        {consent === null ? " — you have not been asked yet" : ""}
      </span>
    </p>
  );
}
