"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { useLang } from "@/components/shared/providers/LangProvider";

export function Breadcrumbs({ items, className = "" }) {
  const { ui } = useLang();
  return (
    <nav aria-label={ui("breadcrumb")} className={className}>
      <ol className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-fg-3">
        {items.map((item, index) => (
          <li key={item.label} className="flex min-w-0 items-center gap-1.5">
            {index > 0 ? <DirIcon icon={ChevronRight} className="size-3.5 shrink-0 opacity-60" /> : null}
            {item.href ? (
              <Link href={item.href} className="rounded-sm transition-colors hover:text-fg">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="max-w-[16rem] truncate text-fg-2 sm:max-w-md">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
