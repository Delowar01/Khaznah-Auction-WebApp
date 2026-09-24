"use client";

import { BadgeCheck, Clock, ShieldCheck, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { getCategory } from "@/data/categories";
import { sellerStats } from "@/lib/catalog";
import { useCopy } from "../lib/useCopy";

function StatCard({ label, value, sub }) {
  return (
    <div className="d-panel relative overflow-hidden p-4 sm:p-5">
      <div aria-hidden="true" className="d-glow pointer-events-none absolute -end-12 -top-12 size-32" />
      <dt className="relative text-[13px] text-fg-3">{label}</dt>
      <dd className="d-num relative mt-2 text-3xl font-medium leading-none text-fg sm:text-[34px]">{value}</dd>
      {sub ? <dd className="relative mt-2 truncate text-xs text-fg-3">{sub}</dd> : null}
    </div>
  );
}

/** Stat cards (real fields only), about, pickup & hours, trust indicators. */
export function SellerOverview({ seller }) {
  const { t, ui } = useLang();
  const c = useCopy();
  const stats = sellerStats(seller.code);
  const categoryNames = stats.categories.map((slug) => t(getCategory(slug)?.name)).join(" · ");
  const trust = [
    { icon: BadgeCheck, text: c("trustGraded") },
    { icon: ShieldCheck, text: c("trustVerified") },
    { icon: Truck, text: c("trustPickup") },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
      <section aria-label={c("storeStats")}>
        <dl className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard label={ui("activeAuctions")} value={stats.activeAuctions} />
          <StatCard label={ui("buyNowItems")} value={stats.buyNowCount} />
          <StatCard label={c("categoriesStat")} value={stats.categories.length} sub={categoryNames} />
          <StatCard label={c("listingsStat")} value={stats.total} />
        </dl>
      </section>
      <section aria-labelledby="about-seller" className="d-panel p-5">
        <h2 id="about-seller" className="text-base font-semibold text-fg">
          {ui("aboutSeller")}
        </h2>
        <p className="mt-2 text-sm text-fg-2 text-pretty">{t(seller.description)}</p>
        <div className="d-panel-2 mt-4 flex gap-3 p-3.5">
          <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 d-ink" />
          <div>
            <h3 className="text-sm font-medium text-fg">{ui("pickupHours")}</h3>
            <p className="mt-0.5 text-[13px] text-fg-2">{t(seller.pickup)}</p>
          </div>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {trust.map((item) => (
            <li key={item.text} className="flex items-start gap-2 text-[13px] text-fg-2">
              <item.icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
              {item.text}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
