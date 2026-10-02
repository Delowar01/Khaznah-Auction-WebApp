"use client";

import Link from "next/link";
import { BadgeCheck, Check, ClipboardCheck, ClipboardList, FileText } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { Money } from "@/components/shared/ui/Money";
import { Fulfilment } from "../product/Fulfilment";
import { SpecsTable } from "../product/SpecsTable";
import { SellerSummary } from "../seller/SellerSummary";
import { GradeChip } from "../ui/GradeChip";
import { cx } from "../ui/cx";

function CardHead({ id, icon: Icon, children }) {
  return (
    <h2 id={id} className="flex items-center gap-2 border-b border-line px-4 py-3 kb-md font-bold text-fg">
      <Icon aria-hidden="true" className="size-4 text-primary" />
      {children}
    </h2>
  );
}

/**
 * Dense lot sheet beside the gallery: the key facts as a two-column
 * definition list, the condition report and the highlights.
 */
export function LotFacts({ detail, info, className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { product } = detail;
  const rows = [
    { key: "lot", label: ui("lotNumber"), value: <span dir="ltr" className="tabular">{product.lot}</span> },
    {
      key: "category",
      label: ui("category"),
      value: (
        <Link href={link(info.categoryHref)} className="text-primary underline-offset-4 hover:underline">
          {info.categoryName}
        </Link>
      ),
    },
    { key: "type", label: ui("itemType"), value: info.itemType },
    { key: "source", label: ui("source"), value: info.source },
    ...(info.quantity ? [{ key: "qty", label: ui("quantity"), value: info.quantity }] : []),
    { key: "grade", label: ui("conditionGrade"), value: <GradeChip grade={product.grade} size="md" /> },
    { key: "start", label: ui("startingBid"), value: <Money value={product.startingBid} /> },
    { key: "increment", label: ui("minIncrement"), value: <Money value={product.increment} /> },
    ...(product.marketPrice ? [{ key: "market", label: ui("marketPrice"), value: <Money value={product.marketPrice} /> }] : []),
    ...(info.sellerCity ? [{ key: "pickup", label: ui("pickup"), value: info.sellerCity }] : []),
  ];

  return (
    <div className={cx("grid gap-4", className)}>
      <section aria-labelledby="kb-lot-facts" className="overflow-hidden rounded-xl border border-line bg-surface">
        <CardHead id="kb-lot-facts" icon={ClipboardList}>
          {t(C.lotDetails)}
        </CardHead>
        <dl className="grid grid-cols-2 gap-px bg-line">
          {rows.map((row) => (
            <div key={row.key} className="min-w-0 bg-surface px-4 py-2.5">
              <dt className="kb-2xs font-semibold text-fg-3">{row.label}</dt>
              <dd className="mt-0.5 kb-sm font-semibold text-fg">{row.value}</dd>
            </div>
          ))}
          {rows.length % 2 ? <div aria-hidden="true" className="bg-surface" /> : null}
        </dl>
      </section>

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

      {product.highlights?.length ? (
        <section aria-labelledby="kb-highlights">
          <h2 id="kb-highlights" className="mb-2 kb-eyebrow text-fg-3">
            {t(C.highlights)}
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
    </div>
  );
}

/** Description with the specification table, beside the seller and delivery. */
export function LotAbout({ detail, info, className = "" }) {
  const { t, ui } = useLang();
  const { product } = detail;
  return (
    <div className={cx("grid gap-6 xl:grid-cols-2", className)}>
      <section aria-labelledby="kb-about" className="rounded-xl border border-line bg-surface">
        <CardHead id="kb-about" icon={FileText}>
          {t(C.aboutLot)}
        </CardHead>
        <div className="grid gap-4 p-4">
          <p className="kb-md text-fg-2 text-pretty">{t(product.description)}</p>
          {product.specs?.length ? (
            <div>
              <h3 className="mb-2 kb-eyebrow text-fg-3">{ui("specifications")}</h3>
              <SpecsTable specs={product.specs} />
            </div>
          ) : null}
        </div>
      </section>
      <div className="grid content-start gap-4">
        <SellerSummary seller={info.seller} />
        <section aria-labelledby="kb-delivery">
          <h2 id="kb-delivery" className="mb-2 kb-eyebrow text-fg-3">
            {t(C.deliveryReturns)}
          </h2>
          <Fulfilment seller={info.seller} />
        </section>
      </div>
    </div>
  );
}
