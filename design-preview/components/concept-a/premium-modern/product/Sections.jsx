"use client";

// Premium Modern product sections: the stone band about the item, the
// seller beside delivery, returns and payment, and the two discovery lists
// in the Browse card. Hairline lists, brass dashes and bronze links.
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useFulfilment } from "@/components/shared/auction/hooks";
import { PRODUCT_COPY as C } from "@/components/shared/product/copy";
import { Money } from "@/components/shared/ui/Money";
import { LotCard } from "../browse/Cards";
import { Chevron, GradePill, SectionHead, cx } from "../ui";

const RULE = "border-[#d6d0c5]";

function FactList({ rows, className = "" }) {
  return (
    <dl className={cx("divide-y border-y", RULE, className)}>
      {rows.map((row) => (
        <div key={row.key} className={cx("grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-2.5", RULE)}>
          <dt className="pr-sm text-fg-2">{row.label}</dt>
          <dd className="pr-md font-medium text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Stone band: description, highlights and condition beside the item's facts and specifications. */
export function AboutBand({ product, info, purchase, onGradeGuide }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const facts = [
    { key: "lot", label: ui("lotNumber"), value: <span dir="ltr" className="tabular">{info.lot}</span> },
    {
      key: "category",
      label: ui("category"),
      value: (
        <Link href={link(info.categoryHref)} className="pr-link text-[var(--pr-bronze)]">
          {info.categoryName}
        </Link>
      ),
    },
    { key: "type", label: ui("itemType"), value: info.itemType },
    { key: "source", label: ui("source"), value: info.source },
    ...(info.quantity ? [{ key: "qty", label: ui("quantity"), value: info.quantity }] : []),
    { key: "stock", label: t(C.stockCount), value: purchase.stock.count },
  ];
  const specs = info.specs.map((row) => ({ key: row.key, label: row.label, value: row.value }));

  return (
    <section aria-labelledby="pr-about" className="mt-14 bg-[var(--pr-stone)] dt:mt-20">
      <div className="pr-container grid gap-10 py-10 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-16 dt:py-14">
        <div className="min-w-0">
          <SectionHead id="pr-about" title={t(C.aboutItem)} />
          <h3 className="sr-only">{ui("description")}</h3>
          <p className="mt-5 max-w-[62ch] pr-body text-fg text-pretty">{info.description}</p>
          {info.highlights.length ? (
            <>
              <h3 className="sr-only">{t(C.highlights)}</h3>
              <ul className="mt-6 grid gap-2.5">
                {info.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 pr-md text-fg">
                    <span aria-hidden="true" className="mt-[10px] h-[2px] w-4 shrink-0 bg-[var(--pr-brass)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <div className={cx("mt-8 border-t pt-6", RULE)}>
            <h3 className="pr-h3 text-fg">{ui("conditionReport")}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <GradePill grade={product.grade} />
              <button type="button" onClick={onGradeGuide} className="pr-link pr-md font-medium text-[var(--pr-bronze)]">
                {ui("whatGradeMeans")}
              </button>
            </div>
            <p className="mt-3 pr-md text-fg-2">{info.grade.text}</p>
            <p className="mt-2 pr-md text-fg">{info.condition}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 pr-xs font-medium text-[var(--pr-grade-a)]">
              <BadgeCheck aria-hidden="true" className="size-4" strokeWidth={1.8} />
              {ui("inspected")}
            </p>
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="pr-kicker text-[#4a4d57]">{t(C.itemDetails)}</h3>
          <FactList rows={facts} className="mt-3" />
          {specs.length ? (
            <>
              <h3 className="mt-8 pr-kicker text-[#4a4d57]">{ui("specifications")}</h3>
              <FactList rows={specs} className="mt-3" />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** The seller beside delivery, pickup, returns and payment: quiet hairline lists. */
export function SellerNotes({ product, info }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const fulfilment = useFulfilment(product);
  return (
    <div className="pr-container grid gap-12 py-12 md:grid-cols-2 dt:gap-16 dt:py-16">
      {info.seller ? (
        <section aria-labelledby="pr-seller" className="min-w-0">
          <h2 id="pr-seller" className="pr-kicker text-[#4a4d57]">
            {info.sellerLabel}
          </h2>
          <p className="mt-2 pr-h3 text-fg">
            <Link href={link(info.sellerHref)} className="pr-link">
              {info.sellerName}
            </Link>
          </p>
          <p className="mt-1 pr-sm text-fg-2">
            {ui("sellerWarehouse")} · {info.sellerCity} · {info.sellerSince}
          </p>
          <dl className="mt-4 flex gap-8">
            <div>
              <dt className="pr-xs text-fg-2">{ui("activeAuctions")}</dt>
              <dd className="pr-lg font-semibold text-fg tabular">{info.sellerStats.activeAuctions}</dd>
            </div>
            <div>
              <dt className="pr-xs text-fg-2">{ui("buyNowItems")}</dt>
              <dd className="pr-lg font-semibold text-fg tabular">{info.sellerStats.buyNowCount}</dd>
            </div>
          </dl>
          <Link href={link(info.sellerHref)} className="pr-link mt-3 inline-flex items-center gap-1.5 pr-md font-medium text-[var(--pr-bronze)]">
            {ui("visitStore")}
            <Chevron className="size-4" />
          </Link>
        </section>
      ) : null}
      <section aria-labelledby="pr-delivery" className="min-w-0">
        <h2 id="pr-delivery" className="pr-kicker text-[#4a4d57]">
          {t(C.deliveryReturns)}
        </h2>
        <dl className={cx("mt-3 divide-y border-y", RULE)}>
          {fulfilment.map((row) => (
            <div key={row.key} className={cx("py-3", RULE)}>
              <dt className="pr-md font-semibold text-fg">{row.title}</dt>
              <dd className="mt-0.5 pr-sm text-fg-2">
                {row.text}
                {row.extra ? <span className="mt-0.5 block">{row.extra}</span> : null}
              </dd>
            </div>
          ))}
          <div className={cx("py-3", RULE)}>
            <dt className="pr-md font-semibold text-fg">{t(C.paymentTitle)}</dt>
            <dd className="mt-0.5 pr-sm text-fg-2">
              {ui("securePayment")} ·{" "}
              <span dir="ltr" className="font-medium text-fg">
                {info.payment.methods.join(" · ")}
              </span>
              <span className="mt-0.5 block">
                {ui("walletBalance")} <Money value={info.payment.wallet} className="font-medium text-fg" />
              </span>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

/** A titled list of lots in the Browse card: four across from 1024 px, a swipeable row on phones. */
export function LotList({ id, title, sub, href, lots }) {
  const { ui } = useLang();
  if (!lots.length) return null;
  return (
    <section aria-labelledby={id} className="pr-container pb-14 dt:pb-20">
      <SectionHead id={id} title={title} sub={sub} href={href} linkLabel={ui("viewAll")} />
      <ul className="pr-rail -mx-[var(--pr-gutter)] mt-6 flex snap-x gap-3 overflow-x-auto px-[var(--pr-gutter)] md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
        {lots.map((lot) => (
          <li key={lot.slug} className="w-[min(76%,300px)] shrink-0 snap-start md:w-auto">
            <LotCard product={lot} />
          </li>
        ))}
      </ul>
    </section>
  );
}
