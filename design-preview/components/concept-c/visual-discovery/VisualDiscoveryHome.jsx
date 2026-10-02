"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { Footer, Newsletter } from "./Footer";
import { Header } from "./Header";
import { HeroMosaic } from "./Hero";
import { Cart, Menu } from "./Layers";
import { BulkPanels, CategoryPills, Clarity, EndingSoon, FeaturedItems, HowItWorks, LiveBanner, ProductWall, SellerShelves } from "./sections";

function Page() {
  const { t } = useLang();
  // One live-event simulation feeds the live banner.
  const live = useLiveEvent();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-full bg-[var(--vd-indigo)] px-5 py-2.5 vd-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroMosaic />
        <CategoryPills />
        {/* Auctions come before the Buy Now wall. */}
        <LiveBanner live={live} />
        <FeaturedItems />
        <EndingSoon />
        <ProductWall />
        <SellerShelves />
        <BulkPanels />
        <Clarity />
        <HowItWorks />
      </main>
      <Newsletter />
      <Footer />
      <Menu />
      <Cart />
    </div>
  );
}

/**
 * Option 3 — Visual Discovery Marketplace home (approved design).
 * White marketplace with a logo + pill-search masthead over a Discover row,
 * a mosaic hero (copy tile, furniture scene with an overlapping tote card,
 * stacked Electronics and Home & Kitchen tiles), eight outlined category
 * pills, then the auctions: a navy live banner, a Featured Items mosaic led
 * by auction lots and Ending soon's image-first cards. The
 * mixed-height Buy Now wall follows, then photographic seller shelves, two
 * bulk panels, a compact clarity row, How it works, an ivory newsletter and
 * a white footer with language and social links.
 */
export function VisualDiscoveryHome() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
