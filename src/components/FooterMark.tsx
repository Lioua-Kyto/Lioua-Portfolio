"use client";

import { useEffect, useRef } from "react";

/** The size the mark is measured at before being scaled to fit. */
const BASE_PX = 100;

/**
 * The closing wordmark: the name drawn as an outline, lit by the cursor.
 *
 * One line per name, each fitted to the full measure on its own — so the two
 * words stack and both run edge to edge, which means their sizes differ
 * slightly. That is the point: justified to the measure, the way a masthead is
 * set, rather than one line of type with a ragged second.
 *
 * Two identical layers sit on top of each other — a faint ink outline and an
 * accent one. The accent layer is masked to a soft circle that follows the
 * pointer, so what lights up is the part of the mark under the cursor rather
 * than a whole letter. The mask is driven by CSS custom properties written on
 * pointermove; nothing re-renders.
 */
export function FooterMark({ text }: { text: string }) {
  const root = useRef<HTMLDivElement>(null);
  const lines = text.split(" ");

  // Fit each line to the measure by measurement, not by a vw guess. The display
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

      const rows = el.querySelectorAll<HTMLElement>("[data-mark-line]");
      for (const row of rows) {
        row.style.setProperty("--mark-size", `${String(BASE_PX)}px`);
        // Measure the text itself, not the box around it. `scrollWidth` on the
        // container reports the container's own width whenever the text is
        // narrower than it, which pinned the ratio at 1 and left the mark stuck
        // at the base size on wide screens.
        const natural =
          row.firstElementChild?.getBoundingClientRect().width ?? 0;
        if (natural === 0) continue;
        row.style.setProperty(
          "--mark-size",
          `${String((BASE_PX * box) / natural)}px`,
        );
      }
      // The spotlight is tracked against the whole mark, so each line has to
      // know where its own top sits to offset the mask into its own box.
      for (const row of rows) {
        row.style.setProperty("--ly", `${String(row.offsetTop)}px`);
      }
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
      {lines.map((line) => (
        <div key={line} data-mark-line className="footer-mark-line">
          <span className="footer-mark-layer footer-mark-base">{line}</span>
          <span className="footer-mark-layer footer-mark-glow">{line}</span>
        </div>
      ))}
    </div>
  );
}
