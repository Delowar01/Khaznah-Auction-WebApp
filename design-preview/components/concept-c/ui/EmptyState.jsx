"use client";

import { cx } from "./cx";

/** Geometric illustration built from CSS diamonds — no clip-art. */
export function DiamondsArt({ className = "" }) {
  return (
    <div aria-hidden="true" className={cx("relative mx-auto size-40", className)}>
      <span className="c-gridlines rounded-full" style={{ "--grid": "1.25rem", "--grid-mask": "radial-gradient(closest-side, black 40%, transparent)" }} />
      <span className="absolute inset-[17%] rotate-45 border border-line-strong" />
      <span className="absolute inset-[31%] rotate-45 border border-dashed border-line-strong" />
      <span className="absolute start-[58%] top-[18%] size-5 rotate-45 border border-primary/50" />
      <span className="absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent" />
    </div>
  );
}

/** Empty state: illustration, title, text and actions. */
export function EmptyState({ title, text, titleAs: Title = "h2", children, className = "" }) {
  return (
    <div className={cx("flex flex-col items-center px-6 py-14 text-center", className)}>
      <DiamondsArt />
      <Title className="c-h3 mt-6">{title}</Title>
      {text ? <p className="c-prose mt-2 max-w-md">{text}</p> : null}
      {children ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </div>
  );
}
