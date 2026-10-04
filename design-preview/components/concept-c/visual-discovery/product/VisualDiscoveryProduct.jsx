"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { resolveProduct } from "@/components/shared/product/hooks";
import { R3Root } from "@/components/shared/r3/R3Root";
import { HomeStateProvider } from "@/components/shared/r3/home";
import { COPY } from "../copy";
import { Footer, Newsletter } from "../Footer";
import { Header } from "../Header";
import { Cart, Menu } from "../Layers";
import { ProductView } from "./ProductView";

function Page({ product }) {
  const { t } = useLang();
  // Single items sit under Buy Now in the masthead; cartons and pallets under Bulk & Pallets.
  const mode = product.itemType === "single" ? "buy" : "bulk";
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-full bg-[var(--vd-indigo)] px-5 py-2.5 vd-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header active={mode} />
      <main id="main" tabIndex={-1} className="outline-none">
        {/* Keyed by product so the quantity and gallery start afresh for each one. */}
        <ProductView key={product.slug} product={product} />
      </main>
      <Newsletter />
      <Footer />
      {/* Room under the footer for the floating phone Add to cart bar. */}
      <div aria-hidden="true" className="h-[calc(88px+env(safe-area-inset-bottom))] md:hidden" />
      <Menu active={mode} />
      <Cart />
    </div>
  );
}

/**
 * Option 3 — Visual Discovery Marketplace: Buy Now Product Detail (approved
 * design system). The home page's pill masthead, ivory newsletter and footer
 * around an image-led product page in which buying leads (see ProductView).
 */
export function VisualDiscoveryProduct({ slug }) {
  const product = resolveProduct(slug);
  return (
    <R3Root>
      <HomeStateProvider>
        <Page product={product} />
      </HomeStateProvider>
    </R3Root>
  );
}
