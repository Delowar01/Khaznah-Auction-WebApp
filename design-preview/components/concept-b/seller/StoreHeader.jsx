"use client";

import Link from "next/link";
import { BadgeCheck, CalendarDays, MapPin, Radio, Share2, Truck, Warehouse } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { CITIES } from "@/data/sellers";
import { TRUST_POINTS } from "@/data/site";
import { sellerStats } from "@/lib/catalog";
import { formatMonthYear } from "@/lib/format";
import { Badge, LiveBadge } from "../ui/Badge";
import { Button, buttonClass } from "../ui/Button";
import { SellerAvatar } from "../ui/SellerAvatar";
import { useShareLink } from "../utils/navigation";
import { COPY } from "../copy";

/** Storefront hero: cover photo, overlapping identity card, stats and trust. */
export function StoreHeader({ seller }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();
  const share = useShareLink();
  const stats = sellerStats(seller.code);
  const delivery = TRUST_POINTS.find((p) => p.key === "delivery");

  const figures = [
    { key: "auctions", label: ui("activeAuctions"), value: stats.activeAuctions },
    { key: "buy", label: ui("buyNowItems"), value: stats.buyNowCount },
    { key: "cats", label: t(COPY.categoriesCount), value: stats.categories.length },
  ];
  const trust = [
    { key: "graded", icon: BadgeCheck, label: ui("inspected") },
    { key: "verified", icon: Warehouse, label: ui("verifiedSeller") },
    { key: "delivery", icon: Truck, label: t(delivery.title) },
  ];

  return (
    <div>
      <div className="relative h-44 overflow-hidden bg-secondary sm:h-56 lg:h-64">
        <Img image={seller.cover} alt="" sizes="100vw" priority className="size-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/10" />
      </div>
      <div className="kb-container relative -mt-16 sm:-mt-20">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-raised sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <SellerAvatar seller={seller} size="xl" className="-mt-14 shrink-0 ring-4 ring-surface" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="kb-h1 text-fg">{t(seller.name)}</h1>
                  <Badge tone="success" size="md" icon={BadgeCheck}>
                    {ui("verifiedSeller")}
                  </Badge>
                  {seller.liveNow ? <LiveBadge size="md">{ui("sellerLive")}</LiveBadge> : null}
                </div>
                <p className="mt-1 kb-md text-fg-2">{t(seller.tagline)}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 kb-sm text-fg-3">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="size-4" />
                    {ui("basedIn", { city: t(CITIES[seller.city]) })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    {ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })}
                  </span>
                  {seller.platform ? <span className="font-semibold text-primary">{ui("platformSeller")}</span> : null}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-3 divide-x divide-line rounded-xl border border-line xl:w-[420px]">
              {figures.map((figure) => (
                <div key={figure.key} className="px-4 py-3">
                  <dt className="kb-2xs text-fg-3">{figure.label}</dt>
                  <dd className="kb-h2 text-fg tabular">{figure.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {trust.map((item) => (
                <li key={item.key} className="inline-flex items-center gap-1.5 kb-sm font-semibold text-fg-2">
                  <item.icon aria-hidden="true" className="size-4 text-success" />
                  {item.label}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {seller.liveNow ? (
                <Link href={link("/live-auction")} className={buttonClass({ size: "md" })}>
                  <Radio aria-hidden="true" className="size-4" />
                  {ui("joinLive")}
                </Link>
              ) : null}
              <Button variant="outline" icon={Share2} onClick={() => share(t(COPY.storeLinkCopied))}>
                {ui("shareStore")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
