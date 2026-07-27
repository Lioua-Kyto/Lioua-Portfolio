"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { gsap } from "@/lib/motion/gsap";

/** Either a capture to zoom, or arbitrary vector content (a system map). */
type Shot = { src?: string; alt: string; content?: ReactNode };

/**
 * A zoom-and-pan window for a capture — the same control a diagram viewer
 * needs, so architecture diagrams can be dropped straight in later.
 *
 * Wheel (or pinch) zooms toward the pointer, drag pans, double-click toggles
 * between fit and 2x, and the zoom is clamped so the image can never be lost
 * off-screen. The transform lives in a ref and is written to the node
 * directly: a pointermove that re-rendered React on every frame would drop
 * frames on a large capture.
 *
 * It opens by flying out of the thing that was clicked and closes back into it,
 * so the reader never loses their place. That travel is animated from JS rather
 * than in CSS: an earlier CSS-keyframe version was silently flattened to 0.01ms
 * by the reduced-motion reset on machines with the OS animation setting off —
 * which is the author's own machine — and the viewer simply appeared. This is a
 * one-shot, reader-initiated transition, not an autoplaying loop, so it plays
 * for everyone, like the rest of the site's motion.
 */
export function ShotViewer({
  shot,
  origin,
  onClose,
}: {
  shot: Shot | null;
  /** The element the reader clicked, so the viewer can grow out of it. */
  origin?: DOMRect | null;
  onClose: () => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLButtonElement>(null);
  /** Where it came from, held so the close can fly back to the same place. */
  const from = useRef<DOMRect | null>(null);
  const view = useRef({ scale: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  /** The drawing's width at 100%, measured once when the viewer opens. */
  const baseWidth = useRef(0);
  const [zoomLabel, setZoomLabel] = useState(100);
  const { getLenis } = useSmoothScroll();

  const isVector = Boolean(shot?.content);

  const paint = useCallback(() => {
    const el = frame.current;
    if (!el) return;
    const { scale, x, y } = view.current;
    if (isVector) {
      // Scaling a transformed layer resamples whatever it was rasterised at,
      // which is why a zoomed diagram went soft. Growing the drawing's own
      // width makes the browser lay it out and repaint the vector at the new
      // size, so text is as sharp at 400% as at 100%. The width is set in
      // pixels off a measured base: a percentage resolves against an auto
      // grid track, which is circular, and the sheet ended up shrinking as the
      // drawing grew. The transform does the panning and nothing else.
      el.style.transform = `translate(${String(x)}px, ${String(y)}px)`;
      const svg = el.querySelector("svg");
      if (svg && baseWidth.current > 0) {
        svg.style.width = `${String(baseWidth.current * scale)}px`;
        svg.style.height = "auto";
      }
    } else {
      el.style.transform = `translate3d(${String(x)}px, ${String(y)}px, 0) scale(${String(scale)})`;
    }
    setZoomLabel(Math.round(scale * 100));
  }, [isVector]);

  const reset = useCallback(() => {
    view.current = { scale: 1, x: 0, y: 0 };
    paint();
  }, [paint]);

  /**
   * Pull the pan back into range.
   *
   * For a drawing this is measured, never inferred from the scale: the drawing
   * is centred while it fits and top-left aligned once it overflows, so a
   * symmetric limit computed off the scale let the sheet slide to blank space
   * on one side while the far side stayed out of reach. Reading where the
   * drawing actually is and closing any gap gets both edges, on both axes.
   * Must run after a paint, so the rect reflects the current size and offset.
   */
  const clamp = useCallback(() => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    if (isVector) {
      const svg = frame.current?.querySelector("svg");
      if (!svg) return;
      const art = svg.getBoundingClientRect();
      if (art.width <= box.width) view.current.x = 0;
      else if (art.left > box.left) view.current.x -= art.left - box.left;
      else if (art.right < box.right) view.current.x += box.right - art.right;

      if (art.height <= box.height) view.current.y = 0;
      else if (art.top > box.top) view.current.y -= art.top - box.top;
      else if (art.bottom < box.bottom)
        view.current.y += box.bottom - art.bottom;
      return;
    }
    const limitX = (box.width * (view.current.scale - 1)) / 2;
    const limitY = (box.height * (view.current.scale - 1)) / 2;
    view.current.x = Math.max(-limitX, Math.min(limitX, view.current.x));
    view.current.y = Math.max(-limitY, Math.min(limitY, view.current.y));
  }, [isVector]);

  const zoomBy = useCallback(
    (factor: number, pointerX?: number, pointerY?: number) => {
      const next = Math.max(1, Math.min(6, view.current.scale * factor));
      const box = stage.current?.getBoundingClientRect();
      const at = {
        x: pointerX ?? (box ? box.left + box.width / 2 : 0),
        y: pointerY ?? (box ? box.top + box.height / 2 : 0),
      };

      if (isVector) {
        // The drawing changes size by relayout, so the only reliable way to
        // hold the point under the cursor is to note where it sits in the
        // drawing, grow it, then shift by however far that point moved.
        const svg = frame.current?.querySelector("svg");
        const before = svg?.getBoundingClientRect();
        const u =
          before && before.width ? (at.x - before.left) / before.width : 0.5;
        const v =
          before && before.height ? (at.y - before.top) / before.height : 0.5;
        view.current.scale = next;
        paint();
        const after = svg?.getBoundingClientRect();
        if (after) {
          view.current.x += at.x - (after.left + u * after.width);
          view.current.y += at.y - (after.top + v * after.height);
        }
      } else {
        const ratio = next / view.current.scale;
        const originX = box ? at.x - box.left - box.width / 2 : 0;
        const originY = box ? at.y - box.top - box.height / 2 : 0;
        view.current.x = originX - (originX - view.current.x) * ratio;
        view.current.y = originY - (originY - view.current.y) * ratio;
        view.current.scale = next;
      }

      if (next === 1) view.current = { scale: 1, x: 0, y: 0 };
      paint();
      clamp();
      paint();
    },
    [clamp, paint, isVector],
  );

  /**
   * The stage's travel to and from the card it was opened out of.
   *
   * The scale is capped below 1: a diagram frame is nearly as wide as the
   * viewer, so honest FLIP geometry alone gave a 0.97 start and the opening
   * read as a pop again. Capping it keeps the position true to the card while
   * guaranteeing the sheet is visibly seen to grow.
   */
  const flight = useCallback((box: DOMRect | null, target: DOMRect) => {
    if (!box || box.width === 0) return { x: 0, y: 48, scale: 0.86 };
    return {
      x: box.left + box.width / 2 - (target.left + target.width / 2),
      y: box.top + box.height / 2 - (target.top + target.height / 2),
      scale: Math.max(0.2, Math.min(0.84, box.width / target.width)),
    };
  }, []);

  // `onClose` is an inline arrow in every caller, so anything that depends on
  // it changes identity on each parent render. Held in a ref, the entrance
  // effect can key on the shot alone and never replay mid-view.
  const close = useRef(onClose);
  close.current = onClose;

  const dismiss = useCallback(() => {
    const el = stage.current;
    if (!el) {
      close.current();
      return;
    }
    const back = flight(from.current, el.getBoundingClientRect());
    gsap.to(scrim.current, { autoAlpha: 0, duration: 0.28, ease: "power2.in" });
    gsap.to(bar.current, { autoAlpha: 0, y: 12, duration: 0.2 });
    gsap.to(el, {
      ...back,
      autoAlpha: 0,
      duration: 0.34,
      ease: "power2.in",
      onComplete: () => {
        close.current();
      },
    });
  }, [flight]);

  // Grow out of the card that was clicked, measured against the stage's real
  // size. Its own effect, keyed on the shot, so it plays once per opening.
  useEffect(() => {
    const el = stage.current;
    if (!shot || !el) return;
    from.current = origin ?? null;
    const start = flight(origin ?? null, el.getBoundingClientRect());
    gsap.fromTo(
      scrim.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.45, ease: "power2.out" },
    );
    gsap.fromTo(
      el,
      { ...start, autoAlpha: 0 },
      {
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.78,
        ease: "expo.out",
        clearProps: "transform",
      },
    );
    gsap.fromTo(
      bar.current,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.5, delay: 0.22, ease: "power3.out" },
    );
  }, [shot, origin, flight]);

  useEffect(() => {
    if (!shot) return;
    baseWidth.current = stage.current?.clientWidth ?? 0;
    reset();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
      if (event.key === "+" || event.key === "=") zoomBy(1.25);
      if (event.key === "-") zoomBy(0.8);
      if (event.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);

    // The page scroller has to be stopped, not just hidden: Lenis drives its
    // own animation frame and transforms the page itself, so `overflow:hidden`
    // on the body left the page travelling underneath while the wheel zoomed.
    const lenis = getLenis();
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // React attaches wheel handlers passively, which cannot cancel the scroll.
    // A native non-passive listener can, so the wheel means zoom and nothing
    // else while the viewer is open.
    const el = stage.current;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? 1.12 : 0.89, event.clientX, event.clientY);
    };
    el?.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("wheel", onWheel);
      document.body.style.overflow = previous;
      lenis?.start();
    };
  }, [shot, dismiss, reset, zoomBy, getLenis]);

  if (!shot) return null;

  return (
    <div
      className="shot-viewer"
      data-vector={shot.content ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
    >
      <button
        ref={scrim}
        type="button"
        className="shot-viewer-scrim"
        aria-label="Close the viewer"
        onClick={dismiss}
      />

      <div
        ref={stage}
        className="shot-viewer-stage"
        onDoubleClick={() => {
          if (view.current.scale > 1) reset();
          else zoomBy(2);
        }}
        onPointerDown={(event) => {
          drag.current = {
            x: event.clientX - view.current.x,
            y: event.clientY - view.current.y,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current || view.current.scale === 1) return;
          view.current.x = event.clientX - drag.current.x;
          view.current.y = event.clientY - drag.current.y;
          paint();
          clamp();
          paint();
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <div ref={frame} className="shot-viewer-frame">
          {shot.content ?? (
            <Image
              src={shot.src ?? ""}
              alt={shot.alt}
              fill
              sizes="94vw"
              quality={92}
              className="object-contain"
              draggable={false}
            />
          )}
        </div>
      </div>

      <div ref={bar} className="shot-viewer-bar">
        <span className="font-mono text-fine text-slate tabular-nums">
          {zoomLabel}%
        </span>
        <button
          type="button"
          className="shot-viewer-key"
          onClick={() => {
            zoomBy(0.8);
          }}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          className="shot-viewer-key"
          onClick={() => {
            zoomBy(1.25);
          }}
          aria-label="Zoom in"
        >
          +
        </button>
        <button type="button" className="shot-viewer-key" onClick={reset}>
          Reset
        </button>
        <button type="button" className="shot-viewer-key" onClick={dismiss}>
          Close
        </button>
      </div>
    </div>
  );
}
