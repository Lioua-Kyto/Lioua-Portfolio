"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

/**
 * The client-only GSAP module (V3 motion spec §1): plugins registered once,
 * everything animation-related imports gsap/ScrollTrigger from here. All
 * component animation goes through `useGSAP()` from `@gsap/react` — never a
 * raw useEffect.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);
}

export { gsap, ScrollTrigger, Flip };
