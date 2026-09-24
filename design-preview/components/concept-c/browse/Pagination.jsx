"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { cx } from "../ui/cx";

/** Numbered pagination with previous / next; the current page carries a diamond. */
export function Pagination({ page, pageCount, onChange, className = "" }) {
  const { ui } = useLang();
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const btn = "grid h-11 min-w-11 place-items-center rounded-control border px-3 text-sm font-semibold transition-colors";
  return (
    <nav aria-label={ui("pagination")} className={className}>
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label={ui("previous")} className={cx(btn, "border-line-strong text-fg hover:border-fg disabled:opacity-40")}>
            <DirIcon icon={ChevronLeft} className="size-4" />
          </button>
        </li>
        {pages.map((n) => (
          <li key={n}>
            <button
              type="button"
              onClick={() => onChange(n)}
              aria-current={n === page ? "page" : undefined}
              aria-label={ui("page", { n })}
              className={cx(btn, "c-num relative", n === page ? "border-secondary bg-secondary text-on-secondary" : "border-line-strong text-fg hover:border-fg")}
            >
              {n}
              {n === page ? <span aria-hidden="true" className="absolute -bottom-[5px] left-1/2 size-2 -translate-x-1/2 rotate-45 bg-accent" /> : null}
            </button>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pageCount} aria-label={ui("next")} className={cx(btn, "border-line-strong text-fg hover:border-fg disabled:opacity-40")}>
            <DirIcon icon={ChevronRight} className="size-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
