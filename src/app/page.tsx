import { content } from "@/content";
import { PlaceholderHero } from "@/components/home/PlaceholderHero";

/**
 * Placeholder homepage — renders the kept foundation (fonts, tokens, Lenis
 * provider, typed content, GSAP wiring) with no concept code. The v3 build
 * replaces this.
 */
export default function HomePage() {
  return (
    <main className="shell flex min-h-svh flex-col justify-center">
      <PlaceholderHero name={content.hero.name} thesis={content.hero.thesis} />
    </main>
  );
}
