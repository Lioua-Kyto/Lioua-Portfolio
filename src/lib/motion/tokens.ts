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
  /** The giant name's entrance — the slowest thing on the page. */
  title: 1.6,
} as const;

/** GSAP ease names. */
export const ease = {
  /** The default — soft deceleration, the "expensive" feel. */
  out: "power3.out",
  /** For looping/reversible motion (marquee, rotators). */
  inOut: "power2.inOut",
  /** The title's settle — a longer tail than power3. */
  title: "expo.out",
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
  /** The hero's pinned dispersal — heavier lag, more glide. */
  hero: 0.8,
  /** The horizontal projects track. */
  rail: 0.6,
} as const;

/**
 * Pin lengths, in viewport heights of scroll consumed while pinned.
 * `hero: 1.9` ≈ 15 wheel notches before the next section arrives.
 */
export const pin = {
  hero: 1.9,
  /** Per project card on the horizontal track. */
  projectCard: 0.85,
} as const;

/**
 * How far each hero element travels on its way out, as a multiplier on the
 * base distance. Different values per element are the whole point: the group
 * disperses at different speeds instead of moving as one slab.
 */
export const disperse = {
  title: 0.42,
  nav: 0.68,
  stats: 1,
  lede: 0.84,
  capabilities: 1.15,
  tagline: 1.35,
} as const;
