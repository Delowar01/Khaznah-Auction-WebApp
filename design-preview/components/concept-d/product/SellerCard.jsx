"use client";

import { ArrowRight, MapPin } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { CITIES, getSeller } from "@/data/sellers";
import { formatMonthYear } from "@/lib/format";
import { sellerStats } from "@/lib/catalog";
import { SellerAvatar } from "../ui/SellerAvatar";
import { StatusChip } from "../ui/Chips";
import { Button } from "../ui/Button";

/** Seller summary with a link to the storefront (real fields only). */
export function SellerCard({ code, detailed = false, className = "" }) {
  const seller = getSeller(code);
  const { link } = useConcept();
  const { t, ui, lang } = useLang();
  const stats = sellerStats(seller.code);
  return (
    <section aria-label={ui("soldBy")} className={`d-panel p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <SellerAvatar seller={seller} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="d-label text-fg-3">{seller.platform ? ui("platformSeller") : ui("soldBy")}</p>
          <p className="mt-0.5 flex items-center gap-1.5 font-medium text-fg">
            <span className="truncate">{t(seller.name)}</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-fg-3">
            <MapPin aria-hidden="true" className="size-3.5" />
            {t(CITIES[seller.city])} · {ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })}
          </p>
        </div>
        {seller.liveNow ? <StatusChip status="live" label={ui("sellerLive")} className="hidden sm:inline-flex" /> : null}
      </div>
      {detailed ? (
        <>
          <p className="mt-4 text-sm text-fg-2 text-pretty">{t(seller.description)}</p>
          <dl className="mt-4 grid grid-cols-2 gap-2">
            <div className="d-panel-2 p-3">
              <dt className="text-xs text-fg-3">{ui("activeAuctions")}</dt>
              <dd className="d-num mt-1 text-lg font-medium text-fg">{stats.activeAuctions}</dd>
            </div>
            <div className="d-panel-2 p-3">
              <dt className="text-xs text-fg-3">{ui("buyNowItems")}</dt>
              <dd className="d-num mt-1 text-lg font-medium text-fg">{stats.buyNowCount}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-fg-3">
            <span className="font-medium text-fg-2">{ui("pickupHours")}: </span>
            {t(seller.pickup)}
          </p>
        </>
      ) : null}
      <Button href={link(`/seller/${seller.code}`)} variant="secondary" size="md" className="mt-4 w-full" iconEnd={ArrowRight}>
        {ui("visitStore")}
      </Button>
    </section>
  );
}
