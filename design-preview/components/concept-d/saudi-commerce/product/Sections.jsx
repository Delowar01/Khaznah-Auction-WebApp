"use client";

// Contemporary Saudi product information, practical and ordered: the
// description with a checklist of highlights beside the item details and
// specifications as plain tables; and the lists of related items and the
// seller's other lots in the Browse card (auctions first).
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { PRODUCT_COPY as C } from "@/components/shared/product/copy";
import { LotCard } from "../browse/Cards";
import { SectionHead, cx } from "../ui";

function Table({ rows }) {
  return (
    <dl className="overflow-hidden rounded-[9px] border border-[var(--sc-line)]">
      {rows.map((row) => (
        <div key={row.key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-[var(--sc-line)] px-4 py-2.5 last:border-b-0 odd:bg-[var(--sc-panel)]">
          <dt className="sc-md text-[var(--sc-muted)]">{row.label}</dt>
          <dd className="sc-md font-medium text-[var(--sc-ink)]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Description with a checklist of highlights; item details and specifications as tables. */
export function AboutItem({ info, purchase }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const facts = [
    { key: "lot", label: ui("lotNumber"), value: <span dir="ltr" className="tabular">{info.lot}</span> },
    {
      key: "category",
      label: ui("category"),
      value: (
        <Link href={link(info.categoryHref)} className="sc-link text-[var(--sc-link)]">
          {info.categoryName}
        </Link>
      ),
    },
    { key: "type", label: ui("itemType"), value: info.itemType },
    { key: "source", label: ui("source"), value: info.source },
    ...(info.quantity ? [{ key: "qty", label: ui("quantity"), value: info.quantity }] : []),
    { key: "stock", label: t(C.stockCount), value: purchase.stock.count },
  ];
  return (
    <section aria-labelledby="sc-about" className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="min-w-0">
        <SectionHead id="sc-about" title={t(C.aboutItem)} />
        <p className="mt-3 sc-body text-[var(--sc-ink)] text-pretty dt:text-[16px] dt:leading-[25px]">{info.description}</p>
        {info.highlights.length ? (
          <>
            <h3 className="mt-5 sc-micro text-[var(--sc-muted)]">{t(C.highlights)}</h3>
            <ul className="mt-2.5 grid gap-2">
              {info.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 sc-md text-[var(--sc-ink)]">
                  <CheckCircle2 aria-hidden="true" className="mt-px size-[18px] shrink-0 text-[var(--sc-green)]" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
      <div className="grid min-w-0 content-start gap-5">
        <div>
          <h3 className="mb-2.5 sc-micro text-[var(--sc-muted)]">{t(C.itemDetails)}</h3>
          <Table rows={facts} />
        </div>
        {info.specs.length ? (
          <div>
            <h3 className="mb-2.5 sc-micro text-[var(--sc-muted)]">{ui("specifications")}</h3>
            <Table rows={info.specs} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** A titled list of lots in the Browse card, with View all. */
export function LotList({ id, title, text, href, lots, className = "" }) {
  const { ui } = useLang();
  if (!lots.length) return null;
  return (
    <section aria-labelledby={id} className={cx("sc-container", className)}>
      <SectionHead id={id} title={title} text={text} href={href} linkLabel={ui("viewAll")} />
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {lots.map((lot) => (
          <li key={lot.slug}>
            <LotCard product={lot} />
          </li>
        ))}
      </ul>
    </section>
  );
}
