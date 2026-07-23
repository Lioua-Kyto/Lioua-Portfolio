import { content } from "@/content";
import { SideNav } from "@/components/SideNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Motion } from "@/components/motion/Motion";
import { AnchorScroll } from "@/components/providers/AnchorScroll";
import { HeroScene } from "@/components/hero/HeroScene";
import { HeroName } from "@/components/hero/HeroName";
import { PortraitBackdrop } from "@/components/hero/PortraitBackdrop";
import { Marquee } from "@/components/motion/Marquee";
import { Intro } from "@/components/sections/Intro";
import { Background } from "@/components/sections/Background";
import { Principles } from "@/components/sections/Principles";
import { Work } from "@/components/sections/Work";
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
      <AnchorScroll />
      {/* Painting order: the wordmark (z-5) sits under the portrait (z-10),
          which sits under the hero's own content (z-20). */}
      <HeroName />
      <PortraitBackdrop />
      <SideNav />
      <HeroScene />
      <Motion>
        <main>
          <Intro />
          <Background />
          <Principles />
          <Work />
          <Marquee items={marqueeItems} />
          <Toolkit />
          <Contact />
        </main>
      </Motion>
      <SiteFooter />
    </div>
  );
}
