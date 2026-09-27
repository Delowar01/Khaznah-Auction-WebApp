"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { Board } from "./Board";
import { COPY } from "./copy";
import { CartDrawer, DiscoverDrawer } from "./drawers";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { AuctionsHub, CategoryExplorer, Collections, NewIn, PriceDrops, SellerCollections, WhyKhazna } from "./sections";
import { DiscoveryProvider } from "./state";

function Page() {
  const { t } = useLang();
  // One live-event simulation feeds the board tile and the auctions section.
  const live = useLiveEvent();
  return (
    <>
      <a
        href="#main"
        className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-control bg-primary px-4 py-2.5 dc-sm font-bold text-on-primary shadow-raised transition-transform focus:translate-y-0"
      >
        {t(COPY.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Board live={live} />
        <CategoryExplorer />
        <PriceDrops />
        <AuctionsHub live={live} />
        <Collections />
        <SellerCollections />
        <NewIn />
        <WhyKhazna />
      </main>
      <Footer />
      <DiscoverDrawer />
      <CartDrawer />
    </>
  );
}

/**
 * Option 4 — Discovery Commerce home (Round 3B).
 * A compact header with a wide search, a Discover flyout and shortcut chips;
 * a discovery board (a collection flanked by a deal, new in, live now and
 * ending soon); then a colourful category explorer, a price-drops rail,
 * auctions inside the marketplace (live now beside an ending-soon rail),
 * themed collections, seller collections, a mixed-size "New in" feed and
 * "Why buy on Khazna". Phones pin the search and chips and turn every
 * section into a swipe rail or a 2-column feed.
 */
export function DiscoveryHome() {
  return (
    <R3Root>
      <DiscoveryProvider>
        <Page />
      </DiscoveryProvider>
    </R3Root>
  );
}
