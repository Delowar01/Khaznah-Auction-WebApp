"use client";

import { Store } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Reveal } from "@/components/shared/ui/Reveal";
import { SELLERS } from "@/data/sellers";
import { STATS } from "@/data/site";
import { RIYAL, formatNumber } from "@/lib/format";
import { SectionHeader } from "../ui/SectionHeader";
import { SellerTile } from "../seller/SellerTile";
import { COPY } from "../copy";

function StatValue({ stat }) {
  const { t } = useLang();
  if (stat.money) {
    return (
      <>
        <span aria-hidden="true" dir="ltr" className="inline-flex items-baseline gap-1">
          <span className="text-[0.75em]">{RIYAL}</span>
          {formatNumber(stat.value)}
          {stat.suffixUnit}
        </span>
        <span className="sr-only">{t(COPY.statMillion, { value: formatNumber(stat.value) })}</span>
      </>
    );
  }
  return (
    <span dir="ltr">
      {formatNumber(stat.value)}
      {stat.suffix || ""}
    </span>
  );
}

/** Marketplace credibility: headline stats and the sellers. */
export function SellerShelf() {
  const { t, ui } = useLang();
  return (
    <Reveal as="section" aria-labelledby="kb-sellers">
      <SectionHeader id="kb-sellers" icon={Store} title={t(COPY.sellersTitle)} subtitle={t(COPY.sellersSubtitle)} href="/seller" hrefLabel={ui("sellers")} />
      <dl className="mb-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.key} className="flex flex-col-reverse gap-1 bg-surface px-4 py-4 sm:px-5">
            <dt className="kb-xs text-fg-2">{t(stat.label)}</dt>
            <dd className="kb-h1 text-primary tabular">
              <StatValue stat={stat} />
            </dd>
          </div>
        ))}
      </dl>
      <ul className="kb-rail no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
        {SELLERS.map((seller) => (
          <li key={seller.code} className="w-[72%] shrink-0 sm:w-auto">
            <SellerTile seller={seller} />
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
