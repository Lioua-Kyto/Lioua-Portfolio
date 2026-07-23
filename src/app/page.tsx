import { content } from "@/content";
import { SiteHeader } from "@/components/SiteHeader";
import { SideNav } from "@/components/SideNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Motion } from "@/components/motion/Motion";
import { Marquee } from "@/components/motion/Marquee";
import { Intro } from "@/components/sections/Intro";
import { Background } from "@/components/sections/Background";
import { Principles } from "@/components/sections/Principles";
import { Experience } from "@/components/sections/Experience";
import { Products } from "@/components/sections/Products";
import { Toolkit } from "@/components/sections/Toolkit";
import { Contact } from "@/components/sections/Contact";

/**
 * The site: six numbered editorial sections on one calm scroll, wrapped in
 * the GSAP motion controller. The top chrome relocates into the fixed side
 * rail once the hero leaves.
 */
export default function HomePage() {
  const marqueeItems = content.skills.capabilities.map((c) => c.claim);

  return (
    <div className="relative">
      <SiteHeader />
      <SideNav />
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
