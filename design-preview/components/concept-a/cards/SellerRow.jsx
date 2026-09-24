"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { sellerStats } from "@/lib/catalog";
import { CITIES } from "@/data/sellers";
import { formatMonthYear } from "@/lib/format";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Monogram } from "../ui/Monogram";

export function SellerRow({ seller }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();
  const stats = sellerStats(seller.code);
  return (
    <Link href={link(`/seller/${seller.code}`)} className="group flex items-center gap-4 border-b border-line py-5 first:border-t">
      <Monogram seller={seller} size={52} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[17px] font-semibold text-fg">
          <span className="a-underline-hover truncate">{t(seller.name)}</span>
        </p>
        <p className="mt-1 text-[13px] text-fg-3">
          {t(CITIES[seller.city])} · {ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })}
        </p>
      </div>
      <div className="hidden text-end text-[13px] text-fg-2 sm:block">
        <p>
          <span className="font-semibold text-fg tabular">{stats.activeAuctions}</span> {ui("activeAuctions")}
        </p>
        <p className="mt-0.5">
          <span className="font-semibold text-fg tabular">{stats.buyNowCount}</span> {ui("buyNowItems")}
        </p>
      </div>
      <DirIcon icon={ArrowRight} className="size-4 shrink-0 text-fg-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg rtl:group-hover:-translate-x-1" />
    </Link>
  );
}
