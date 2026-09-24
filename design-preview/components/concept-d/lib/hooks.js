"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/components/shared/ui/hooks";

const noopSubscribe = () => () => {};

/** True on Apple platforms (⌘K hint); false on the server and during hydration. */
export function useIsMac() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || ""),
    () => false,
  );
}

/** Element width via ResizeObserver (starts from `initial` for SSR). */
export function useMeasure(initial = 320) {
  const ref = useRef(null);
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver((entries) => {
      const next = Math.round(entries[0].contentRect.width);
      if (next > 0) setWidth(next);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

/** True while the element is (at least partly) on screen. */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(true);
  const { rootMargin = "0px", threshold = 0 } = options;
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin, threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);
  return [ref, inView];
}

/** Eases a number towards its new value (bid tweens). Instant with reduced motion. */
export function useTween(value, duration = 450) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return undefined;
    let frame = 0;
    const began = performance.now();
    const step = (now) => {
      const t = reduced ? 1 : Math.min(1, (now - began) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (t < 1) frame = requestAnimationFrame(step);
      else from.current = value;
    };
    frame = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(frame);
      from.current = value;
    };
  }, [value, duration, reduced]);
  return display;
}

/**
 * Counts how many times `value` has changed since mount (0 on first render),
 * so a flash animation can be keyed to real changes only.
 */
export function useChangeCount(value) {
  const [state, setState] = useState({ value, count: 0 });
  if (state.value !== value) {
    setState({ value, count: state.count + 1 });
    return state.count + 1;
  }
  return state.count;
}

/** Current light/dark appearance of the concept (client only). */
export function useAppearance() {
  return useSyncExternalStore(
    (callback) => {
      const observer = new MutationObserver(callback);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => observer.disconnect();
    },
    () => document.documentElement.dataset.theme || "dark",
    () => "dark",
  );
}
