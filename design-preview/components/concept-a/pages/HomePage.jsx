"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { HERO } from "@/data/site";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { AuctionsRail } from "../home/AuctionsRail";
import { BulkSection } from "../home/BulkSection";
import { CategoryTiles } from "../home/CategoryTiles";
import { DealsGrid } from "../home/DealsGrid";
import { HeroCarousel } from "../home/HeroCarousel";
import { BrandSlide, LiveSlide, PalletSlide } from "../home/HeroSlides";
import { HowItWorksGrades } from "../home/HowItWorksGrades";
import { LiveBand } from "../home/LiveBand";
import { PromoTiles } from "../home/PromoTiles";
import { SellerShelf } from "../home/SellerShelf";
import { TrustStrip } from "../home/TrustStrip";

export function HomePage() {
  const { t } = useLang();
  // One live-event simulation feeds both the hero slide and the live band.
  const live = useLiveEvent();

  const slides = [
    { key: "brand", node: <BrandSlide /> },
    { key: "live", node: <LiveSlide live={live} /> },
    { key: "pallets", node: <PalletSlide /> },
  ];

  return (
    <>
      <h1 className="sr-only">{t(HERO.title)}</h1>
      <div className="kb-container pt-4 lg:pt-6">
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <HeroCarousel slides={slides} />
          </div>
          <div className="lg:col-span-4">
            <PromoTiles />
          </div>
        </div>
        <TrustStrip className="mt-3" />
      </div>

      <div className="kb-container mt-12 space-y-12 lg:mt-16 lg:space-y-20">
        <CategoryTiles />
        <AuctionsRail />
      </div>

      <LiveBand live={live} className="mt-12 lg:mt-16" />

      <div className="kb-container mt-12 space-y-12 pb-20 lg:mt-16 lg:space-y-20 lg:pb-28">
        <DealsGrid />
        <BulkSection />
        <SellerShelf />
        <HowItWorksGrades />
      </div>
    </>
  );
}
