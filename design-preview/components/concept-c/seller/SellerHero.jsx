"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { CITIES } from "@/data/sellers";
import { formatMonthYear } from "@/lib/format";
import { COPY } from "../copy";
import { BiHeading } from "../ui/Bi";
import { Badge } from "../ui/Badges";
import { Diamond } from "../ui/Diamond";
import { ChamferFrame } from "../ui/Frame";
import { Breadcrumbs, ShareButton } from "../ui/Misc";
import { DiamondAvatar } from "./DiamondAvatar";

/** Storefront head: wide chamfered cover, diamond monogram, bilingual name, seller label and facts. */
export function SellerHero({ seller }) {
  const { t, ui, lang } = useLang();
  const { link } = useConcept();

  return (
    <section className="c-container pt-6 lg:pt-8">
      <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("sellers"), href: link("/seller") }, { label: t(seller.name) }]} />
      <ChamferFrame size="xl" className="mt-6" frameClassName="relative aspect-[16/9] bg-secondary sm:aspect-[16/6] lg:aspect-[16/5]">
        <Img image={seller.cover} alt="" priority sizes="(min-width: 1400px) 1320px, 100vw" className="size-full object-cover" />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        {seller.liveNow ? (
          <Link href={link("/live-auction")} className="c-badge c-badge--live absolute end-4 top-4 h-8 px-3 text-sm sm:end-6 sm:top-6">
            <Diamond variant="live" />
            {ui("sellerLive")} · {t(COPY.watchLive)}
          </Link>
        ) : null}
      </ChamferFrame>

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-7">
        <DiamondAvatar seller={seller} size="lg" ring className="-mt-12 ms-3 sm:-mt-16 sm:ms-8 sm:self-start" />
        <div className="min-w-0 flex-1 sm:pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <Warehouse aria-hidden="true" className="size-3.5" />
              {ui("sellerWarehouse")}
            </Badge>
            {seller.platform ? <Badge tone="primary">{ui("platformSeller")}</Badge> : null}
          </div>
          <BiHeading as="h1" size="display" content={seller.name} className="mt-3" titleClassName="text-[2.125rem] sm:text-[2.75rem] lg:text-[3.25rem]" />
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-fg-2">
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="size-4 text-fg-3" />
              {ui("basedIn", { city: t(CITIES[seller.city]) })}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-4 text-fg-3" />
              {ui("memberSince", { date: formatMonthYear(seller.memberSince, lang) })}
            </span>
          </p>
        </div>
        <ShareButton label={ui("shareStore")} description={t(seller.name)} className="self-start sm:self-end" />
      </div>
      <p className="c-prose mt-6 max-w-3xl text-lg">{t(seller.tagline)}</p>
    </section>
  );
}
