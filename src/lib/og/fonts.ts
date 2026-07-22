/**
 * Fetch a Google-hosted font as TTF for satori (next/og) — satori can't read
 * the site's local woff2. A UA-less css2 request returns a legacy TTF `src`.
 * Cached per (family, weight, variant) for the instance; null on any failure
 * so the OG card falls back to next/og's built-in face — degraded, never
 * broken.
 */
const cache = new Map<string, Promise<ArrayBuffer | null>>();

export function fetchGoogleFont(
  family: string,
  weight: number,
): Promise<ArrayBuffer | null> {
  const key = `${family}:${String(weight)}`;
  let pending = cache.get(key);
  if (!pending) {
    pending = (async () => {
      try {
        const css = await (
          await fetch(
            `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
              family,
            )}:wght@${String(weight)}`,
          )
        ).text();
        const url = /url\((https:[^)]+\.ttf)\)/.exec(css)?.[1];
        if (!url) return null;
        return await (await fetch(url)).arrayBuffer();
      } catch {
        return null;
      }
    })();
    cache.set(key, pending);
  }
  return pending;
}
