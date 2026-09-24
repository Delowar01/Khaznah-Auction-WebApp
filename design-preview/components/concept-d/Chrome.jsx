"use client";

import { usePathname } from "next/navigation";
import { parsePath } from "@/lib/routes";
import { MarketProvider } from "./market/MarketProvider";
import { ChromeProvider, isDetailRoute } from "./layout/ChromeContext";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { MobileDock } from "./layout/MobileDock";
import { MobileMenu } from "./layout/MobileMenu";
import { CartDrawer } from "./layout/CartDrawer";
import { CommandPalette } from "./layout/CommandPalette";
import { useCopy } from "./lib/useCopy";

function SkipLink() {
  const c = useCopy();
  return (
    <a href="#main" className="d-skip rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-raised">
      {c("skipToContent")}
    </a>
  );
}

/**
 * Concept D chrome. The market engines (one useAuction per lot + the live
 * event) live here, so every page — and every client-side navigation —
 * shares one consistent, continuously running auction floor.
 */
export function Chrome({ children }) {
  const pathname = usePathname();
  const { rest } = parsePath(pathname);
  const showDock = !isDetailRoute(rest);

  return (
    <MarketProvider>
      <ChromeProvider>
        <SkipLink />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer dockSpace={showDock} />
        {showDock ? <MobileDock /> : null}
        <MobileMenu />
        <CartDrawer />
        <CommandPalette />
      </ChromeProvider>
    </MarketProvider>
  );
}
