"use client";

import Link from "next/link";

/** Card frame with a stretched title link (the whole card is clickable). */
export function CardShell({ className = "", children }) {
  return <article className={`d-card d-panel group relative flex w-full min-w-0 flex-col overflow-hidden ${className}`}>{children}</article>;
}

export function CardTitle({ href, children, className = "" }) {
  return (
    <h3 className={`line-clamp-2 text-[14px] font-medium leading-snug text-fg sm:text-[15px] ${className}`}>
      <Link
        href={href}
        className="outline-none after:absolute after:inset-0 after:z-[1] after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[var(--focus)] focus-visible:after:outline-solid"
      >
        {children}
      </Link>
    </h3>
  );
}
