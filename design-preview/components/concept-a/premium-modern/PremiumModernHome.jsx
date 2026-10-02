"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { Footer, Newsletter } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Cart, Menu } from "./Layers";
import { BulkRows, BuyNowShelf, CategoryRow, EndingSoonBand, FeaturedItems, GuidanceSplit, LiveSection, Selected, Sellers, TrustStrip } from "./sections";

function Page() {
  const { t } = useLang();
  // One live-event simulation feeds the hero pin and the live section.
  const live = useLiveEvent();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[4px] bg-[var(--pr-charcoal)] px-4 py-2.5 pr-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero live={live} />
        <CategoryRow />
        {/* Auctions come before any Buy Now section. */}
        <EndingSoonBand />
        <FeaturedItems />
        <LiveSection live={live} />
        <BuyNowShelf />
        <Selected />
        <BulkRows />
        <Sellers />
        <TrustStrip />
        <GuidanceSplit />
      </main>
      <Newsletter />
      <Footer />
      <Menu />
      <Cart />
    </div>
  );
}

/**
 * Option 2 — Premium Modern Marketplace home (approved design).
 * Warm ivory storefront: a centred-logo masthead over a separate search row,
 * a panoramic room hero with an inset copy card and a pinned live lot, eight
 * unboxed category photos, then an Ending soon stone band, a Featured Items
 * shelf led by auction lots and a split live auction, before
 * four equal Buy Now cards, two recommendation panels, two pallet rows, five
 * seller cards, a trust strip, grades beside How Khaznah works, a charcoal
 * newsletter and a light footer.
 */
export function PremiumModernHome() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
