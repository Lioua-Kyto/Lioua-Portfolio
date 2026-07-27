"use client";

import { Fragment, useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";
import { dur, ease, stagger } from "@/lib/motion/tokens";

/**
 * The premium editorial reveal: each word sits in an overflow-hidden line box
 * and rises up from behind it, cascading on a word stagger when the heading
 * scrolls into view — and dropping back behind the line on the way up, so it
 * replays without a reload. `useGSAP` runs pre-paint, so the hidden state
 * applies before the first frame with no flash. The full string stays the
 * accessible name; the split spans are hidden.
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
      const inners = root.querySelectorAll("[data-mask-inner]");

      gsap.set(inners, { yPercent: 118 });
      gsap.to(inners, {
        yPercent: 0,
        duration: dur.reveal,
        ease: ease.out,
        stagger: stagger.words,
        delay,
        scrollTrigger: scroll
          ? {
              trigger: root,
              start: "top 88%",
              // Reversible: scrolling back drops the words behind the mask.
              toggleActions: "play none none reverse",
              // The start is remeasured on every refresh — the webfont swap
              // moves this heading, and a start cached against the fallback
              // metrics is how a title ended up never revealing.
              invalidateOnRefresh: true,
            }
          : undefined,
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${String(index)}`}>
          <span
            aria-hidden="true"
            // pb/-mb gives descenders room so the mask never clips g/y/p at rest.
            className="inline-block overflow-hidden pb-[0.12em] align-bottom -mb-[0.12em]"
          >
            <span
              data-mask-inner
              className="inline-block will-change-transform"
            >
              {word}
            </span>
          </span>
          {/* The gap lives between the masks: a trailing space inside an
              inline-block collapses, running the words together. */}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
