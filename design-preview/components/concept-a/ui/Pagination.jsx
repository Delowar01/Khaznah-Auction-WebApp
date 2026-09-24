"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";

/** Numbered pagination with previous/next. */
export function Pagination({ page, pageCount, onChange, className = "" }) {
  const { ui } = useLang();
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const arrow = "grid size-11 place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 disabled:text-fg-3 disabled:hover:bg-transparent";
  return (
    <nav aria-label={ui("pagination")} className={`flex items-center gap-1 ${className}`}>
      <button type="button" className={arrow} onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label={ui("previous")}>
        <DirIcon icon={ChevronLeft} className="size-4" />
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          aria-label={ui("page", { n })}
          className={`a-serif grid size-11 place-items-center rounded-full text-[18px] tabular transition-colors ${n === page ? "bg-secondary text-on-secondary" : "text-fg-2 hover:bg-surface-2 hover:text-fg"}`}
        >
          {n}
        </button>
      ))}
      <button type="button" className={arrow} onClick={() => onChange(page + 1)} disabled={page >= pageCount} aria-label={ui("next")}>
        <DirIcon icon={ChevronRight} className="size-4" />
      </button>
    </nav>
  );
}
