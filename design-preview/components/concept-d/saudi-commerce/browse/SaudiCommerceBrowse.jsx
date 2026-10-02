"use client";

import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { BrowseRoute } from "@/components/shared/browse/BrowseRoute";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { COPY } from "../copy";
import { BrandBase, GreenFooter } from "../Footer";
import { Header } from "../Header";
import { Cart, Menu } from "../Layers";
import { BrowseFallback, BrowseView } from "./BrowseView";

function Page() {
  const { t } = useLang();
  // The header marks the shopping mode the URL stands for (see BrowseRoute).
  const [active, setActive] = useState(null);
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[7px] bg-[var(--sc-green)] px-4 py-2.5 sc-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header active={active} />
      <main id="main" tabIndex={-1} className="outline-none">
        <BrowseRoute fallback={<BrowseFallback />} onNav={setActive} view={BrowseView} />
      </main>
      <footer className="mt-4 dt:mt-6">
        <GreenFooter />
        <BrandBase />
      </footer>
      <Menu active={active} />
      <Cart />
    </div>
  );
}

/**
 * Option 4 — Contemporary Saudi Commerce: Browse (approved design system).
 * The home page's cream utility bar, navigation and green footer around a
 * practical marketplace: a cream search band with the segmented search and
 * the live auction, a green All → Auctions → Buy Now switch, the sage
 * category rail as filters and the home page's auction-first cards.
 */
export function SaudiCommerceBrowse() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
