"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { BrowseRoute } from "@/components/shared/browse/BrowseRoute";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { COPY } from "../copy";
import { Footer, Newsletter } from "../Footer";
import { Header } from "../Header";
import { Cart, Menu } from "../Layers";
import { BrowseFallback, BrowseView } from "./BrowseView";

function Page() {
  const { t } = useLang();
  // The header marks the shopping mode the URL stands for (see BrowseRoute).
  const [active, setActive] = useState(null);
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[4px] bg-[var(--pr-charcoal)] px-4 py-2.5 pr-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header active={active} />
      <main id="main" tabIndex={-1} className="outline-none">
        <BrowseRoute fallback={<BrowseFallback />} onNav={setActive} view={BrowseView} />
      </main>
      <Newsletter />
      <Footer />
      <Menu active={active} />
      <Cart />
    </div>
  );
}

/**
 * Option 2 — Premium Modern Marketplace: Browse (approved design system).
 * The home page's masthead, newsletter and footer around an editorial
 * marketplace: brass-dash heading, the live auction on a stone band, text
 * tabs (All → Auctions → Buy Now), an unboxed filter rail and spacious cards
 * in which "Bid now" leads.
 */
export function PremiumModernBrowse() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
