"use client";

import { toggleMotion, useMotionEnabled } from "@/lib/motion/preference";

/**
 * Lets the visitor force motion on or off regardless of the OS setting. The
 * OS preference is still the default, so reduced-motion users get a calm site
 * unless they opt in — but nobody is locked out of the full experience by a
 * system toggle they may not know about.
 */
export function MotionToggle({ className }: { className?: string }) {
  const enabled = useMotionEnabled();

  return (
    <button
      type="button"
      onClick={toggleMotion}
      aria-pressed={enabled}
      title="Toggle animations"
      className={[
        "transition-micro font-mono text-fine text-slate transition-colors hover:text-signal",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      motion: {enabled ? "on" : "off"}
    </button>
  );
}
