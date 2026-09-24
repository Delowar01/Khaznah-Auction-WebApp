"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { cx } from "./cx";

/** Scroll state for a horizontal rail; `next()` moves forward in reading direction. */
export function useScroller() {
  const [node, setNode] = useState(null);
  const { isRTL } = useLang();
  const step = (dir) => {
    if (!node) return;
    node.scrollBy({ left: node.clientWidth * 0.8 * dir * (isRTL ? -1 : 1), behavior: "smooth" });
  };
  return { setNode, prev: () => step(-1), next: () => step(1) };
}

/** Previous / next buttons. Pass the display utilities in `className` (default "flex"). */
export function ScrollerControls({ scroller, className = "flex" }) {
  const { ui } = useLang();
  return (
    <div className={cx("gap-2", className)}>
      <button type="button" onClick={scroller.prev} aria-label={ui("previous")} className="c-btn c-btn--outline c-btn--icon">
        <DirIcon icon={ArrowLeft} className="size-4" />
      </button>
      <button type="button" onClick={scroller.next} aria-label={ui("next")} className="c-btn c-btn--outline c-btn--icon">
        <DirIcon icon={ArrowRight} className="size-4" />
      </button>
    </div>
  );
}

/** Contained horizontal rail that bleeds to the screen edge on small screens. */
export function Scroller({ nodeRef, label, className = "", children }) {
  return (
    <div
      ref={nodeRef}
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cx("c-scroller -mx-4 scroll-px-4 px-4 pb-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0", className)}
    >
      {children}
    </div>
  );
}
