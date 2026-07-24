/** The site's section routes — shared by the hero chrome and the side rail. */
export const NAV = [
  { label: "home", href: "#intro" },
  { label: "background", href: "#background" },
  { label: "how i build", href: "#principles" },
  { label: "work", href: "#work" },
  { label: "toolkit", href: "#toolkit" },
  { label: "contact", href: "#contact" },
] as const;

/**
 * In the hero the routes flank the portrait — the first half on the left, the
 * second on the right (the heynesh split). They converge into one column when
 * the rail forms.
 */
export const NAV_LEFT = NAV.slice(0, 3);
export const NAV_RIGHT = NAV.slice(3);
