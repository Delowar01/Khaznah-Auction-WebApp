"use client";

import Link from "next/link";
import { ChevronRight, MapPin, Warehouse } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { CITIES } from "@/data/sellers";
import { sellerStats } from "@/lib/catalog";
import { LiveBadge } from "../ui/Badge";
import { SellerAvatar } from "../ui/SellerAvatar";
import { CardShell } from "../cards/CardParts";

/** Seller card for "Shop by seller": cover, monogram, city, live counts. */
export function SellerTile({ seller }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const stats = sellerStats(seller.code);
  return (
    <CardShell>
      <div className="relative h-20 overflow-hidden bg-surface-2">
        <Img image={seller.cover} alt="" sizes="(min-width: 1024px) 20vw, 50vw" className="size-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />
        {seller.liveNow ? <LiveBadge className="absolute end-2 top-2">{ui("sellerLive")}</LiveBadge> : null}
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4">
        <SellerAvatar seller={seller} size="lg" className="pointer-events-none relative z-[2] -mt-7 mb-2 ring-4 ring-surface" />
        <h3 className="kb-md font-bold">
          <Link
            href={link(`/seller/${seller.code}`)}
            className="text-fg after:absolute after:inset-0 after:z-[1] after:content-[''] hover:text-primary"
          >
            {t(seller.name)}
          </Link>
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 kb-xs text-fg-3">
          <span className="inline-flex items-center gap-1 font-semibold text-fg-2">
            <Warehouse aria-hidden="true" className="size-3.5" />
            {ui("sellerWarehouse")}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-3.5" />
            {t(CITIES[seller.city])}
          </span>
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
          <div>
            <dt className="kb-2xs text-fg-3">{ui("activeAuctions")}</dt>
            <dd className="kb-lg font-extrabold text-fg tabular">{stats.activeAuctions}</dd>
          </div>
          <div>
            <dt className="kb-2xs text-fg-3">{ui("buyNowItems")}</dt>
            <dd className="kb-lg font-extrabold text-fg tabular">{stats.buyNowCount}</dd>
          </div>
        </dl>
        <span aria-hidden="true" className="mt-3 inline-flex items-center gap-1 kb-sm font-bold text-primary">
          {ui("visitStore")}
          <DirIcon icon={ChevronRight} className="size-4" />
        </span>
      </div>
    </CardShell>
  );
}
