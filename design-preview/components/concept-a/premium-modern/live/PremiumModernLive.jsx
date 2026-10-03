"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { COPY } from "../copy";
import { Footer, Newsletter } from "../Footer";
import { Header } from "../Header";
import { Cart, Menu } from "../Layers";
import { LiveView } from "./LiveView";

function Page() {
  const { t } = useLang();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[4px] bg-[var(--pr-charcoal)] px-4 py-2.5 pr-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header active="live" />
      <main id="main" tabIndex={-1} className="outline-none">
        <LiveView />
      </main>
      <Newsletter />
      <Footer />
      {/* Room under the footer for the live bid bar (phones and tablets). */}
      <div aria-hidden="true" className="h-[calc(72px+env(safe-area-inset-bottom))] lg:hidden" />
      <Menu active="live" />
      <Cart />
    </div>
  );
}

/**
 * Option 2 — Premium Modern Marketplace: Live Auction (approved design
 * system). The home page's masthead, newsletter and footer around an
 * auction-house live room (see LiveView).
 */
export function PremiumModernLive() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
