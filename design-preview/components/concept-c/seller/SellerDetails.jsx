"use client";

import { BadgeCheck, Clock, MapPin, Truck, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { UI } from "@/data/ui";
import { CITIES } from "@/data/sellers";
import { sellerStats } from "@/lib/catalog";
import { COPY } from "../copy";
import { EyebrowRule } from "../ui/Section";

/** Storefront numbers in Archivo expanded numerals. */
export function SellerStats({ seller }) {
  const { t, ui } = useLang();
  const stats = sellerStats(seller.code);
  const rows = [
    [ui("activeAuctions"), stats.activeAuctions],
    [ui("buyNowItems"), stats.buyNowCount],
    [t(COPY.totalListings), stats.total],
    [t(COPY.categoriesCount), stats.categories.length],
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
      {rows.map(([label, value]) => (
        <div key={label} className="flex flex-col-reverse justify-end gap-2 bg-surface px-5 py-5 lg:px-6 lg:py-6">
          <dt className="text-sm text-fg-2">{label}</dt>
          <dd className="c-num text-[2.5rem] font-semibold leading-none text-fg lg:text-5xl">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** About the seller, pickup address and hours, and trust indicators. */
export function SellerAbout({ seller }) {
  const { t, ui } = useLang();
  const [address, hours] = t(seller.pickup).split(" · ");
  const trust = [
    { icon: BadgeCheck, label: ui("inspected") },
    { icon: Warehouse, label: ui("sellerWarehouse") },
    { icon: Truck, label: t(COPY.deliveryAvailable) },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
      <section aria-labelledby="about-title">
        <EyebrowRule content={UI.aboutSeller} className="mb-5" />
        <h2 id="about-title" className="sr-only">
          {ui("aboutSeller")}
        </h2>
        <p className="c-prose text-[1.0625rem]">{t(seller.description)}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {trust.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-3 text-sm font-medium text-fg">
              <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" strokeWidth={1.75} />
              {label}
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="pickup-title" className="rounded-md border border-line bg-surface p-6">
        <h2 id="pickup-title" className="c-h3 text-lg">
          {ui("pickupHours")}
        </h2>
        <dl className="mt-5 space-y-5">
          <div>
            <dt className="flex items-center gap-2.5 text-xs text-fg-3">
              <MapPin aria-hidden="true" className="size-5 shrink-0 text-accent" />
              {t(COPY.address)}
            </dt>
            <dd className="mt-1 ps-[1.875rem] font-medium text-fg">{address}</dd>
          </div>
          {hours ? (
            <div>
              <dt className="flex items-center gap-2.5 text-xs text-fg-3">
                <Clock aria-hidden="true" className="size-5 shrink-0 text-accent" />
                {t(COPY.hours)}
              </dt>
              <dd className="mt-1 ps-[1.875rem] font-medium text-fg">{hours}</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-6 border-t border-line pt-4 text-sm text-fg-2">{ui("pickupText", { city: t(CITIES[seller.city]) })}</p>
      </section>
    </div>
  );
}
