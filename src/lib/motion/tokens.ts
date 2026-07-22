/**
 * Motion design tokens — the only place durations, eases, and lerp factors
 * are defined; no magic numbers inline anywhere else.
 */
export const motion = {
  ease: {
    /** Default reveal/out ease — cubic-bezier(0.16, 1, 0.3, 1). */
    out: [0.16, 1, 0.3, 1],
  },
  /** Durations in seconds. */
  dur: {
    reveal: 0.8,
    micro: 0.25,
  },
  /** Per-frame lerp factors for the shared ticker. */
  lerp: {
    cursor: 0.08,
  },
} as const;

/** CSS string form of an ease tuple, for use in inline styles/CSS vars. */
export function cubicBezier(
  ease: readonly [number, number, number, number],
): string {
  return `cubic-bezier(${ease.join(", ")})`;
}
