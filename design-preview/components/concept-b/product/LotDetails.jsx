"use client";

import { BadgeCheck, Check, ClipboardCheck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getSeller } from "@/data/sellers";
import { SellerSummary } from "../seller/SellerSummary";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { Fulfilment } from "./Fulfilment";

/** Highlights, condition report, seller card and fulfilment for a lot. */
export function LotDetails({ product, className = "", showFulfilment = true, afterHighlights = null }) {
  const { t, ui } = useLang();
  const seller = getSeller(product.seller);
  return (
    <div className={cx("flex flex-col gap-5", className)}>
      {product.highlights?.length ? (
        <section aria-labelledby="kb-highlights">
          <h2 id="kb-highlights" className="mb-2 kb-eyebrow text-fg-3">
            {t(COPY.highlights)}
          </h2>
          <ul className="grid gap-2">
            {product.highlights.map((item) => (
              <li key={item.en} className="flex items-start gap-2.5 kb-md text-fg">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                </span>
                {t(item)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {afterHighlights}

      <section aria-labelledby="kb-condition" className="rounded-xl border border-line bg-surface-2/60 p-4">
        <h2 id="kb-condition" className="flex items-center gap-2 kb-sm font-bold text-fg">
          <ClipboardCheck aria-hidden="true" className="size-4 text-primary" />
          {ui("conditionReport")}
        </h2>
        <p className="mt-1.5 kb-md text-fg-2">{t(product.conditionNote)}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 kb-xs font-semibold text-success">
          <BadgeCheck aria-hidden="true" className="size-3.5" />
          {ui("inspected")}
        </p>
      </section>

      <SellerSummary seller={seller} />
      {showFulfilment ? <Fulfilment seller={seller} /> : null}
    </div>
  );
}
