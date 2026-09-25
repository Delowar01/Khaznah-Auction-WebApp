"use client";

import { useLayoutEffect } from "react";

/**
 * Marks <html data-r3> while a Round 3 home page is mounted, so the Round 3
 * design tokens (styles/r3-*.css) apply to the page and to anything it
 * portals (dialogs, drawers, toasts). The pre-paint script in the root
 * layout sets the same attribute on first load, so there is no flash.
 */
export function R3Root({ children }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.r3 = "1";
    return () => {
      delete root.dataset.r3;
    };
  }, []);
  return children;
}
