"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string };

/**
 * A zoom-and-pan window for a capture — the same control a diagram viewer
 * needs, so architecture diagrams can be dropped straight in later.
 *
 * Wheel (or pinch) zooms toward the pointer, drag pans, double-click toggles
 * between fit and 2x, and the zoom is clamped so the image can never be lost
 * off-screen. The transform lives in a ref and is written to the node
 * directly: a pointermove that re-rendered React on every frame would drop
 * frames on a large capture.
 */
export function ShotViewer({
  shot,
  onClose,
}: {
  shot: Shot | null;
  onClose: () => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const view = useRef({ scale: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [zoomLabel, setZoomLabel] = useState(100);

  const paint = useCallback(() => {
    const el = frame.current;
    if (!el) return;
    const { scale, x, y } = view.current;
    el.style.transform = `translate3d(${String(x)}px, ${String(y)}px, 0) scale(${String(scale)})`;
    setZoomLabel(Math.round(scale * 100));
  }, []);

  const reset = useCallback(() => {
    view.current = { scale: 1, x: 0, y: 0 };
    paint();
  }, [paint]);

  // Clamp the pan so at least part of the image stays over the stage.
  const clamp = useCallback(() => {
    const box = stage.current?.getBoundingClientRect();
    if (!box) return;
    const limitX = (box.width * (view.current.scale - 1)) / 2;
    const limitY = (box.height * (view.current.scale - 1)) / 2;
    view.current.x = Math.max(-limitX, Math.min(limitX, view.current.x));
    view.current.y = Math.max(-limitY, Math.min(limitY, view.current.y));
  }, []);

  const zoomBy = useCallback(
    (factor: number, originX = 0, originY = 0) => {
      const next = Math.max(1, Math.min(6, view.current.scale * factor));
      const ratio = next / view.current.scale;
      // Keep the point under the cursor fixed as the scale changes.
      view.current.x = originX - (originX - view.current.x) * ratio;
      view.current.y = originY - (originY - view.current.y) * ratio;
      view.current.scale = next;
      if (next === 1) view.current = { scale: 1, x: 0, y: 0 };
      clamp();
      paint();
    },
    [clamp, paint],
  );

  useEffect(() => {
    if (!shot) return;
    reset();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "+" || event.key === "=") zoomBy(1.25);
      if (event.key === "-") zoomBy(0.8);
      if (event.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    // The page scroller must not run underneath the open viewer.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [shot, onClose, reset, zoomBy]);

  if (!shot) return null;

  return (
    <div
      className="shot-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
    >
      <button
        type="button"
        className="shot-viewer-scrim"
        aria-label="Close the viewer"
        onClick={onClose}
      />

      <div
        ref={stage}
        className="shot-viewer-stage"
        onWheel={(event) => {
          const box = stage.current?.getBoundingClientRect();
          if (!box) return;
          zoomBy(
            event.deltaY < 0 ? 1.12 : 0.89,
            event.clientX - box.left - box.width / 2,
            event.clientY - box.top - box.height / 2,
          );
        }}
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
          clamp();
          paint();
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        <div ref={frame} className="shot-viewer-frame">
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="94vw"
            quality={92}
            className="object-contain"
            draggable={false}
          />
        </div>
      </div>

      <div className="shot-viewer-bar">
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
        <button type="button" className="shot-viewer-key" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
