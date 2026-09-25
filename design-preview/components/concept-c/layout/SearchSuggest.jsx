"use client";

import { ArrowDown, ArrowUp, LayoutGrid, Search, TrendingUp } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { getCategory } from "@/data/categories";
import { isAuction } from "@/data/products";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

function Highlight({ text, query }) {
  const q = query.trim();
  const at = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent font-extrabold text-fg">{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  );
}

function LotOption({ product, query }) {
  const { t, ui } = useLang();
  const auction = isAuction(product);
  return (
    <>
      <Plate image={product.images[0]} alt="" sizes="48px" pad="p-1" className="size-11 shrink-0 rounded-md border border-line" />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-1 kb-sm font-medium text-fg-2">
          <Highlight text={t(product.title)} query={query} />
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 kb-xs text-fg-3">
          <GradeChip grade={product.grade} />
          <span className="truncate">{t(getCategory(product.category)?.name)}</span>
        </span>
      </span>
      <span className="shrink-0 text-end">
        <span className="block kb-2xs text-fg-3">{auction ? ui("currentBid") : ui("price")}</span>
        <Money value={auction ? product.currentBid : product.price} className="kb-sm font-bold text-fg" />
      </span>
    </>
  );
}

/** The autocomplete listbox under the header search. */
export function SearchSuggest({ id, listId, groups, active, setActive, onPick, query }) {
  const { t, ui } = useLang();
  // Flat option index where each group starts (keyboard order).
  const starts = groups.map((_, gi) => groups.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0));
  return (
    <div className="kb-focus-reset kz-fade-up absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-line bg-elevated text-fg shadow-overlay">
      <div id={listId} role="listbox" aria-label={ui("suggestedLots")} className="max-h-[min(68vh,540px)] overflow-y-auto overscroll-contain p-2">
        {groups.map((group, gi) => (
          <div key={group.key} role="group" aria-label={group.label || undefined} className="py-1">
            {group.label ? (
              <p aria-hidden="true" className="px-2 pb-1.5 pt-1 kb-eyebrow text-fg-3">
                {group.label}
              </p>
            ) : null}
            <div className={group.layout === "chips" ? "flex flex-wrap gap-1.5 px-2 pb-2" : "grid gap-0.5"}>
              {group.items.map((item, ii) => {
                const i = starts[gi] + ii;
                const selected = i === active;
                return (
                  <div
                    key={item.id}
                    id={`${id}-opt-${i}`}
                    role="option"
                    aria-selected={selected}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => onPick(item)}
                    className={cx(
                      "cursor-pointer transition-colors",
                      group.layout === "chips"
                        ? cx("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 kb-sm font-medium", selected ? "border-primary bg-primary/10 text-primary" : "border-line text-fg-2")
                        : cx("flex items-center gap-3 rounded-lg px-2 py-1.5", selected ? "bg-surface-2" : ""),
                    )}
                  >
                    {item.kind === "popular" ? (
                      <>
                        <TrendingUp aria-hidden="true" className="size-3.5 text-fg-3" />
                        {item.label}
                      </>
                    ) : item.kind === "category" ? (
                      <>
                        <Plate image={item.category.image} alt="" sizes="40px" pad="p-1" className="size-9 shrink-0 rounded-md" />
                        <span className="flex-1 kb-sm font-semibold">
                          <Highlight text={item.label} query={query} />
                        </span>
                        <LayoutGrid aria-hidden="true" className="size-4 text-fg-3" />
                      </>
                    ) : item.kind === "lot" ? (
                      <LotOption product={item.product} query={query} />
                    ) : (
                      <>
                        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                          <Search aria-hidden="true" className="size-4" />
                        </span>
                        <span className="flex-1 kb-sm font-semibold text-primary">{item.label}</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p aria-hidden="true" className="hidden items-center gap-1.5 border-t border-line bg-surface-2 px-3 py-2 kb-2xs text-fg-3 lg:flex">
        <ArrowUp className="size-3" />
        <ArrowDown className="size-3" />
        {t(COPY.keyHints)}
      </p>
    </div>
  );
}
