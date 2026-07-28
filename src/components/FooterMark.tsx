"use client";

import { useEffect, useRef, useState } from "react";

/** The size the mark is measured at before being scaled to fit. */
const BASE_PX = 100;

/** The treatments on offer while the choice is still open. */
const VARIANTS = [
  { id: "spot", label: "spotlight" },
  { id: "slip", label: "slip" },
  { id: "slipinv", label: "slip inverted" },
  { id: "slipspot", label: "slip + spot" },
  { id: "shred", label: "shred" },
  { id: "press", label: "letterpress" },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

/** Latin display type, one grapheme per span. */
const glyphsOf = (word: string) =>
  [...new Intl.Segmenter().segment(word)].map((part) => part.segment);

/**
 * The closing wordmark: the name drawn as an outline, answering the cursor.
 *
 * One line per name, each fitted to the full measure on its own — so the two
 * words stack and both run edge to edge, which means their sizes differ
 * slightly. That is the point: justified to the measure, the way a masthead is
 * set, rather than one line of type with a ragged second.
 *
 * Every letter is its own span carrying `--n`, how near the cursor it is from
 * 0 to 1. That one number drives every treatment from CSS, so switching
 * between them costs nothing and none of them re-render React.
 */
export function FooterMark({ text }: { text: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<VariantId>("spot");
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
      // Measured against the mark, not `offsetTop` — that reports the distance
      // to the nearest positioned ancestor, which here is the page, and a
      // twelve-thousand-pixel offset put the mask somewhere off in the void.
      const origin = el.getBoundingClientRect().top;
      for (const row of rows) {
        row.style.setProperty(
          "--ly",
          `${String(row.getBoundingClientRect().top - origin)}px`,
        );
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

    // How near each letter is to the cursor, 0 to 1. Written straight onto the
    // node: a state update per pointermove would re-render eleven spans a
    // frame for a value only CSS ever reads.
    const reach = Math.max(160, box.width * 0.16);
    for (const glyph of el.querySelectorAll<HTMLElement>("[data-mark-glyph]")) {
      const g = glyph.getBoundingClientRect();
      const dx = event.clientX - (g.left + g.width / 2);
      const dy = event.clientY - (g.top + g.height / 2);
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
      glyph.style.setProperty("--n", near.toFixed(3));
    }
  };

  const clear = () => {
    const el = root.current;
    if (!el) return;
    el.style.setProperty("--spot", "0");
    for (const glyph of el.querySelectorAll<HTMLElement>("[data-mark-glyph]")) {
      glyph.style.setProperty("--n", "0");
    }
  };

  return (
    <>
      {/* Temporary while the treatment is still being chosen — it comes out
          with the variants once one is locked in. */}
      <div className="mark-variants font-mono text-fine uppercase">
        <span className="text-slate">wordmark hover</span>
        {VARIANTS.map((option) => (
          <button
            key={option.id}
            type="button"
            data-on={option.id === variant ? "true" : "false"}
            className="mark-variant"
            onClick={() => {
              setVariant(option.id);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        ref={root}
        aria-hidden="true"
        className="footer-mark"
        data-mark-fx={variant}
        onPointerMove={move}
        onPointerEnter={(event) => {
          move(event);
          root.current?.style.setProperty("--spot", "1");
        }}
        onPointerLeave={clear}
      >
        {lines.map((line) => (
          <div key={line} data-mark-line className="footer-mark-line">
            <span className="footer-mark-layer footer-mark-base">
              {glyphsOf(line).map((glyph, index) => (
                <span
                  key={`${glyph}-${String(index)}`}
                  data-mark-glyph
                  data-glyph={glyph}
                  className="footer-mark-glyph"
                >
                  {glyph}
                </span>
              ))}
            </span>
            <span className="footer-mark-layer footer-mark-glow">
              {glyphsOf(line).map((glyph, index) => (
                <span
                  key={`${glyph}-${String(index)}`}
                  data-mark-glyph
                  data-glyph={glyph}
                  className="footer-mark-glyph"
                >
                  {glyph}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
