"use client";

import { cx } from "../ui/cx";

/** Board section: numbered title, optional note, content card. */
export function SystemSection({ id, index, title, note, children, className = "" }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cx("scroll-mt-44", className)}>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="kb-sm font-extrabold text-primary tabular">{String(index).padStart(2, "0")}</span>
        <div>
          <h2 id={`${id}-title`} className="kb-h2 text-fg">
            {title}
          </h2>
          {note ? <p className="mt-0.5 kb-sm text-fg-2">{note}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

/** Labelled cell used across the board (state name above the specimen). */
export function Specimen({ label, children, className = "" }) {
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <p className="kb-eyebrow text-fg-3">{label}</p>
      {children}
    </div>
  );
}

/** White board panel. */
export function Panel({ children, className = "" }) {
  return <div className={cx("rounded-xl border border-line bg-surface p-5 sm:p-6", className)}>{children}</div>;
}
