"use client";

import { useCallback, useId, useRef, useState } from "react";
import { useDismiss } from "@/components/shared/ui/hooks";

/**
 * Small anchored panel (account, wishlist, city, categories). The trigger is
 * rendered by the caller: `trigger({ open, toggle, panelId })`. Escape and a
 * click outside close it; `children(close)` renders the panel content.
 */
export function Popover({ label, trigger, children, className = "", panelClassName = "", align = "end" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  useDismiss(open, close, ref);
  return (
    <div ref={ref} className={`relative ${className}`}>
      {trigger({ open, toggle, panelId })}
      {open ? (
        <div id={panelId} role="dialog" aria-label={label} className={`absolute top-[calc(100%+10px)] z-50 ${align === "end" ? "end-0" : "start-0"} ${panelClassName}`}>
          {children(close)}
        </div>
      ) : null}
    </div>
  );
}
