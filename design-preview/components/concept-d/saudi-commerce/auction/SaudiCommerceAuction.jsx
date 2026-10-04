"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { resolveAuctionLot } from "@/components/shared/auction/hooks";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { COPY } from "../copy";
import { BrandBase, GreenFooter } from "../Footer";
import { Header } from "../Header";
import { Cart, Menu } from "../Layers";
import { AuctionView } from "./AuctionView";

function Page({ product }) {
  const { t } = useLang();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[7px] bg-[var(--sc-green)] px-4 py-2.5 sc-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      {/* An auction lot belongs to Timed Auctions. */}
      <Header active="timed" />
      <main id="main" tabIndex={-1} className="outline-none">
        {/* Keyed by lot so the simulated auction restarts for each one. */}
        <AuctionView key={product.slug} product={product} />
      </main>
      <footer>
        <GreenFooter />
        <BrandBase />
      </footer>
      {/* Room under the footer for the phone bid bar. */}
      <div aria-hidden="true" className="h-[calc(74px+env(safe-area-inset-bottom))] md:hidden" />
      <Menu active="timed" />
      <Cart />
    </div>
  );
}

/**
 * Option 4 — Contemporary Saudi Commerce: Auction Detail (approved design
 * system). The home page's cream utility bar, navigation and green footer
 * around a practical lot page in which bidding leads (see AuctionView).
 */
export function SaudiCommerceAuction({ slug }) {
  const product = resolveAuctionLot(slug);
  return (
    <R3Root>
      <HomeStateProvider>
        <Page product={product} />
      </HomeStateProvider>
    </R3Root>
  );
}
