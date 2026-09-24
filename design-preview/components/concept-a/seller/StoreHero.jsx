"use client";

import Link from "next/link";
import { MapPin, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { CITIES } from "@/data/sellers";
import { formatMonthYear } from "@/lib/format";
import { Img } from "@/components/shared/ui/Img";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { Monogram } from "../ui/Monogram";
import { ShareButton } from "../ui/Actions";
import { COPY } from "../copy";

/** Storefront masthead: warehouse cover, monogram, name and credentials. */
export function StoreHero({ seller }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();
  return (
    <section>
      <div className="mx-auto max-w-[1360px] px-5 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("sellers"), href: link("/#sellers") }, { label: t(seller.name) }]} />
      </div>
      <div className="mx-auto mt-6 max-w-[1360px] sm:px-6 lg:px-10">
        <div className="relative overflow-hidden sm:rounded-card">
          <div className="relative aspect-[16/10] sm:aspect-[21/8]">
            <Img image={seller.cover} alt="" priority sizes="100vw" className={`absolute inset-0 size-full ${seller.cover?.kind === "scene" ? "object-cover" : "a-plate-img bg-plate object-contain p-10"}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" aria-hidden="true" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4 sm:gap-6">
                <Monogram seller={seller} size={88} className="hidden ring-4 ring-white/15 sm:inline-grid" />
                <Monogram seller={seller} size={60} className="ring-2 ring-white/15 sm:hidden" />
                <div className="min-w-0 text-white">
                  {seller.liveNow ? (
                    <Link href={link("/live-auction")} className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--live-solid)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white rtl:text-xs rtl:normal-case rtl:tracking-normal">
                      <span className="kz-live-dot !size-1.5 !bg-white" aria-hidden="true" />
                      {t(COPY.joinSellerLive)}
                    </Link>
                  ) : null}
                  <h1 className="a-display text-[36px] sm:text-[56px] rtl:sm:text-[48px]">{t(seller.name)}</h1>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/85 rtl:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <Warehouse aria-hidden="true" className="size-4" />
                      {seller.platform ? ui("platformSeller") : ui("sellerWarehouse")}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden="true" className="size-4" />
                      {t(CITIES[seller.city])}
                    </span>
                    <span>{ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })}</span>
                  </p>
                </div>
              </div>
              <ShareButton label={ui("shareStore")} className="self-start text-white sm:self-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
