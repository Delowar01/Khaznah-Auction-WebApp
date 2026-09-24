"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { cx } from "./cx";

/** Breadcrumb trail; the last item is the current page. Items: { label, href }. */
export function Breadcrumbs({ items, className = "" }) {
  const { ui } = useLang();
  return (
    <nav aria-label={ui("breadcrumb")} className={cx("min-w-0", className)}>
      <ol className="no-scrollbar flex items-center gap-1 overflow-x-auto whitespace-nowrap kb-xs text-fg-3">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={cx("flex items-center gap-1", last && "min-w-0")}>
              {item.href && !last ? (
                <Link href={item.href} className="rounded-sm font-medium text-fg-2 underline-offset-4 hover:text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cx(last && "truncate text-fg-3")}>
                  {item.label}
                </span>
              )}
              {!last ? <DirIcon icon={ChevronRight} className="size-3.5 shrink-0 text-fg-3" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
