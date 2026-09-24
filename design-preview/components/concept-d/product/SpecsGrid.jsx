"use client";

import { Check } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { ITEM_TYPES, SOURCE_TYPES } from "@/data/grades";
import { useCopy } from "../lib/useCopy";

/** Description + highlights. */
export function Overview({ product }) {
  const { t } = useLang();
  const c = useCopy();
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <p className="text-[15px] leading-relaxed text-fg-2 text-pretty">{t(product.description)}</p>
      <div>
        <h3 className="d-label mb-3 text-fg-3">{c("highlights")}</h3>
        <ul className="space-y-2.5">
          {product.highlights.map((item) => (
            <li key={item.en} className="flex gap-2.5 text-sm text-fg">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                <Check aria-hidden="true" className="size-3" strokeWidth={3} />
              </span>
              {t(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Specification key/value grid (plus source and item type). */
export function SpecsGrid({ product }) {
  const { t, ui } = useLang();
  const rows = [
    ...product.specs.map((spec) => ({ k: t(spec.k), v: t(spec.v) })),
    { k: ui("source"), v: t(SOURCE_TYPES[product.source]) },
    { k: ui("itemType"), v: t(ITEM_TYPES[product.itemType]) },
  ];
  return (
    <dl className="grid overflow-hidden rounded-xl border border-line sm:grid-cols-2">
      {rows.map((row, index) => (
        <div key={row.k} className={`flex justify-between gap-4 border-line px-4 py-3 text-sm ${index % 2 === 0 ? "sm:border-e" : ""} border-b`}>
          <dt className="text-fg-3">{row.k}</dt>
          <dd className="text-end font-medium text-fg">{row.v}</dd>
        </div>
      ))}
    </dl>
  );
}
