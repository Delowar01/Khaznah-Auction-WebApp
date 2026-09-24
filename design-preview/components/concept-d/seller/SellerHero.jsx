"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Radio } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { CITIES } from "@/data/sellers";
import { formatMonthYear } from "@/lib/format";
import { Container } from "../ui/Layout";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { SellerAvatar, SellerMark } from "../ui/SellerAvatar";
import { ShareButton } from "../ui/Actions";
import { useCopy } from "../lib/useCopy";

/** Cover, monogram, name, verification, city, tenure and live-now state. */
export function SellerHero({ seller }) {
  const { link } = useConcept();
  const { t, ui, lang } = useLang();
  const c = useCopy();

  return (
    <div className="relative">
      <div className="d-scope-dark relative h-56 overflow-hidden border-b border-line bg-bg sm:h-72 lg:h-80">
        <Img image={seller.cover} alt="" priority sizes="100vw" className="absolute inset-0 size-full object-cover opacity-60" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/40" />
        <div aria-hidden="true" className="d-dotgrid absolute inset-0 opacity-50" />
        <Container className="relative pt-5">
          <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("sellers"), href: link("/seller") }, { label: t(seller.name) }]} />
        </Container>
      </div>

      <Container className="relative -mt-10 sm:-mt-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
            <SellerAvatar seller={seller} size="xl" className="ring-4 ring-bg" />
            <div className="min-w-0 sm:pt-[60px]">
              <div className="flex flex-wrap items-center gap-2">
                <SellerMark label={ui("sellerWarehouse")} />
                {seller.platform ? <span className="d-label rounded-full bg-accent/14 px-2 py-0.5 text-auction">{c("platformBadge")}</span> : null}
              </div>
              <h1 className="d-tight mt-1.5 text-3xl font-semibold text-fg sm:text-4xl">{t(seller.name)}</h1>
              <p className="mt-1.5 max-w-2xl text-[15px] text-fg-2">{t(seller.tagline)}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-fg-3">
                <span className="flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="size-3.5" />
                  {ui("basedIn", { city: t(CITIES[seller.city]) })}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  {ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:pt-[60px]">
            {seller.liveNow ? (
              <Link
                href={link("/live-auction")}
                className="inline-flex h-10 items-center gap-2 rounded-control bg-[var(--d-live-fill)] px-3.5 text-sm font-semibold text-[var(--d-ov-fg)] shadow-[0_10px_24px_-12px_var(--live)] transition-[filter] hover:brightness-110"
              >
                <span aria-hidden="true" className="kz-live-dot [--live:var(--d-ov-fg)]" />
                {ui("sellerLive")}
                <Radio aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
            <ShareButton label={ui("shareStore")} toastTitle={c("storeLinkCopied")} />
          </div>
        </div>
      </Container>
    </div>
  );
}
