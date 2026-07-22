import { content } from "@/content";

const NAV = [
  { label: "background", href: "#background" },
  { label: "work", href: "#experience" },
  { label: "contact", href: "#contact" },
];

/**
 * Minimal editorial chrome: name mark left, three anchor routes right — all
 * in the mono label voice. Not fixed; the page is one calm scroll.
 */
export function SiteHeader() {
  return (
    <header className="shell flex items-baseline justify-between gap-6 pt-8">
      {/* Redundant with the hero H1 on small screens — hidden there so the
          nav never overflows. */}
      <a
        href="#intro"
        className="transition-micro hidden font-mono text-label text-ink transition-colors hover:text-signal sm:block"
      >
        {content.intro.name.toLowerCase().replace(" ", ".")}
      </a>
      <nav aria-label="Primary">
        <ul className="flex items-baseline gap-5 sm:gap-6">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="transition-micro font-mono text-label text-slate transition-colors hover:text-signal"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
