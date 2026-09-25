"use client";

import { useEffect, useState } from "react";

/**
 * True while the visitor scrolls down past `offset`; false again as soon as
 * they scroll up. Used to tuck away the secondary header rows.
 */
export function useScrollHide({ offset = 160, tolerance = 6 } = {}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - last;
        if (y < offset) {
          setHidden(false);
          last = y;
        } else if (delta > tolerance) {
          setHidden(true);
          last = y;
        } else if (delta < -tolerance) {
          setHidden(false);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [offset, tolerance]);

  return hidden;
}
