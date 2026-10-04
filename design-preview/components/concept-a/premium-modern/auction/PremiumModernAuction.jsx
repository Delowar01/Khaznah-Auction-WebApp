"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { resolveAuctionLot } from "@/components/shared/auction/hooks";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { COPY } from "../copy";
import { Footer, Newsletter } from "../Footer";
import { Header } from "../Header";
import { Cart, Menu } from "../Layers";
import { AuctionView } from "./AuctionView";

function Page({ product }) {
  const { t } = useLang();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[4px] bg-[var(--pr-charcoal)] px-4 py-2.5 pr-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      {/* An auction lot belongs to Timed Auctions. */}
      <Header active="timed" />
      <main id="main" tabIndex={-1} className="outline-none">
        {/* Keyed by lot so the simulated auction restarts for each one. */}
        <AuctionView key={product.slug} product={product} />
      </main>
      <Newsletter />
      <Footer />
      {/* Room under the footer for the phone bid bar. */}
      <div aria-hidden="true" className="h-[calc(72px+env(safe-area-inset-bottom))] md:hidden" />
      <Menu active="timed" />
      <Cart />
    </div>
  );
}

/**
 * Option 2 — Premium Modern Marketplace: Auction Detail (approved design
 * system). The home page's masthead, newsletter and footer around an
 * editorial lot page in which bidding leads (see AuctionView).
 */
export function PremiumModernAuction({ slug }) {
  const product = resolveAuctionLot(slug);
  return (
    <R3Root>
      <HomeStateProvider>
        <Page product={product} />
      </HomeStateProvider>
    </R3Root>
  );
}
