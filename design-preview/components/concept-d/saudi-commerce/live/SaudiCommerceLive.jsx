"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { COPY } from "../copy";
import { BrandBase, GreenFooter } from "../Footer";
import { Header } from "../Header";
import { Cart, Menu } from "../Layers";
import { LiveView } from "./LiveView";

function Page() {
  const { t } = useLang();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[7px] bg-[var(--sc-green)] px-4 py-2.5 sc-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header active="live" />
      <main id="main" tabIndex={-1} className="outline-none">
        <LiveView />
      </main>
      <footer>
        <GreenFooter />
        <BrandBase />
      </footer>
      {/* Room under the footer for the live bid bar (phones and tablets). */}
      <div aria-hidden="true" className="h-[calc(74px+env(safe-area-inset-bottom))] lg:hidden" />
      <Menu active="live" />
      <Cart />
    </div>
  );
}

/**
 * Option 4 — Contemporary Saudi Commerce: Live Auction (approved design
 * system). The home page's cream utility bar, navigation and green footer
 * around a clean, structured live auction room (see LiveView).
 */
export function SaudiCommerceLive() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
