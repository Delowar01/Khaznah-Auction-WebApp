"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { CommandBar, HubMenu, SearchSheet } from "./Mobile";
import { BuyingOnKhazna, CategoryGrid, Counters, LiveLine, MiniTables, PalletsBulk, RecentlyAdded, SearchDeck, SellersAndLive } from "./modules";
import { QuickView } from "./QuickView";
import { Rail } from "./Rail";
import { HubProvider } from "./state";
import { TopBar } from "./TopBar";

function Dashboard() {
  const { t } = useLang();
  // One live-event simulation feeds the live line, the counters and the live module.
  const live = useLiveEvent();
  return (
    <main id="main" tabIndex={-1} className="hb-main pb-[calc(96px+env(safe-area-inset-bottom))] outline-none lg:pb-10">
      <h1 className="sr-only md:hidden">{t(COPY.deckEyebrow)}</h1>
      <LiveLine live={live} />
      <SearchDeck />
      <Counters live={live} />
      <CategoryGrid />
      <MiniTables />
      <SellersAndLive live={live} />
      <RecentlyAdded />
      <PalletsBulk />
      <BuyingOnKhazna />
    </main>
  );
}

/**
 * Option 3 — Marketplace Hub home (Round 3A).
 * An app shell: a navigation rail with the category tree (72px collapsed at
 * 1024–1279px, hidden on phones), a slim top bar, then a dashboard — live
 * line, search deck, counters, category grid, three mini-tables, sellers and
 * live modules, recently added, pallets, buying on Khazna. Phones get a
 * bottom command bar (Menu · Search · Cart) instead of the rail.
 */
export function HubHome() {
  const { t } = useLang();
  return (
    <R3Root>
      <HubProvider>
        <a
          href="#main"
          className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[8px] bg-primary px-4 py-2.5 hb-sm font-semibold text-on-primary shadow-raised transition-transform focus:translate-y-0"
        >
          {t(COPY.skip)}
        </a>
        <div className="hb-shell">
          <Rail />
          <div className="col-start-2 min-w-0">
            <TopBar />
            <Dashboard />
            <Footer />
          </div>
        </div>
        <CommandBar />
        <HubMenu />
        <SearchSheet />
        <QuickView />
        <CartDrawer />
      </HubProvider>
    </R3Root>
  );
}
