"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { cx } from "./cx";

function pageList(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set([1, count, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const out = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}

const STEP = "inline-flex h-10 items-center gap-1.5 rounded-control border border-line bg-surface px-3 kb-sm font-semibold text-fg transition-colors hover:border-line-strong hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40";

/** Numbered pagination with previous / next. */
export function Pagination({ page, pageCount, onChange, className = "" }) {
  const { ui } = useLang();
  if (pageCount <= 1) return null;
  return (
    <nav aria-label={ui("pagination")} className={cx("flex items-center justify-center gap-2", className)}>
      <button type="button" className={STEP} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label={ui("previous")}>
        <DirIcon icon={ChevronLeft} className="size-4" />
        <span className="hidden sm:inline">{ui("previous")}</span>
      </button>
      <ul className="flex items-center gap-1">
        {pageList(page, pageCount).map((p) =>
          typeof p === "string" ? (
            <li key={p} aria-hidden="true" className="w-6 text-center text-fg-3">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={ui("page", { n: p })}
                className={cx(
                  "grid size-10 place-items-center rounded-control kb-sm font-bold tabular transition-colors",
                  p === page ? "bg-primary text-on-primary shadow-card" : "text-fg-2 hover:bg-surface-2 hover:text-fg",
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>
      <button type="button" className={STEP} disabled={page >= pageCount} onClick={() => onChange(page + 1)} aria-label={ui("next")}>
        <span className="hidden sm:inline">{ui("next")}</span>
        <DirIcon icon={ChevronRight} className="size-4" />
      </button>
    </nav>
  );
}
