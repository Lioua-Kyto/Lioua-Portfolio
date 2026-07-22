import type { ReactNode } from "react";

/**
 * The mono micro-label — the editorial signature (v3 brief §2). Renders
 * section numbers and small technical annotations: `01 — Background`,
 * `Fig. A`, stack tags. One voice, used everywhere.
 */
export function Label({
  index,
  children,
  className,
}: {
  /** Optional leading index, e.g. `01`. */
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={["font-mono text-label text-slate", className]
        .filter(Boolean)
        .join(" ")}
    >
      {index ? `${index} — ` : null}
      {children}
    </span>
  );
}
