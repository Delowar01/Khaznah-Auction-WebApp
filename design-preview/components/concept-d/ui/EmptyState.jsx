"use client";

import { PackageSearch } from "lucide-react";
import { cx } from "./cx";

/** Friendly empty state with an icon medallion, copy and actions. */
export function EmptyState({ icon: Icon = PackageSearch, title, text, children, className = "", compact = false }) {
  return (
    <div className={cx("flex flex-col items-center text-center", compact ? "px-4 py-8" : "px-6 py-14", className)}>
      <div className="relative mb-5 grid size-20 place-items-center">
        <span aria-hidden="true" className="absolute inset-0 rounded-full border border-dashed border-line-strong" />
        <span aria-hidden="true" className="absolute inset-2.5 rounded-full bg-primary/10" />
        <Icon aria-hidden="true" className="relative size-8 text-primary" strokeWidth={1.75} />
      </div>
      <p className="kb-h3 text-fg">{title}</p>
      {text ? <p className="mt-2 max-w-md kb-md text-fg-2">{text}</p> : null}
      {children ? <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{children}</div> : null}
    </div>
  );
}
