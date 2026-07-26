"use client";

import { useEffect, useRef } from "react";

/** The size the mark is measured at before being scaled to fit. */
const BASE_PX = 100;

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

  // Fit the mark to the measure by measurement, not by a vw guess. The display
  // face has an optical-size axis, so its glyphs widen as the size drops and no
  // single clamp holds across viewports — at phone widths the guess overflowed
  // the page. Measuring at a fixed size and scaling from the result is exact.
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const fit = () => {
      const parent = el.parentElement;
      if (!parent) return;
      // The content box, not the border box: the gutter padding is not space
      // the mark is allowed to use.
      const cs = getComputedStyle(parent);
      const box =
        parent.clientWidth -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      if (box <= 0) return;
      el.style.setProperty("--mark-size", `${String(BASE_PX)}px`);
      // Measure the text itself, not the box around it. `scrollWidth` on the
      // container reports the container's own width whenever the text is
      // narrower than it, which pinned the ratio at 1 and left the mark stuck
      // at the base size on wide screens.
      const natural = el.firstElementChild?.getBoundingClientRect().width ?? 0;
      if (natural === 0) return;
      el.style.setProperty(
        "--mark-size",
        `${String((BASE_PX * box) / natural)}px`,
      );
    };

    fit();
    const observer = new ResizeObserver(fit);
    if (el.parentElement) observer.observe(el.parentElement);
    // Webfonts land after first paint and change the metrics.
    void document.fonts.ready.then(fit);
    return () => {
      observer.disconnect();
    };
  }, [text]);

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
