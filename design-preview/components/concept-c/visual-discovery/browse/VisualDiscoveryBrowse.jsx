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
  // The header's mode pills mark the shopping mode the URL stands for.
  const [active, setActive] = useState(null);
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-full bg-[var(--vd-indigo)] px-5 py-2.5 vd-md font-semibold text-white transition-transform focus:translate-y-0">
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
 * Option 3 — Visual Discovery Marketplace: Browse (approved design system).
 * The home page's pill masthead, ivory newsletter and footer around a
 * discovery-first marketplace: photo category pills, the navy live banner, a
 * pinned pill bar (All → Auctions → Buy Now, quick toggles, all filters in a
 * rounded drawer) and image-led cards that load in batches.
 */
export function VisualDiscoveryBrowse() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
