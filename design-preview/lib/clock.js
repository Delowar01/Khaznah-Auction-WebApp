"use client";

// One shared 1-second clock for every countdown on the page.
//
// Hydration-safe: the server snapshot (and therefore the first client render)
// reports 0 elapsed seconds, so countdowns render identically on the server
// and during hydration, then tick. Mock end times are expressed relative to
// page load ("endsIn" seconds), so remaining = endsIn - elapsed.
import { useSyncExternalStore } from "react";

let startedAt = null;
let elapsed = 0;
let timer = null;
const listeners = new Set();

function tick() {
  const next = Math.floor((performance.now() - startedAt) / 1000);
  if (next !== elapsed) {
    elapsed = next;
    listeners.forEach((listener) => listener());
  }
}

function subscribe(listener) {
  if (startedAt === null) startedAt = performance.now();
  listeners.add(listener);
  if (!timer) timer = window.setInterval(tick, 250);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => elapsed;
const getServerSnapshot = () => 0;

/** Whole seconds since the preview was opened in this tab. */
export function useElapsed() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Seconds remaining for a relative deadline (never negative). */
export function useRemaining(endsIn) {
  const now = useElapsed();
  if (endsIn == null) return null;
  return Math.max(0, endsIn - now);
}

export const URGENT_SECONDS = 60 * 60; // under an hour → "ending soon"
export const CRITICAL_SECONDS = 10 * 60; // under ten minutes → "closing now"

export function urgencyOf(remaining) {
  if (remaining == null) return "none";
  if (remaining <= 0) return "ended";
  if (remaining <= CRITICAL_SECONDS) return "critical";
  if (remaining <= URGENT_SECONDS) return "urgent";
  return "normal";
}
