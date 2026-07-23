"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { dur, ease, stagger } from "@/lib/motion/tokens";

/**
 * The premium editorial reveal (heynesh signature): each word sits in an
 * overflow-hidden line box and rises up from behind it, cascading on a word
 * stagger when the heading scrolls into view. `useGSAP` runs pre-paint, so the
 * words are hidden before first frame — no flash. Reduced motion leaves them
 * simply in place. The full string stays the accessible text; the split spans
 * are aria-hidden.
 */
export function MaskText({
  text,
  as,
  className,
  delay = 0,
  scroll = true,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Reveal on scroll-in (default) vs immediately on mount (hero). */
  scroll?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as ?? "span";
  const words = text.split(" ");

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const inners = root.querySelectorAll("[data-mask-inner]");
        gsap.set(inners, { yPercent: 118 });
        gsap.to(inners, {
          yPercent: 0,
          duration: dur.reveal,
          ease: ease.out,
          stagger: stagger.words,
          delay,
          scrollTrigger: scroll
            ? { trigger: root, start: "top 88%" }
            : undefined,
        });
      });

      // Reduced motion: no rise from behind the mask — a plain opacity fade.
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          root,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: dur.micro,
            ease: "none",
            delay,
            scrollTrigger: scroll
              ? { trigger: root, start: "top 92%" }
              : undefined,
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${String(index)}`}
          aria-hidden="true"
          // pb/-mb gives descenders room so the mask never clips g/y/p at rest.
          className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]"
        >
          <span data-mask-inner className="inline-block will-change-transform">
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
