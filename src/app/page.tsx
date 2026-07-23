import { content } from "@/content";
import { SideNav } from "@/components/SideNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Motion } from "@/components/motion/Motion";
import { AnchorScroll } from "@/components/providers/AnchorScroll";
import { HeroScene } from "@/components/hero/HeroScene";
import { PortraitBackdrop } from "@/components/hero/PortraitBackdrop";
import { Marquee } from "@/components/motion/Marquee";
import { Intro } from "@/components/sections/Intro";
import { Background } from "@/components/sections/Background";
import { Principles } from "@/components/sections/Principles";
import { Experience } from "@/components/sections/Experience";
import { Products } from "@/components/sections/Products";
import { Toolkit } from "@/components/sections/Toolkit";
import { Contact } from "@/components/sections/Contact";

/**
 * The site: six numbered editorial sections on one calm scroll. The hero owns
 * the first screen and, as it pins and disperses, hands its chrome to the
 * fixed side rail.
 */
export default function HomePage() {
  const marqueeItems = content.skills.capabilities.map((c) => c.claim);

  return (
    <div className="relative">
      <AnchorScroll />
      <PortraitBackdrop />
      <SideNav />
      <HeroScene />
      <Motion>
        <main>
          <Intro />
          <Background />
          <Principles />
          <Experience />
          <Products />
          <Marquee items={marqueeItems} />
          <Toolkit />
          <Contact />
        </main>
      </Motion>
      <SiteFooter />
    </div>
  );
}
