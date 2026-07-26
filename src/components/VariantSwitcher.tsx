"use client";

import { useEffect, useState } from "react";

/**
 * TEMPORARY — a switcher for choosing between palette and layout options.
 *
 * Both axes are attributes on the root element: `data-theme` swaps the colour
 * tokens, `data-toolkit` swaps the Toolkit section's layout. Nothing else in
 * the app knows this exists, so removing it is deleting this file, its mount in
 * `page.tsx`, and the two variant blocks in `tokens.css` / `globals.css`.
 *
 * The choice persists in localStorage so a reload keeps whatever is being
 * evaluated.
 */
const THEMES = [
  { id: "", label: "Paper" },
  { id: "bone", label: "Bone" },
  { id: "ink", label: "Ink" },
  { id: "cobalt", label: "Cobalt" },
] as const;

const TOOLKITS = [
  { id: "", label: "Cards" },
  { id: "ruled", label: "Ruled" },
] as const;

export function VariantSwitcher() {
  const [theme, setTheme] = useState("");
  const [toolkit, setToolkit] = useState("");
  // Collapsed by default: expanded, it sits exactly where the hero's hook line
  // is, which is one of the things being evaluated.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTheme(localStorage.getItem("variant-theme") ?? "");
    setToolkit(localStorage.getItem("variant-toolkit") ?? "");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.dataset.theme = theme;
    else delete root.dataset.theme;
    localStorage.setItem("variant-theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (toolkit) root.dataset.toolkit = toolkit;
    else delete root.dataset.toolkit;
    localStorage.setItem("variant-toolkit", toolkit);
  }, [toolkit]);

  return (
    <div className="variant-switcher" aria-label="Design variants">
      <button
        type="button"
        className="variant-key self-end"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
        }}
      >
        {open ? "Hide" : "Variants"}
      </button>

      {!open ? null : (
        <>
          <div className="variant-row">
            <span className="font-mono text-fine text-slate uppercase">
              Palette
            </span>
            {THEMES.map((option) => (
              <button
                key={option.id || "default"}
                type="button"
                className="variant-key"
                data-on={theme === option.id ? "true" : "false"}
                onClick={() => {
                  setTheme(option.id);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="variant-row">
            <span className="font-mono text-fine text-slate uppercase">
              Toolkit
            </span>
            {TOOLKITS.map((option) => (
              <button
                key={option.id || "default"}
                type="button"
                className="variant-key"
                data-on={toolkit === option.id ? "true" : "false"}
                onClick={() => {
                  setToolkit(option.id);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
