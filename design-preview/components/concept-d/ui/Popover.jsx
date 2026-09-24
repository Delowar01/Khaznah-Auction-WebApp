"use client";

import { useCallback, useId, useRef, useState } from "react";
import { useDismiss } from "@/components/shared/ui/hooks";

/**
 * Anchored panel (account and wallet menus). `button` receives the trigger
 * props; `children` may be a function receiving { close }.
 */
export function Popover({ button, children, align = "end", panelClassName = "", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {button({
        open,
        onClick: () => setOpen((value) => !value),
        "aria-expanded": open,
        "aria-controls": open ? id : undefined,
      })}
      {open ? (
        <div
          id={id}
          className={`kz-fade-up absolute top-[calc(100%+10px)] z-50 ${align === "end" ? "end-0" : "start-0"} rounded-xl border border-line-strong bg-elevated shadow-overlay ${panelClassName}`}
        >
          {typeof children === "function" ? children({ close }) : children}
        </div>
      ) : null}
    </div>
  );
}
