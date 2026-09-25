"use client";

import { CircleHelp, Eye } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/data/categories";
import { SOURCE_TYPES, ITEM_TYPES } from "@/data/grades";
import { GradeChip } from "../ui/GradeChip";
import { cx } from "../ui/cx";
import { BrowseLink } from "../utils/navigation";

/** Category · lot number, H1 title, grade chip with guide link, source and watchers. */
export function LotHead({ product, onGradeGuide, watchers, status, className = "" }) {
  const { t, ui, pl } = useLang();
  const category = getCategory(product.category);
  return (
    <div className={cx("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 kb-xs">
        <BrowseLink href={`/browse?category=${category.slug}`} className="font-bold text-primary underline-offset-4 hover:underline">
          {t(category.name)}
        </BrowseLink>
        <span aria-hidden="true" className="text-fg-3">
          ·
        </span>
        <span className="text-fg-3">
          {ui("lotNumber")}{" "}
          <span dir="ltr" className="font-semibold text-fg-2 tabular">
            {product.lot}
          </span>
        </span>
        {status}
      </div>
      <h1 className="kb-h1 text-balance text-fg">{t(product.title)}</h1>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <GradeChip grade={product.grade} size="md" />
        <button
          type="button"
          onClick={onGradeGuide}
          className="inline-flex items-center gap-1 rounded-sm kb-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          <CircleHelp aria-hidden="true" className="size-4" />
          {ui("whatGradeMeans")}
        </button>
        <span aria-hidden="true" className="text-fg-3">
          ·
        </span>
        <span className="kb-sm text-fg-2">{product.itemType === "single" ? t(SOURCE_TYPES[product.source]) : t(ITEM_TYPES[product.itemType])}</span>
        {watchers ? (
          <span className="inline-flex items-center gap-1 kb-sm text-fg-3">
            <Eye aria-hidden="true" className="size-4" />
            {pl("watching", watchers)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
