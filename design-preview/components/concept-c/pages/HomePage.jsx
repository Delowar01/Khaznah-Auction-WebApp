"use client";

import { useLiveEvent } from "@/lib/useLiveEvent";
import { Hero } from "../home/Hero";
import { CityIndex } from "../home/CityIndex";
import { CategoryBento } from "../home/CategoryBento";
import { FeaturedAuctions } from "../home/FeaturedAuctions";
import { EndingSoonBand } from "../home/EndingSoonBand";
import { LiveBand } from "../home/LiveBand";
import { BuyNowGrid } from "../home/BuyNowGrid";
import { GradeScale } from "../home/GradeScale";
import { ValuesSection } from "../home/ValuesSection";
import { TrustSection } from "../home/TrustSection";
import { HowItWorks } from "../home/HowItWorks";

export function HomePage() {
  // One live-sale engine feeds both the hero card and the live band.
  const live = useLiveEvent();
  return (
    <>
      <Hero live={live} />
      <CityIndex />
      <CategoryBento />
      <FeaturedAuctions />
      <EndingSoonBand />
      <LiveBand live={live} />
      <BuyNowGrid />
      <GradeScale />
      <ValuesSection />
      <TrustSection />
      <HowItWorks />
    </>
  );
}
