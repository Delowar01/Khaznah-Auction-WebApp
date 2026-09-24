"use client";

import { X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Echo } from "./Bi";
import { Diamond } from "./Diamond";
import { cx } from "./cx";

/** Panel styling shared by the concept's modals and sheets. */
export const DIALOG_PANEL = "max-h-[calc(100dvh-var(--pbar-h)-1.5rem)]! rounded-t-lg border border-line bg-elevated text-fg shadow-overlay md:rounded-lg";

/** Visible dialog title (pair with Modal's `labelledBy`) and a close button. */
export function DialogHeader({ id, title, eyebrow, onClose, className = "" }) {
  const { t, ui } = useLang();
  return (
    <div className={cx("flex items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-5 sm:px-7 sm:pt-6", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="c-eyebrow mb-2">
            <Diamond size={6} className="text-accent" />
            {t(eyebrow)}
          </p>
        ) : null}
        <h2 id={id} className="c-h3 text-[1.375rem]">
          {typeof title === "string" ? title : t(title)}
        </h2>
        {typeof title === "object" ? <Echo content={title} className="mt-1" /> : null}
      </div>
      <button type="button" onClick={onClose} aria-label={ui("close")} className="c-iconbtn -me-2 -mt-1 shrink-0 text-fg-2">
        <X aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}
