"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { resolveProduct } from "@/components/shared/product/hooks";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { COPY } from "../copy";
import { BrandBase, GreenFooter } from "../Footer";
import { Header } from "../Header";
import { Cart, Menu } from "../Layers";
import { ProductView } from "./ProductView";

function Page({ product }) {
  const { t } = useLang();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[7px] bg-[var(--sc-green)] px-4 py-2.5 sc-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      {/* A product is bought at a fixed price, so it belongs to Buy Now (cartons and pallets too, like auction lots under Timed Auctions). */}
      <Header active="buy" />
      <main id="main" tabIndex={-1} className="outline-none">
        {/* Keyed by product so the quantity and gallery start afresh for each one. */}
        <ProductView key={product.slug} product={product} />
      </main>
      <footer>
        <GreenFooter />
        <BrandBase />
      </footer>
      {/* Room under the footer for the phone Add to cart bar. */}
      <div aria-hidden="true" className="h-[calc(75px+env(safe-area-inset-bottom))] md:hidden" />
      <Menu active="buy" />
      <Cart />
    </div>
  );
}

/**
 * Option 4 — Contemporary Saudi Commerce: Buy Now Product Detail (approved
 * design system). The home page's cream utility bar, navigation and green
 * footer around a straightforward product page in which buying leads (see
 * ProductView).
 */
export function SaudiCommerceProduct({ slug }) {
  const product = resolveProduct(slug);
  return (
    <R3Root>
      <HomeStateProvider>
        <Page product={product} />
      </HomeStateProvider>
    </R3Root>
  );
}
