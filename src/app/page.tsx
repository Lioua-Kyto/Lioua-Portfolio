import { content } from "@/content";
import { SiteHeader } from "@/components/SiteHeader";
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
 * The site: six numbered editorial sections on one calm scroll (v3 brief §3),
 * wrapped in the GSAP motion controller (spec §2–4). A single textural
 * marquee sits between the work and the toolkit.
 */
export default function HomePage() {
  const marqueeItems = content.skills.capabilities.map((c) => c.claim);

  return (
    <>
      <SiteHeader />
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
    </>
  );
}
