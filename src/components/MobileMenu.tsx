"use client";

import { useEffect, useState } from "react";
import { content } from "@/content";
import { NAV } from "@/components/nav";

/**
 * The routes on phones and tablets, behind a burger.
 *
 * Below the rail breakpoint the hero has no room for six routes without them
 * landing on the portrait, so they move out of the composition entirely and
 * live in a sheet instead. The sheet also carries the things the rail would
 * otherwise hold — the address and the call to action — so the whole of the
 * site's navigation is one tap away from any scroll position.
 *
 * Hidden from `lg` up, where the rail does this job.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="mobile-nav lg:hidden">
      <button
        type="button"
        className="mobile-nav-toggle glass rounded-xs"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => {
          setOpen((v) => !v);
        }}
      >
        <span className="font-mono text-fine tracking-[0.1em] uppercase">
          {open ? "Close" : "Menu"}
        </span>
        <span
          aria-hidden="true"
          className="mobile-nav-bars"
          data-open={open ? "true" : "false"}
        >
          <span />
          <span />
        </span>
      </button>

      <div
        id="mobile-menu"
        className="mobile-nav-sheet"
        data-open={open ? "true" : "false"}
        hidden={!open}
      >
        <nav aria-label="Menu">
          <ul className="flex flex-col">
            {NAV.map((item, index) => (
              <li key={item.href} className="border-b border-ink/10">
                <a
                  href={item.href}
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mobile-nav-link type-display"
                >
                  <span className="font-mono text-fine text-accent tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={`mailto:${content.contact.email}`}
            className="font-mono text-fine text-slate"
          >
            {content.contact.email}
          </a>
          <div className="flex gap-4 font-mono text-fine text-slate">
            <a href={`https://${content.contact.github}`} rel="me noopener">
              GitHub
            </a>
            <a href={`https://${content.contact.linkedin}`} rel="me noopener">
              LinkedIn
            </a>
            {content.contact.whatsapp ? (
              <a
                href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, "")}`}
                rel="me noopener"
              >
                WhatsApp
              </a>
            ) : null}
          </div>
          <a
            href="#contact"
            onClick={() => {
              setOpen(false);
            }}
            className="mobile-nav-cta rounded-xs font-mono text-fine"
          >
            <span>Let&apos;s talk</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
