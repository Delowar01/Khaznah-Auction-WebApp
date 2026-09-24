"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";

/** Media query hook; returns `fallback` on the server and during hydration. */
export function useMediaQuery(query, fallback = false) {
  const subscribe = useCallback(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => fallback);
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

/**
 * Gallery state: active index, next/previous (direction-aware for RTL),
 * keyboard arrows and touch swipe.
 */
export function useGallery(count) {
  const { isRTL } = useLang();
  const [index, setIndex] = useState(0);
  const touch = useRef(null);

  const go = useCallback((next) => setIndex(((next % count) + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowRight") (isRTL ? prev : next)();
      if (event.key === "ArrowLeft") (isRTL ? next : prev)();
    },
    [isRTL, next, prev],
  );

  const swipeHandlers = {
    onTouchStart: (event) => {
      touch.current = event.touches[0].clientX;
    },
    onTouchEnd: (event) => {
      if (touch.current == null) return;
      const dx = event.changedTouches[0].clientX - touch.current;
      touch.current = null;
      if (Math.abs(dx) < 40) return;
      const forward = isRTL ? dx > 0 : dx < 0;
      (forward ? next : prev)();
    },
  };

  return { index, setIndex: go, next, prev, onKeyDown, swipeHandlers };
}

/** Closes a popover on outside pointer-down and Escape. */
export function useDismiss(open, onClose, ref) {
  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose();
    };
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, ref]);
}

/** True once the component has hydrated on the client. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
