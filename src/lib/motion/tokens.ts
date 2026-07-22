/**
 * Motion tokens (V3 motion spec §5) — the single place durations, eases,
 * staggers, and scrub lags are defined. Tune the whole site's feel from this
 * file; no inline magic numbers anywhere else.
 */

/** Durations in seconds. */
export const dur = {
  /** Section/hero element reveals. */
  reveal: 0.9,
  /** Hovers, small state changes. */
  micro: 0.35,
  /** Portrait scale range, large moves. */
  slow: 1.2,
} as const;

/** GSAP ease names. */
export const ease = {
  /** The default — soft deceleration, the "expensive" feel. */
  out: "power3.out",
  /** For looping/reversible motion (marquee, rotators). */
  inOut: "power2.inOut",
} as const;

/** Stagger intervals in seconds. */
export const stagger = {
  /** Grid/list cascades. */
  tight: 0.08,
  /** Hero element sequence. */
  hero: 0.1,
  /** Within a split headline. */
  words: 0.05,
} as const;

/** ScrollTrigger scrub lags. */
export const scrub = {
  /** Slight lag = smoother than true `true`. */
  portrait: 0.5,
} as const;
