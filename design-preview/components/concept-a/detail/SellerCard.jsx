"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CITIES } from "@/data/sellers";
import { sellerStats } from "@/lib/catalog";
import { formatMonthYear } from "@/lib/format";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Monogram } from "../ui/Monogram";

/** Seller summary used on lot pages (links to the public storefront). */
export function SellerCard({ seller, compact = false }) {
  const { t, ui, pl, lang } = useLang();
  const { link } = useConcept();
  const stats = sellerStats(seller.code);
  const href = link(`/seller/${seller.code}`);
  return (
    <div className={`rounded-card border border-line bg-surface ${compact ? "p-5" : "p-6"}`}>
      <div className="flex items-start gap-4">
        <Monogram seller={seller} size={compact ? 48 : 56} />
        <div className="min-w-0 flex-1">
          <p className="a-eyebrow !text-fg-3">{ui("soldBy")}</p>
          <Link href={href} className="a-serif mt-1 block text-[22px] leading-tight text-fg hover:underline">
            {t(seller.name)}
          </Link>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-fg-2">
            <span className="inline-flex items-center gap-1.5 text-success">
              <Warehouse aria-hidden="true" className="size-4" />
              {ui("sellerWarehouse")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-3.5 text-fg-3" />
              {t(CITIES[seller.city])}
            </span>
          </p>
        </div>
      </div>
      {!compact ? <p className="mt-4 text-sm leading-relaxed text-fg-2 rtl:leading-7">{t(seller.tagline)}</p> : null}
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4 text-[13px]">
        <span className="text-fg-3">
          {ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })} · {pl("lots", stats.total)}
        </span>
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-fg">
          <span className="a-link">{ui("visitStore")}</span>
          <DirIcon icon={ArrowRight} className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
