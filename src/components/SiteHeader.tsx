import { content } from "@/content";
import { NAV } from "@/components/nav";

const TOP_ROUTES = ["#background", "#experience", "#contact"];

/**
 * Minimal editorial chrome over the hero. It scrolls away with the hero, at
 * which point the same components reappear in the fixed side rail
 * (`SideNav`) — the chrome relocates rather than duplicating.
 */
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 pt-8">
      <div className="shell flex items-baseline justify-between gap-6">
        <a
          href="#intro"
          className="transition-micro hidden font-mono text-label text-ink transition-colors hover:text-signal sm:block"
        >
          {content.intro.name.toLowerCase().replace(" ", ".")}
        </a>
        <nav aria-label="Primary">
          <ul className="flex items-baseline gap-5 sm:gap-6">
            {NAV.filter((item) => TOP_ROUTES.includes(item.href)).map(
              (item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="transition-micro font-mono text-label text-slate transition-colors hover:text-signal"
                  >
                    {item.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
