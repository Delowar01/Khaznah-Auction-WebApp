"use client";

// Lets page actions open the header's panels (cart, watchlist) without
// lifting the header state into every page.
import { useEffect, useRef } from "react";

const EVENT = "c-chrome-panel";

export function openChromePanel(name) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: name }));
}

export function useChromePanelRequests(handler) {
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
