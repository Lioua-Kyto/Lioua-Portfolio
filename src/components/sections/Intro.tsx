/**
 * 00 — Intro: the hero's scroll spacer.
 *
 * The visible hero — wordmark, routes, proofs, capabilities — is painted by
 * fixed layers (`HeroName`, `PortraitBackdrop`, `HeroChrome`) so those parts
 * can persist and morph into the side rail. This section exists to reserve the
 * first screen and to be the pin trigger the morph scrubs against; it carries
 * the `#intro` anchor and the region's accessible label.
 */
export function Intro() {
  return <section id="intro" aria-label="Intro" className="h-svh" />;
}
