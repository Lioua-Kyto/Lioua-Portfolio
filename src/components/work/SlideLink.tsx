"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { slideAway } from "@/components/providers/PageTransition";

/**
 * A link out of a project that takes the page with it: the project slides down
 * and off, and only then does the router move.
 *
 * Modified clicks and new tabs fall through untouched — the animation is for
 * the reader who is staying in this window.
 */
export function SlideLink({
  href,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
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
        event.preventDefault();
        slideAway(() => {
          router.push(href);
        });
      }}
    >
      {children}
    </Link>
  );
}
