/**
 * Env-gated debug logger — the only sanctioned console surface (§2.1).
 * Silent in production builds; no-op unless NODE_ENV is development.
 */
export function debug(...args: readonly unknown[]): void {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console -- the one gated console call.
    console.debug("[debug]", ...args);
  }
}
