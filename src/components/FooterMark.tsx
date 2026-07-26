"use client";

import { useRef } from "react";

/**
 * The closing wordmark: the name drawn as an outline, lit by the cursor.
 *
 * Two identical layers sit on top of each other — a faint ink outline and an
 * accent one. The accent layer is masked to a soft circle that follows the
 * pointer, so what lights up is the part of the mark under the cursor rather
 * than a whole letter. The mask is driven by CSS custom properties written on
 * pointermove; nothing re-renders.
 */
export function FooterMark({ text }: { text: string }) {
  const root = useRef<HTMLDivElement>(null);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = root.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${String(event.clientX - box.left)}px`);
    el.style.setProperty("--my", `${String(event.clientY - box.top)}px`);
  };

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="footer-mark"
      onPointerMove={move}
      onPointerEnter={(event) => {
        move(event);
        root.current?.style.setProperty("--spot", "1");
      }}
      onPointerLeave={() => {
        root.current?.style.setProperty("--spot", "0");
      }}
    >
      <span className="footer-mark-layer footer-mark-base">{text}</span>
      <span className="footer-mark-layer footer-mark-glow">{text}</span>
    </div>
  );
}
