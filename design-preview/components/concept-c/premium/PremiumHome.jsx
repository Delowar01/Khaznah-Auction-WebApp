"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { BagDrawer, MenuDrawer } from "./drawers";
import { Footer, Newsletter } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Auctions, BuyNowEdit, BuyingOnKhazna, Categories, LiveSalon, Sellers, Trade } from "./sections";
import { PremiumProvider } from "./state";

function Page() {
  const { t } = useLang();
  const live = useLiveEvent();
  return (
    <>
      <a
        href="#main"
        className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-control bg-primary px-4 py-2.5 pm-sm font-semibold text-on-primary shadow-raised transition-transform focus:translate-y-0"
      >
        {t(COPY.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Categories />
        <BuyNowEdit />
        <Auctions />
        <Sellers />
        <LiveSalon live={live} />
        <Trade />
        <BuyingOnKhazna />
        <Newsletter />
      </main>
      <Footer />
      <MenuDrawer />
      <BagDrawer />
    </>
  );
}

/**
 * Option 3 — Premium Marketplace home (Round 3B).
 * A refined customer-facing store: one solid header (logo, centred
 * navigation, search that expands in the bar), a split hero with a large
 * lifestyle photograph and the featured lot, then an editorial category grid,
 * the Buy Now edit, a featured auction beside four related lots, storefront
 * previews, the live salon, trade pallets, "Buying on Khazna" and the
 * newsletter. Phones keep the same order with a drawer menu, 2-column
 * editorial grids and accordions.
 */
export function PremiumHome() {
  return (
    <R3Root>
      <PremiumProvider>
        <Page />
      </PremiumProvider>
    </R3Root>
  );
}
