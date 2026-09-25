"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { COPY } from "./copy";
import { BagDrawer, WatchDrawer } from "./drawers";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { FeaturedNow, Hero } from "./Hero";
import { LiveMiniPlayer } from "./LiveMiniPlayer";
import { CategoriesOverlay, MenuOverlay, SearchOverlay } from "./overlays";
import { FeatureRows, GradesBand, HowItWorks, Mosaic, OnTheBlock, ReadyToBuy, Stories } from "./sections";
import { VisualProvider } from "./state";

/**
 * Option 2 — Visual Marketplace home (Round 3A).
 * One header bar over a centred discovery hero framed by product cut-outs;
 * four Featured tiles straddle its edge; then the category & seller mosaic,
 * mirrored feature rows, a 2×2 block of wide auction showcases, the Buy Now
 * mosaic, grades and how it works. Live runs as a floating mini-player.
 */
export function VisualHome() {
  const { t } = useLang();
  return (
    <R3Root>
      <VisualProvider>
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
          <FeatureRows />
          <OnTheBlock />
          <ReadyToBuy />
          <GradesBand />
          <HowItWorks />
        </main>
        <Footer />
        <LiveMiniPlayer />
        <CategoriesOverlay />
        <SearchOverlay />
        <MenuOverlay />
        <BagDrawer />
        <WatchDrawer />
      </VisualProvider>
    </R3Root>
  );
}
