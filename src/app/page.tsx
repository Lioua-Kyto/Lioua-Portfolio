import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Intro } from "@/components/sections/Intro";
import { Background } from "@/components/sections/Background";
import { Principles } from "@/components/sections/Principles";
import { Experience } from "@/components/sections/Experience";
import { Products } from "@/components/sections/Products";
import { Toolkit } from "@/components/sections/Toolkit";
import { Contact } from "@/components/sections/Contact";

/**
 * The site: six numbered editorial sections on one calm scroll (v3 brief §3).
 * Static in Phase 2; the motion layer arrives in Phase 3.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Intro />
        <Background />
        <Principles />
        <Experience />
        <Products />
        <Toolkit />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
