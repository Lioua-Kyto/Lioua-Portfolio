"use client";

import { useState } from "react";
import type { Diagram, Erd, Flow } from "@/content/schemas";
import { SystemMap } from "@/components/work/SystemMap";
import { ErdMap } from "@/components/work/ErdMap";
import { FlowMap } from "@/components/work/FlowMap";
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

export function ArchitectureBlock({
  diagram,
  erd,
  flow,
}: {
  diagram: Diagram | null;
  erd: Erd | null;
  flow: Flow | null;
}) {
  const [open, setOpen] = useState<"map" | "erd" | "flow" | null>(null);

  return (
    <>
      {flow ? (
        <>
          <p className="type-display mt-6 max-w-[46ch] text-title leading-tight font-medium">
            {flow.title}
          </p>
          <p className="mt-3 max-w-[58ch] text-base text-slate">
            {flow.caption}
          </p>

          <div className="system-map-frame group mt-8">
            <div className="system-map-scroll">
              <FlowMap flow={flow} />
            </div>
            <button
              type="button"
              className="system-map-open font-mono text-fine uppercase"
              onClick={() => {
                setOpen("flow");
              }}
            >
              Open
            </button>
          </div>
        </>
      ) : null}

      {diagram ? (
        <>
          <p className="type-display mt-20 max-w-[46ch] text-title leading-tight font-medium">
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
                setOpen("map");
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
        </>
      ) : null}

      {erd ? (
        <>
          <p className="type-display mt-20 max-w-[46ch] text-title leading-tight font-medium">
            {erd.title}
          </p>
          <p className="mt-3 max-w-[58ch] text-base text-slate">
            {erd.caption}
          </p>

          <div className="system-map-frame group mt-8">
            <div className="system-map-scroll">
              <ErdMap erd={erd} />
            </div>
            <button
              type="button"
              className="system-map-open font-mono text-fine uppercase"
              onClick={() => {
                setOpen("erd");
              }}
            >
              Open
            </button>
          </div>
        </>
      ) : null}

      <ShotViewer
        shot={
          open === "map" && diagram
            ? {
                alt: `${diagram.title}. ${diagram.caption}`,
                content: (
                  <div className="system-map-stage">
                    <SystemMap diagram={diagram} />
                  </div>
                ),
              }
            : open === "flow" && flow
              ? {
                  alt: `${flow.title}. ${flow.caption}`,
                  content: (
                    <div className="system-map-stage">
                      <FlowMap flow={flow} />
                    </div>
                  ),
                }
              : open === "erd" && erd
                ? {
                    alt: `${erd.title}. ${erd.caption}`,
                    content: (
                      <div className="system-map-stage">
                        <ErdMap erd={erd} />
                      </div>
                    ),
                  }
                : null
        }
        onClose={() => {
          setOpen(null);
        }}
      />
    </>
  );
}
