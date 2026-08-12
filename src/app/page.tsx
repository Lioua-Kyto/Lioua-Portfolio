import { content } from "@/content";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileMenu } from "@/components/MobileMenu";
import { Motion } from "@/components/motion/Motion";
import { HeroChrome } from "@/components/hero/HeroChrome";
import { HeroName } from "@/components/hero/HeroName";
import { PortraitBackdrop } from "@/components/hero/PortraitBackdrop";
import { Marquee } from "@/components/motion/Marquee";
import { Intro } from "@/components/sections/Intro";
import { Background } from "@/components/sections/Background";
import { Principles } from "@/components/sections/Principles";
import { Work } from "@/components/sections/Work";
import { Ship } from "@/components/sections/Ship";
import { Toolkit } from "@/components/sections/Toolkit";
import { Contact } from "@/components/sections/Contact";

/**
 * The site: the hero, the story timeline, how I build, the merged body of
 * work, the toolkit, and contact — one calm scroll. The hero's chrome relocates
 * into the fixed side rail as it pins.
 */
export default function HomePage() {
  const marqueeItems = content.skills.capabilities.map((c) => c.claim);

  return (
    <div className="relative">
      {/* Painting order: the wordmark (z-5) sits under the portrait (z-10),
          which sits under the hero chrome (z-30) that becomes the side rail. */}
      <HeroName />
      <PortraitBackdrop />
      <HeroChrome />
      <MobileMenu />
      <Motion>
        <main>
          <Intro />
          <Background />
          <Principles />
          <Work />
          <Marquee items={marqueeItems} />
          <Ship />
          <Toolkit />
          <Contact />
        </main>
      </Motion>
      <SiteFooter />
    </div>
  );
}
