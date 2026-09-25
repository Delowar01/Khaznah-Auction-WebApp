"use client";

import Link from "next/link";
import { Check, Eye, Gavel, Sparkle } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { getProduct } from "@/data/products";
import { cutout, BRAND_PHOTOS } from "@/data/media";
import { LIVE_EVENT } from "@/data/live";
import { getSeller } from "@/data/sellers";
import { HERO } from "@/data/site";
import { detailPath } from "@/lib/catalog";
import { LiveBadge } from "../ui/Badge";
import { ButtonLink, buttonClass } from "../ui/Button";
import { CountdownPill, useLotClock } from "../ui/Countdown";
import { BrowseLink } from "../utils/navigation";
import { palletFromPrice } from "../utils/lots";
import { COPY } from "../copy";

const FRIDGE = cutout("fridge-690");
const TV = cutout("tv-43");

function FeaturedLotChip() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const product = getProduct(HERO.featuredLot);
  const { remaining, phase } = useLotClock(product);
  return (
    <Link
      href={link(detailPath(product))}
      className="absolute end-6 top-6 z-10 hidden w-64 items-center gap-3 rounded-xl bg-white/10 p-2.5 text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/15 xl:flex"
    >
      <span className="size-14 shrink-0 overflow-hidden rounded-lg bg-plate">
        <Img image={product.images[0]} alt="" sizes="56px" className="kb-pack size-full object-contain p-1" />
      </span>
      <span className="min-w-0">
        <span className="block kb-eyebrow text-[var(--kb-gold-soft)]">{t(COPY.featuredLot)}</span>
        <span className="block truncate kb-xs font-semibold">{t(product.title)}</span>
        <span className="mt-0.5 flex items-center gap-2">
          <Money value={product.currentBid} className="kb-sm font-extrabold" />
          <CountdownPill phase={phase} remaining={remaining} className="bg-white/15! text-white!" />
        </span>
        <span className="sr-only">{ui("currentBid")}</span>
      </span>
    </Link>
  );
}

/** Slide 1 — brand promise on a deep green panel with the fridge and TV cut-outs. */
export function BrandSlide() {
  const { t } = useLang();
  return (
    <div className="kb-brand-panel kb-on-dark relative size-full overflow-hidden">
      <div aria-hidden="true" className="kb-brand-grid absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-y-0 end-0 hidden w-[44%] sm:block">
        <div className="kb-glow absolute bottom-[4%] end-[26%] size-[70%] opacity-70" />
        <div className="absolute bottom-0 end-0 h-[62%]">
          <Img image={TV} alt="" sizes="280px" className="h-full w-auto opacity-95 drop-shadow-[0_24px_40px_rgb(0_0_0/0.45)]" />
        </div>
        <div className="absolute bottom-6 end-[30%] h-[74%]">
          <Img
            image={FRIDGE}
            alt=""
            sizes="200px"
            className="h-full w-auto [filter:drop-shadow(0_0_1px_rgb(255_255_255/0.6))_drop-shadow(0_28px_36px_rgb(0_0_0/0.55))]"
          />
        </div>
        <div className="absolute bottom-4 end-[27%] h-5 w-[36%] rounded-[50%] bg-black/45 blur-lg" />
      </div>
      <FeaturedLotChip />
      <div className="relative z-[1] flex h-full flex-col justify-center gap-4 p-6 pb-20 sm:max-w-[62%] sm:p-10 sm:pb-20 lg:ps-12">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 kb-xs font-semibold text-[var(--kb-gold-soft)] ring-1 ring-white/15">
          <Sparkle aria-hidden="true" className="size-3.5" />
          {t(HERO.eyebrow)}
        </p>
        <h2 className="kb-hero-title text-white">
          {HERO.titleLines.map((line) => (
            <span key={line.en} className="block">
              {t(line)}
            </span>
          ))}
        </h2>
        <p className="max-w-md kb-md text-white/80">{t(HERO.body)}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <BrowseLink href="/browse?tab=auction" className={buttonClass({ variant: "brand", size: "lg" })}>
            <Gavel aria-hidden="true" className="size-5" />
            {t(HERO.primaryCta)}
          </BrowseLink>
          <BrowseLink href="/browse?tab=buy_now" className={buttonClass({ variant: "on-dark", size: "lg" })}>
            {t(HERO.secondaryCta)}
          </BrowseLink>
        </div>
      </div>
    </div>
  );
}

