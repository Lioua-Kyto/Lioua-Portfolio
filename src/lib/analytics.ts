/**
 * Consent state and event tracking.
 *
 * Google Consent Mode v2, denied by default. Nothing measuring the reader runs
 * until they say yes: the trackers are not merely told to hold back, their
 * scripts are never requested. That is both the honest reading of "denied by
 * default" and the reason a first visit still costs zero third-party bytes.
 *
 * A plain module rather than a hook — `gtag` is a global, so a hook would add a
 * render subscription to something no component ever re-renders on. `track()`
 * is callable from an event handler, an effect, or a server-rendered island's
 * client child alike.
 */

const STORAGE_KEY = "lz-consent";

export type Consent = "granted" | "denied";

/** The consent keys the site actually has an opinion about (Consent Mode v2). */
const AD_KEYS = ["ad_storage", "ad_user_data", "ad_personalization"] as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * The reader's stored answer, or `null` if they have not been asked yet.
 * `null` is what raises the banner — it is meaningfully different from
 * "denied", which means they answered and the banner should stay down.
 */
export function readConsent(): Consent | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Safari in private mode throws on localStorage. Treat it as "not asked":
    // the banner shows, the answer just will not survive the tab.
    return null;
  }
}

/** Record the answer and push it to Consent Mode. */
export function writeConsent(consent: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, consent);
  } catch {
    // Nothing to do — the session still honours the choice in memory below.
  }
  window.gtag?.("consent", "update", {
    analytics_storage: consent,
    ...Object.fromEntries(AD_KEYS.map((key) => [key, "denied"])),
  });
}

/**
 * A custom event, e.g. `track("clicked_github", { location: "rail" })`.
 *
 * Safe to call before consent or before GA has loaded: `gtag` is simply absent
 * and the call is a no-op. Callers never have to check first, which is the only
 * way instrumentation stays at the call site instead of drifting into wrappers.
 */
export function track(event: string, params?: Record<string, unknown>) {
  window.gtag?.("event", event, params);
}

/**
 * The Consent Mode v2 defaults, as a string for the inline `<head>` script.
 *
 * This has to execute before any Google tag — including one a future tag
 * manager might inject — so it ships inline in the document head rather than
 * through `next/script`. `ad_*` are denied permanently: the site sells nothing
 * and runs no ads, so there is no path that grants them. `functionality` and
 * `security` are granted because they cover the site working at all, which is
 * not something a cookie banner is asking about.
 */
export const CONSENT_BOOTSTRAP = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
window.gtag=gtag;
gtag('consent','default',{
ad_storage:'denied',
ad_user_data:'denied',
ad_personalization:'denied',
analytics_storage:'denied',
functionality_storage:'granted',
security_storage:'granted',
wait_for_update:500
});
try{if(localStorage.getItem('${STORAGE_KEY}')==='granted'){
gtag('consent','update',{analytics_storage:'granted'})}}catch(e){}
`.replace(/\n/g, "");
