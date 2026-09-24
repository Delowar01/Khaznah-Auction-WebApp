"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";

const BTN = "d-hit grid size-10 place-items-center rounded-control border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

/** Numbered pagination with previous / next. */
export function Pagination({ page, pageCount, onChange }) {
  const { ui } = useLang();
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label={ui("pagination")} className="flex items-center gap-1.5">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label={ui("previous")} className={`${BTN} border-line-strong text-fg-2 hover:bg-surface-2`}>
        <DirIcon icon={ChevronLeft} className="size-4" />
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          aria-label={ui("page", { n })}
          className={`${BTN} d-num ${n === page ? "border-[color:var(--d-ink)] bg-primary/15 text-fg" : "border-line text-fg-2 hover:bg-surface-2"}`}
        >
          {n}
        </button>
      ))}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pageCount} aria-label={ui("next")} className={`${BTN} border-line-strong text-fg-2 hover:bg-surface-2`}>
        <DirIcon icon={ChevronRight} className="size-4" />
      </button>
    </nav>
  );
}
