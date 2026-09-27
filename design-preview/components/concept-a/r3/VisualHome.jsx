"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { BagDrawer, WatchDrawer } from "./drawers";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { FeaturedNow, Hero } from "./Hero";
import { LiveMiniPlayer } from "./LiveMiniPlayer";
import { CategoriesOverlay, MenuOverlay, SearchOverlay } from "./overlays";
import { BulkRows, ClosingSoon, Confidence, DealsMosaic, GradesBand, HowItWorks, LiveBlock, Mosaic, SellersShowcase, Stories } from "./sections";
import { VisualProvider } from "./state";

function Page() {
  const { t } = useLang();
  // One live-event simulation feeds both the live block and the mini-player.
  const live = useLiveEvent();
  return (
    <>
      <a
        href="#main"
        className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-full bg-primary px-4 py-2.5 vm-sm font-bold text-on-primary shadow-raised transition-transform focus:translate-y-0"
      >
        {t(COPY.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Stories />
        <FeaturedNow />
        <Mosaic />
        <LiveBlock live={live} />
        <ClosingSoon />
        <DealsMosaic />
        <SellersShowcase />
        <BulkRows />
        <Confidence />
        <GradesBand />
        <HowItWorks />
      </main>
      <Footer />
      <LiveMiniPlayer live={live} />
      <CategoriesOverlay />
      <SearchOverlay />
      <MenuOverlay />
      <BagDrawer />
      <WatchDrawer />
    </>
  );
}

/**
 * Option 2 — Visual Marketplace home (Round 3B).
 * One header bar over a centred discovery hero framed by product cut-outs;
 * four Featured tiles straddle its edge. Then the same business sections as
 * Option 1, each told visually: the category mosaic, an immersive live block,
 * a wide closing-soon rail, the Buy Now deals mosaic, large seller photos,
 * mirrored bulk & pallet rows, the trust points on photography, grades and
 * how it works. The live sale also follows you in a floating mini-player.
 */
export function VisualHome() {
  return (
    <R3Root>
      <VisualProvider>
        <Page />
      </VisualProvider>
    </R3Root>
  );
}
