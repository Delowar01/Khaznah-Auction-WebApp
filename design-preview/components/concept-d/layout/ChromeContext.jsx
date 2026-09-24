"use client";

import { createContext, Suspense, useContext, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parsePath } from "@/lib/routes";

const ChromeContext = createContext(null);

/** Open/close state for the chrome overlays (palette, cart, mobile menu). */
export function ChromeProvider({ children }) {
  const [palette, setPalette] = useState(false);
  const [cart, setCart] = useState(false);
  const [menu, setMenu] = useState(false);
  const value = useMemo(
    () => ({
      paletteOpen: palette,
      openPalette: () => setPalette(true),
      closePalette: () => setPalette(false),
      cartOpen: cart,
      openCart: () => setCart(true),
      closeCart: () => setCart(false),
      menuOpen: menu,
      openMenu: () => setMenu(true),
      closeMenu: () => setMenu(false),
    }),
    [palette, cart, menu],
  );
  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function useChrome() {
  return useContext(ChromeContext);
}

/** Which top-level section a route belongs to (drives tab + dock highlights). */
export function sectionFor(rest, tab) {
  if (!rest) return "discover";
  if (rest.startsWith("/live-auction")) return "live";
  if (rest.startsWith("/seller")) return "sellers";
  if (rest.startsWith("/auction")) return "auctions";
  if (rest.startsWith("/product")) return "buy-now";
  if (rest.startsWith("/browse")) return tab === "auction" ? "auctions" : tab === "buy_now" ? "buy-now" : "browse";
  return null;
}

/** True on detail routes, where a sticky action bar replaces the mobile dock. */
export function isDetailRoute(rest) {
  return rest.startsWith("/product") || rest.startsWith("/auction") || rest.startsWith("/live-auction");
}

function WithParams({ rest, children }) {
  const params = useSearchParams();
  return children(sectionFor(rest, params.get("tab")));
}

/**
 * Render-prop that resolves the active section. Search params are read in a
 * Suspense boundary so static pages still pre-render (pathname-only first).
 */
export function WithSection({ children }) {
  const pathname = usePathname();
  const { rest } = parsePath(pathname);
  return (
    <Suspense fallback={children(sectionFor(rest, null))}>
      <WithParams rest={rest}>{children}</WithParams>
    </Suspense>
  );
}
