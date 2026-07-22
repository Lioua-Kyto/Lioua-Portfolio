import { content } from "@/content";

/**
 * Placeholder homepage — renders the kept foundation (fonts, tokens, Lenis
 * provider, typed content) with no concept code. The v3 build replaces this.
 */
export default function HomePage() {
  return (
    <main className="shell flex min-h-svh flex-col justify-center">
      <h1 className="type-display text-hero font-extrabold">
        {content.hero.name}
      </h1>
      <p className="mt-6 max-w-[40ch] text-editorial text-slate">
        {content.hero.thesis}
      </p>
    </main>
  );
}
