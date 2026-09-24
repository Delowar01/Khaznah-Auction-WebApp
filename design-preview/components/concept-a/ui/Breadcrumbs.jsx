"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { useLang } from "@/components/shared/providers/LangProvider";

export function Breadcrumbs({ items, className = "" }) {
  const { ui } = useLang();
  return (
    <nav aria-label={ui("breadcrumb")} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-fg-3">
        {items.map((item, index) => (
          <li key={item.label} className={`flex items-center gap-1.5 ${item.href ? "" : "max-sm:hidden"}`}>
            {index > 0 ? <DirIcon icon={ChevronRight} className="size-3.5" /> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-fg">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-fg-2">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
