"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { BrandBase, GreenFooter } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Cart, Menu } from "./Layers";
import { AuctionsAndLive, BulkPanels, FeaturedItems, GradeStrip, HowItWorks, Recommended, RetailFloor, SellerDirectory, TrustStrip } from "./sections";

function Page() {
  const { t } = useLang();
  // One live-event simulation feeds the live panel.
  const live = useLiveEvent();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[7px] bg-[var(--sc-green)] px-4 py-2.5 sc-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <TrustStrip />
        {/* Auctions come before any Buy Now section. */}
        <AuctionsAndLive live={live} />
        <FeaturedItems />
        <RetailFloor />
        <Recommended />
        <SellerDirectory />
        <BulkPanels />
        <HowItWorks />
        <GradeStrip />
      </main>
      <footer className="mt-9 dt:mt-[36px]">
        <GreenFooter />
        <BrandBase />
      </footer>
      <Menu />
      <Cart />
    </div>
  );
}

/**
 * Option 4 — Contemporary Saudi Commerce home (approved design).
 * A cream utility bar over a white navigation row, a centred bilingual hero
 * with the marketplace search, a sage trust strip, then the auctions: Ending
 * soon beside one integrated live scene and Featured Items led by auction
 * lots. A local category rail beside four horizontal Buy Now cards and a
 * recommended pair follow, then a five-row seller directory, two sage pallet
 * panels, 01/02/03 steps, a seven-cell grade strip, and one green
 * newsletter/footer band above a white brand base.
 */
export function SaudiCommerceHome() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
