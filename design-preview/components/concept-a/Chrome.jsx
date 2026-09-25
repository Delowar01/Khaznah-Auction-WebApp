"use client";

import { usePathname } from "next/navigation";
import { useLang } from "@/components/shared/providers/LangProvider";
import { COPY } from "./copy";
import { cx } from "./ui/cx";
import { ChromeProvider, useChrome } from "./layout/ChromeContext";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";
import { MiniCart } from "./layout/MiniCart";
import { MobileMenu } from "./layout/MobileMenu";
import { AccountSheet, CategorySheet, SignInDialog } from "./layout/MobileSheets";
import { MobileTabBar } from "./layout/MobileTabBar";
import { UtilityStrip } from "./layout/UtilityStrip";
import { WatchlistPanel } from "./layout/WatchlistPanel";

// Detail pages swap the bottom tab bar for their own sticky action bar
// (product and auction show their action box in a side column from tablet up).
const DETAIL = /\/(product|auction|live-auction)(\/|$)/;
const SIDE_BOX = /\/(product|auction)(\/|$)/;

function Frame({ children }) {
  const { t } = useLang();
  const { collapsed } = useChrome();
  const pathname = usePathname();
  const detail = DETAIL.test(pathname);
  const sideBox = SIDE_BOX.test(pathname);

  return (
    <div className="kb-shell" data-head={collapsed ? "collapsed" : "full"}>
      <a
        href="#main"
        className="kb-skip rounded-control bg-primary px-4 py-2.5 kb-sm font-bold text-on-primary shadow-raised outline-offset-4"
      >
        {t(COPY.skipToContent)}
      </a>
      <UtilityStrip />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      {detail ? null : <MobileTabBar />}
      <div
        aria-hidden="true"
        className={cx("bg-secondary", sideBox ? "md:hidden" : "lg:hidden", detail ? "h-[calc(76px+env(safe-area-inset-bottom))]" : "h-[var(--kb-tabbar)]")}
      />
      <MiniCart />
      <WatchlistPanel />
      <MobileMenu />
      <CategorySheet />
      <AccountSheet />
      <SignInDialog />
    </div>
  );
}

/** Concept B chrome: utility strip, three-tier header, footer, mobile tab bar and overlays. */
export function Chrome({ children }) {
  return (
    <ChromeProvider>
      <Frame>{children}</Frame>
    </ChromeProvider>
  );
}
