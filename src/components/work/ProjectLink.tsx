"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The card's title link, which asks the transition layer to open the project
 * rather than letting the router cut straight to it.
 *
 * It measures the card's own cover at the moment of the click and hands that
 * rectangle over, so the image that grows is the one the reader aimed at. Any
 * click the transition cannot honour — a new tab, a modified click, a card
 * with no capture — falls through to the ordinary navigation untouched.
 */
export function ProjectLink({
  href,
  cover,
  className,
  children,
}: {
  href: string;
  cover: string | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (
          !cover ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }
        const card = event.currentTarget.closest("[data-work-card]");
        const box = card
          ?.querySelector("[data-card-cover]")
          ?.getBoundingClientRect();
        if (!box) return;

        event.preventDefault();
        window.dispatchEvent(
          new CustomEvent("project:open", {
            detail: {
              href,
              src: cover,
              rect: {
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
              },
            },
          }),
        );
      }}
    >
      {children}
    </Link>
  );
}
