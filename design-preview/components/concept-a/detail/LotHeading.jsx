"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/lib/catalog";
import { ITEM_TYPES, SOURCE_TYPES } from "@/data/grades";
import { Eyebrow } from "../ui/Type";
import { GradeChip } from "../ui/GradeChip";

/** Lot identity block: lot number, category, serif title, grade and provenance. */
export function LotHeading({ product, onGradeGuide, status }) {
  const { t } = useLang();
  const category = getCategory(product.category);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Eyebrow>
          {product.lot} · {t(category?.name)}
        </Eyebrow>
        {status}
      </div>
      <h1 className="a-display mt-4 text-[36px] text-fg sm:text-[46px] rtl:text-[34px] rtl:sm:text-[42px]">{t(product.title)}</h1>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-fg-2">
        <GradeChip grade={product.grade} onClick={onGradeGuide} />
        <span>{t(SOURCE_TYPES[product.source])}</span>
        <span aria-hidden="true" className="text-fg-3">
          ·
        </span>
        <span>{t(ITEM_TYPES[product.itemType])}</span>
      </div>
    </div>
  );
}
