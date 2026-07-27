"use client";

import { useState } from "react";
import type { Diagram } from "@/content/schemas";
import { SystemMap } from "@/components/work/SystemMap";
import { ShotViewer } from "@/components/work/ShotViewer";

/**
 * The architecture section of a project page: the plain-language claim, the
 * drawing, and a way into it.
 *
 * The map is vector, so opening it in the viewer is a genuine zoom rather than
 * a bigger picture of the same pixels. On a phone the drawing is wider than the
 * screen by nature, so it scrolls sideways in place and the viewer is the way
 * to read it properly.
 */
const LEGEND = [
  { kind: "client", label: "What people use" },
  { kind: "service", label: "Code I wrote" },
  { kind: "data", label: "Where it is kept" },
  { kind: "external", label: "Someone else's service" },
] as const;

export function ArchitectureBlock({ diagram }: { diagram: Diagram }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <p className="type-display mt-6 max-w-[46ch] text-title leading-tight font-medium">
        {diagram.title}
      </p>
      <p className="mt-3 max-w-[58ch] text-base text-slate">
        {diagram.caption}
      </p>

      <div className="system-map-frame group mt-8">
        <div className="system-map-scroll">
          <SystemMap diagram={diagram} />
        </div>
        <button
          type="button"
          className="system-map-open font-mono text-fine uppercase"
          onClick={() => {
            setOpen(true);
          }}
        >
          Open
        </button>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {LEGEND.map((entry) => (
          <li
            key={entry.kind}
            data-kind={entry.kind}
            className="system-map-key font-mono text-fine text-slate"
          >
            {entry.label}
          </li>
        ))}
      </ul>

      <ShotViewer
        shot={
          open
            ? {
                alt: `${diagram.title}. ${diagram.caption}`,
                content: (
                  <div className="system-map-stage">
                    <SystemMap diagram={diagram} />
                  </div>
                ),
              }
            : null
        }
        onClose={() => {
          setOpen(false);
        }}
      />
    </>
  );
}
