"use client";

import Link from "next/link";
import { BadgeCheck, CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { CITIES } from "@/data/sellers";
import { sellerStats } from "@/lib/catalog";
import { formatMonthYear } from "@/lib/format";
import { LiveBadge } from "../ui/Badge";
import { SellerAvatar } from "../ui/SellerAvatar";
import { cx } from "../ui/cx";

/** "Sold by" card on detail pages, linking to the storefront. */
export function SellerSummary({ seller, className = "" }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();
  if (!seller) return null;
  const stats = sellerStats(seller.code);
  return (
    <section aria-labelledby="kb-sold-by" className={cx("rounded-xl border border-line bg-surface p-4", className)}>
      <p id="kb-sold-by" className="mb-3 kb-eyebrow text-fg-3">
        {seller.platform ? ui("platformSeller") : ui("soldBy")}
      </p>
      <div className="flex items-start gap-3">
        <SellerAvatar seller={seller} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={link(`/seller/${seller.code}`)} className="kb-md font-bold text-fg hover:text-primary">
              {t(seller.name)}
            </Link>
            {seller.liveNow ? <LiveBadge>{ui("sellerLive")}</LiveBadge> : null}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 kb-xs text-fg-3">
            <span className="inline-flex items-center gap-1 font-semibold text-success">
              <BadgeCheck aria-hidden="true" className="size-3.5" />
              {ui("verifiedSeller")}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin aria-hidden="true" className="size-3.5" />
              {t(CITIES[seller.city])}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              {ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
        <dl className="flex gap-5">
          <div>
            <dt className="kb-2xs text-fg-3">{ui("activeAuctions")}</dt>
            <dd className="kb-md font-extrabold text-fg tabular">{stats.activeAuctions}</dd>
          </div>
          <div>
            <dt className="kb-2xs text-fg-3">{ui("buyNowItems")}</dt>
            <dd className="kb-md font-extrabold text-fg tabular">{stats.buyNowCount}</dd>
          </div>
        </dl>
        <Link
          href={link(`/seller/${seller.code}`)}
          className="inline-flex h-9 items-center gap-1 rounded-control px-2.5 kb-sm font-bold text-primary transition-colors hover:bg-primary/10"
        >
          {ui("visitStore")}
          <DirIcon icon={ChevronRight} className="size-4" />
        </Link>
      </div>
    </section>
  );
}
