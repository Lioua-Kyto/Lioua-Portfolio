"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * The card's title link.
 *
 * The navigation itself is ordinary — the page slides up from below once the
 * router has swapped it in. What this adds is the signal the work rail needs
 * to freeze where it stands, and the focus handling that stops a click from
 * dragging the pinned track sideways.
 */
export function ProjectLink({
  href,
  children,
  ...rest
}: ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      {...rest}
      // Pressing a link focuses it, and the browser then scrolls every
      // scrollable ancestor — the rail's overflow box and the document — until
      // it is in view. The work section is pinned and its track is translated
      // rather than scrolled, so that scroll dragged the rail sideways past a
      // couple of cards before the transition had even started. Take the focus
      // deliberately instead, without the scrolling.
      onMouseDown={(event) => {
        event.preventDefault();
        event.currentTarget.focus({ preventScroll: true });
      }}
      onClick={(event) => {
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }
        // Not preventing the navigation — only telling the rail to hold still
        // while the page changes underneath it.
        window.dispatchEvent(new CustomEvent("project:open"));
      }}
    >
      {children}
    </Link>
  );
}
