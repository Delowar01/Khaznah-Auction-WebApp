"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { cx } from "./cx";

/**
 * Scroll state + direction-aware paging for a horizontal rail.
 * Usage: const { trackRef, ...rail } = useRail();
 *        <RailControls rail={rail} /> <RailTrack trackRef={trackRef}>…</RailTrack>
 */
export function useRail() {
  const ref = useRef(null);
  const { isRTL } = useLang();
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setEdges({ atStart: pos <= 4, atEnd: pos >= max - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const page = useCallback(
    (dir) => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollBy({ left: el.clientWidth * 0.86 * dir * (isRTL ? -1 : 1), behavior: reduce ? "auto" : "smooth" });
    },
    [isRTL],
  );

  return { trackRef: ref, canPrev: !edges.atStart, canNext: !edges.atEnd, prev: () => page(-1), next: () => page(1) };
}

const CONTROL =
  "grid size-9 place-items-center rounded-full border border-line bg-surface text-fg shadow-card transition-[opacity,background-color] hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-35";

/** Previous / next buttons for a rail (sit in the section header). */
export function RailControls({ rail, className = "" }) {
  const { ui } = useLang();
  return (
    <div className={cx("hidden items-center gap-1.5 md:flex", className)}>
      <button type="button" className={CONTROL} onClick={rail.prev} disabled={!rail.canPrev} aria-label={ui("previous")}>
        <DirIcon icon={ChevronLeft} className="size-4" />
      </button>
      <button type="button" className={CONTROL} onClick={rail.next} disabled={!rail.canNext} aria-label={ui("next")}>
        <DirIcon icon={ChevronRight} className="size-4" />
      </button>
    </div>
  );
}

/** The scrolling track. Bleeds to the screen edge on small screens. */
export function RailTrack({ trackRef, label, className = "", children }) {
  return (
    <ul
      ref={trackRef}
      aria-label={label}
      className={cx("kb-rail no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0", className)}
    >
      {children}
    </ul>
  );
}
