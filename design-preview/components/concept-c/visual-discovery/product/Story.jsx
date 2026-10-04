"use client";

// Visual Discovery product story: fact chips, the description with
// highlight tiles, a soft condition card and the specifications; and the
// discovery lists, led by chips back into Browse (auctions before Buy Now).
import Link from "next/link";
import { BadgeCheck, Check } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { BROWSE_COPY } from "@/components/shared/browse/copy";
import { PRODUCT_COPY as C } from "@/components/shared/product/copy";
import { LotCard, toneOf } from "../browse/Cards";
import { Arrow, GradePill, SectionHead, cx } from "../ui";

const CHIP = "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[var(--vd-bluegray)] px-4 py-1.5 vd-sm text-[var(--vd-muted)]";

/** Description with fact chips and highlight tiles, beside the condition card and specifications. */
export function AboutItem({ product, info, purchase, onGradeGuide }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  return (
    <section aria-labelledby="vd-about" className="vd-container mt-14 dt:mt-20">
      <div className="grid gap-8 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-12">
        <div className="min-w-0">
          <h2 id="vd-about" className="vd-h2 text-[var(--vd-ink)]">
            {t(C.aboutItem)}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <Link href={link(info.categoryHref)} className={cx(CHIP, "transition-colors hover:bg-[#dfe7f3]")}>
                {ui("category")} <span className="font-bold text-[var(--vd-indigo)]">{info.categoryName}</span>
              </Link>
            </li>
            <li className={CHIP}>
              {ui("itemType")} <span className="font-bold text-[var(--vd-ink)]">{info.quantity || info.itemType}</span>
            </li>
            <li className={CHIP}>
              {ui("source")} <span className="font-bold text-[var(--vd-ink)]">{info.source}</span>
            </li>
            <li className={CHIP}>
              {ui("lotNumber")}{" "}
              <span dir="ltr" className="font-bold text-[var(--vd-ink)] tabular">
                {info.lot}
              </span>
            </li>
            <li className={CHIP}>
              {t(C.stockCount)} <span className="font-bold text-[var(--vd-ink)]">{purchase.stock.count}</span>
            </li>
          </ul>
          <h3 className="sr-only">{ui("description")}</h3>
          <p className="mt-5 max-w-[64ch] vd-lg text-[var(--vd-ink)] text-pretty">{info.description}</p>
          {info.highlights.length ? (
            <>
              <h3 className="sr-only">{t(C.highlights)}</h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {info.highlights.map((item) => (
                  <li key={item} className="flex flex-col gap-3 rounded-[20px] p-4" style={{ background: toneOf(item) }}>
                    <span className="grid size-9 place-items-center rounded-full bg-white text-[var(--vd-indigo)]">
                      <Check aria-hidden="true" className="size-[18px]" strokeWidth={2.6} />
                    </span>
                    <span className="vd-md font-semibold text-[var(--vd-ink)]">{item}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <div className="grid min-w-0 content-start gap-4">
          <section aria-labelledby="vd-condition" className="rounded-[24px] bg-[var(--vd-ivory)] p-5 dt:p-6">
            <h3 id="vd-condition" className="vd-h3 text-[var(--vd-ink)]">
              {ui("conditionReport")}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <GradePill grade={product.grade} />
              <button type="button" onClick={onGradeGuide} className="vd-link inline-flex items-center gap-1.5 vd-md font-semibold text-[var(--vd-indigo)]">
                {ui("whatGradeMeans")}
                <Arrow />
              </button>
            </div>
            <p className="mt-3 vd-sm text-[var(--vd-muted)]">{info.grade.text}</p>
            <p className="mt-2 vd-body text-[var(--vd-ink)]">{info.condition}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 vd-sm font-semibold text-[var(--vd-grade-a)]">
              <BadgeCheck aria-hidden="true" className="size-4" strokeWidth={2.2} />
              {ui("inspected")}
            </p>
          </section>
          {info.specs.length ? (
            <section aria-labelledby="vd-specs" className="rounded-[24px] bg-[var(--vd-bluegray)]/70 p-5 dt:p-6">
              <h3 id="vd-specs" className="vd-h3 text-[var(--vd-ink)]">
                {ui("specifications")}
              </h3>
              <dl className="mt-3 grid gap-2">
                {info.specs.map((row) => (
                  <div key={row.key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 rounded-[12px] bg-white px-3.5 py-2.5">
                    <dt className="vd-sm text-[var(--vd-muted)]">{row.label}</dt>
                    <dd className="vd-sm font-semibold text-[var(--vd-ink)]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** A titled discovery list: chips back into Browse, then lots as image-first cards. */
export function DiscoveryList({ id, title, sub, href, lots, chips = [], className = "" }) {
  const { ui } = useLang();
  const { link } = useConcept();
  if (!lots.length) return null;
  return (
    <section aria-labelledby={id} className={cx("vd-container", className)}>
      <SectionHead id={id} title={title} href={href} linkLabel={ui("viewAll")}>
        {sub ? <span className="vd-md text-[var(--vd-muted)]">{sub}</span> : null}
      </SectionHead>
      {chips.length ? (
        <ul className="vd-rail -mx-[var(--vd-gutter)] mt-4 flex gap-2 overflow-x-auto px-[var(--vd-gutter)] pb-1 dt:mx-0 dt:px-0">
          {chips.map((chip) => (
            <li key={chip.key} className="shrink-0">
              <Link href={link(chip.href)} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#dfe7f3] bg-white px-4 vd-md text-[var(--vd-ink)] transition-colors hover:border-[#c3d2ea] hover:bg-[#f3f7fc]">
                {chip.label}
                <Arrow className="size-4 text-[var(--vd-indigo)]" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="vd-rail -mx-[var(--vd-gutter)] mt-5 flex snap-x gap-3 overflow-x-auto px-[var(--vd-gutter)] md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-4">
        {lots.map((lot) => (
          <li key={lot.slug} className="w-[min(72%,280px)] shrink-0 snap-start md:w-auto">
            <LotCard product={lot} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Discovery chips for a product: its category, then timed auctions before Buy Now. */
export function useDiscoveryChips(info) {
  const { t, ui } = useLang();
  return [
    { key: "category", href: info.categoryHref, label: info.categoryName },
    { key: "auctions", href: "/browse?tab=auction", label: t(BROWSE_COPY.timedAuctions) },
    { key: "buy", href: "/browse?tab=buy_now", label: ui("buyNow") },
  ];
}
