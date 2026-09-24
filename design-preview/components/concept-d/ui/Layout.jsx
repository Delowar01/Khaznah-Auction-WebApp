"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DirIcon } from "@/components/shared/ui/DirIcon";

/** Page-width container: 16px gutters on phones, 1320px max. */
export function Container({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </Tag>
  );
}

/** Section heading row: eyebrow label, title, supporting line, action. */
export function SectionHeader({ id, eyebrow, title, text, action, live = false, className = "" }) {
  return (
    <div className={`mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-8 ${className}`}>
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className="d-label mb-2.5 flex items-center gap-2 text-fg-3">
            {live ? <span aria-hidden="true" className="kz-live-dot" /> : <span aria-hidden="true" className="h-px w-5 bg-[var(--d-ink)]" />}
            {eyebrow}
          </p>
        ) : null}
        <h2 id={id} className="d-tight text-2xl font-semibold text-fg text-balance md:text-[28px]">
          {title}
        </h2>
        {text ? <p className="mt-2 max-w-xl text-[15px] text-fg-2 text-pretty">{text}</p> : null}
      </div>
      {action}
    </div>
  );
}

/** "View all →" style link. */
export function ArrowLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`group inline-flex h-10 shrink-0 items-center gap-1.5 rounded-control px-3 text-sm font-medium d-ink transition-colors hover:bg-surface-2 ${className}`}
    >
      {children}
      <DirIcon icon={ArrowRight} className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}

/** Labelled figure: small label over a monospaced value. */
export function Stat({ label, value, sub, className = "", valueClassName = "text-lg" }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="d-label truncate text-fg-3">{label}</p>
      <p className={`d-num mt-1 font-medium text-fg ${valueClassName}`}>{value}</p>
      {sub ? <p className="mt-0.5 text-xs text-fg-3">{sub}</p> : null}
    </div>
  );
}

/** Keyboard hint. */
export function Kbd({ children, className = "" }) {
  return (
    <kbd className={`d-num inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-line-strong bg-surface px-1 text-[10.5px] font-medium text-fg-3 ${className}`} dir="ltr">
      {children}
    </kbd>
  );
}
