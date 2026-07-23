"use client";

import { useSyncExternalStore } from "react";

const KEY = "lz-motion";

type Override = "on" | "off" | null;

const listeners = new Set<() => void>();
let override: Override = null;
let osReduces = false;
let hydrated = false;

function emit() {
  for (const listener of listeners) listener();
}

/** Read the OS preference + any stored override. Client-only, runs once. */
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  osReduces = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stored = window.localStorage.getItem(KEY);
  override = stored === "on" || stored === "off" ? stored : null;
  window
    .matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", (event) => {
      osReduces = event.matches;
      emit();
    });
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True when full motion should play: the OS default, unless overridden. */
function snapshot(): boolean {
  if (override) return override === "on";
  return !osReduces;
}

/**
 * Whether full motion plays. Defaults to the OS `prefers-reduced-motion`
 * setting — the accessible default — but the visitor can override it from the
 * in-page toggle, so a machine with animations disabled system-wide can still
 * opt into the full experience (and vice versa). SSR renders the motion-on
 * branch so markup matches the common case.
 */
export function useMotionEnabled(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => true);
}

/** Flip the override and persist it. */
export function toggleMotion(): void {
  hydrate();
  const next = snapshot() ? "off" : "on";
  override = next;
  window.localStorage.setItem(KEY, next);
  emit();
}
