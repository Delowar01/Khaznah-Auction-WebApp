"use client";

// Header search, nav and category links can target the Browse page while it
// is already open. The route doesn't remount on a query-only navigation, so
// those links announce an "intent" that the open Browse page applies.
import { useEffect, useRef } from "react";

const EVENT = "c-browse-intent";

export function isBrowsePath(pathname = "") {
  return /\/concept-c\/browse\/?$/.test(pathname);
}

/** Turns "/browse?tab=auction&category=x&search=y" into an intent object. */
export function intentFromHref(href = "") {
  const query = href.includes("?") ? href.slice(href.indexOf("?") + 1) : "";
  const params = new URLSearchParams(query);
  return {
    tab: params.get("tab") || "all",
    category: params.get("category") || null,
    search: params.get("search") || "",
  };
}

export function emitBrowseIntent(intent) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: intent }));
}

export function useBrowseIntent(handler) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const listener = (event) => ref.current?.(event.detail);
    window.addEventListener(EVENT, listener);
    return () => window.removeEventListener(EVENT, listener);
  }, []);
}