/** Slide 2 — the live event, with its current lot and live bid. */
export function LiveSlide({ live }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const host = getSeller(LIVE_EVENT.host);
  const lot = live.current;
  return (
    <div className="kb-on-dark relative size-full overflow-hidden bg-secondary">
      <Img image={LIVE_EVENT.stream} alt="" sizes="(min-width: 1024px) 60vw, 100vw" className="absolute inset-0 size-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-black/10 sm:bg-linear-to-r rtl:sm:bg-linear-to-l" />
      <div className="relative z-[1] flex h-full flex-col justify-end gap-4 p-6 pb-20 sm:max-w-[62%] sm:justify-center sm:p-10 sm:pb-20 lg:ps-12">
        <div className="flex flex-wrap items-center gap-2">
          <LiveBadge size="md">{ui("liveNow")}</LiveBadge>
          <span className="inline-flex h-6 items-center gap-1.5 rounded-md bg-black/50 px-2 kb-xs font-semibold text-white backdrop-blur">
            <Eye aria-hidden="true" className="size-3.5" />
            <span className="tabular">{pl("viewers", live.viewers)}</span>
          </span>
        </div>
        <h2 className="kb-h1 text-white">{t(LIVE_EVENT.title)}</h2>
        <p className="kb-sm text-white/80">
          {t(LIVE_EVENT.presenter)} · {ui("hostedBy")} {t(host.name)}
        </p>
        {lot ? (
          <div className="flex max-w-md items-center gap-3 rounded-xl bg-white/10 p-2.5 ring-1 ring-white/15 backdrop-blur-md">
            <span className="size-14 shrink-0 overflow-hidden rounded-lg bg-plate">
              <Img image={lot.image} alt="" sizes="56px" className="kb-pack size-full object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block kb-eyebrow text-[var(--kb-gold-soft)]">{t(COPY.liveSlideLot)}</span>
              <span className="block truncate kb-sm font-semibold text-white">{t(lot.title)}</span>
            </span>
            <span className="text-end text-white">
              <span className="block kb-2xs opacity-75">{ui("currentBid")}</span>
              <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash rounded px-1 kb-md font-extrabold" />
            </span>
          </div>
        ) : null}
        <div>
          <ButtonLink href={link("/live-auction")} variant="brand" size="lg">
            {ui("joinLive")}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/** Slide 3 — bulk pallets from the lowest current pallet price. */
export function PalletSlide() {
  const { t } = useLang();
  return (
    <div className="kb-on-dark relative size-full overflow-hidden bg-secondary">
      <Img image={BRAND_PHOTOS.warehouseFloor} alt="" sizes="(min-width: 1024px) 60vw, 100vw" className="absolute inset-0 size-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/20 sm:bg-linear-to-r sm:from-black/80 sm:via-black/45 sm:to-transparent rtl:sm:bg-linear-to-l" />
      <div className="relative z-[1] flex h-full flex-col justify-end gap-4 p-6 pb-20 sm:max-w-[60%] sm:justify-center sm:p-10 sm:pb-20 lg:ps-12">
        <h2 className="kb-h1 text-white">{t(COPY.palletsTitle)}</h2>
        <p className="flex items-baseline gap-2 text-white">
          <span className="kb-lg font-semibold opacity-85">{t(COPY.palletsFrom)}</span>
          <Money value={palletFromPrice()} className="kb-display text-[var(--kb-gold-soft)]" symbolClassName="text-[0.7em]" />
        </p>
        <p className="max-w-md kb-md text-white/80">{t(COPY.palletsBody)}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {COPY.palletsPoints.map((point) => (
            <li key={point.en} className="flex items-center gap-1.5 kb-sm font-semibold text-white">
              <Check aria-hidden="true" className="size-4 text-[var(--kb-gold-soft)]" strokeWidth={3} />
              {t(point)}
            </li>
          ))}
        </ul>
        <div>
          <BrowseLink href="/browse?category=bulk-pallets" className={buttonClass({ variant: "brand", size: "lg" })}>
            {t(COPY.palletsCta)}
          </BrowseLink>
        </div>
      </div>
    </div>
  );
}
