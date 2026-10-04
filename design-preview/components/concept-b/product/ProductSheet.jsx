"use client";

import Link from "next/link";
import { BadgeCheck, Check, CircleHelp, ClipboardCheck, ClipboardList, FileText, Truck } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { PRODUCT_COPY as C } from "@/components/shared/product/copy";
import { SellerSummary } from "../seller/SellerSummary";
import { Button } from "../ui/Button";
import { GradeChip } from "../ui/GradeChip";
import { cx } from "../ui/cx";
import { Fulfilment } from "./Fulfilment";
import { ManifestTable } from "./ManifestTable";
import { SpecsTable } from "./SpecsTable";

function CardHead({ id, icon: Icon, children }) {
  return (
    <h2 id={id} className="flex items-center gap-2 border-b border-line px-4 py-3 kb-md font-bold text-fg">
      <Icon aria-hidden="true" className="size-4 text-primary" />
      {children}
    </h2>
  );
}

/**
 * Dense sheet beside the gallery, like the auction's lot sheet: the key
 * facts as a two-column definition list, the condition report and the
 * highlights.
 */
export function ProductFacts({ product, info, purchase, className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const rows = [
    { key: "lot", label: ui("lotNumber"), value: <span dir="ltr" className="tabular">{info.lot}</span> },
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
    { key: "stock", label: t(C.stockCount), value: purchase.stock.count },
    ...(info.sellerCity ? [{ key: "pickup", label: ui("pickup"), value: info.sellerCity }] : []),
  ];

  return (
    <div className={cx("grid gap-4", className)}>
      <section aria-labelledby="kb-item-facts" className="overflow-hidden rounded-xl border border-line bg-surface">
        <CardHead id="kb-item-facts" icon={ClipboardList}>
          {t(C.itemDetails)}
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
        <p className="mt-1.5 kb-md text-fg-2">{info.condition}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 kb-xs font-semibold text-success">
          <BadgeCheck aria-hidden="true" className="size-3.5" />
          {ui("inspected")}
        </p>
      </section>

      {info.highlights.length ? (
        <section aria-labelledby="kb-highlights">
          <h2 id="kb-highlights" className="mb-2 kb-eyebrow text-fg-3">
            {t(C.highlights)}
          </h2>
          <ul className="grid gap-2">
            {info.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 kb-md text-fg">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/10 text-success">
                  <Check aria-hidden="true" className="size-3.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Under the gallery and facts: the description beside every specification,
 * the grade explained with the guide, the seller and delivery, and the
 * pallet manifest where there is one.
 */
export function ProductAbout({ product, info, onGradeGuide }) {
  const { t, ui } = useLang();
  return (
    <div className="grid min-w-0 content-start gap-6">
      <section aria-labelledby="kb-about" className="overflow-hidden rounded-xl border border-line bg-surface">
        <CardHead id="kb-about" icon={FileText}>
          {t(C.aboutItem)}
        </CardHead>
        <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <h3 className="sr-only">{ui("description")}</h3>
            <p className="kb-lg text-fg-2 text-pretty">{info.description}</p>
          </div>
          <div className="min-w-0">
            <h3 className="mb-2 kb-eyebrow text-fg-3">{ui("specifications")}</h3>
            <SpecsTable specs={product.specs} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section aria-labelledby="kb-grade" className="flex items-start gap-4 rounded-xl border border-line bg-surface p-4">
          <GradeChip grade={product.grade} size="lg" letter />
          <div className="min-w-0">
            <h2 id="kb-grade" className="kb-md font-bold text-fg">
              {info.grade.label}
            </h2>
            <p className="mt-1 kb-sm text-fg-2">{info.grade.text}</p>
            <Button variant="ghost" size="sm" icon={CircleHelp} onClick={onGradeGuide} className="-ms-3 mt-2 text-primary">
              {ui("whatGradeMeans")}
            </Button>
          </div>
        </section>
        <SellerSummary seller={info.seller} />
      </div>

      <section aria-labelledby="kb-delivery">
        <h2 id="kb-delivery" className="mb-2 flex items-center gap-2 kb-md font-bold text-fg">
          <Truck aria-hidden="true" className="size-4 text-primary" />
          {t(C.deliveryReturns)}
        </h2>
        <Fulfilment seller={info.seller} detailed />
      </section>

      {product.palletContents ? <ManifestTable product={product} caption={ui("palletContents")} /> : null}
    </div>
  );
}
