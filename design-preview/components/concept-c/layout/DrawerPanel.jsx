"use client";

import { X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Echo } from "../ui/Bi";

/** Keeps drawer panels below the presentation bar (0 px when it is hidden or embedded). */
export const DRAWER_PANEL = "top-(--pbar-h)! h-[calc(100%-var(--pbar-h))]!";

/** Standard drawer body: titled header with close button, scrolling content, optional footer. */
export function DrawerPanel({ titleId, title, count, onClose, footer, testId, children }) {
  const { t, ui } = useLang();
  return (
    <div data-testid={testId} className="flex h-full flex-col bg-bg text-fg">
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-5">
        <div>
          <h2 id={titleId} className="c-h3 flex items-center gap-2.5">
            {t(title)}
            {count != null ? <span className="c-num rounded-xs bg-surface-2 px-1.5 py-0.5 text-sm font-semibold text-fg-2">{count}</span> : null}
          </h2>
          <Echo content={title} className="mt-0.5" />
        </div>
        <button type="button" onClick={onClose} aria-label={ui("close")} className="c-iconbtn -me-2 shrink-0 text-fg-2">
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      {footer ? <div className="border-t border-line bg-surface px-5 py-4">{footer}</div> : null}
    </div>
  );
}
