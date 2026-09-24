"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Bookmark, Menu, Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/shared/brand/Logo";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { BRAND } from "@/data/site";
import { cx } from "../ui/cx";
import { AccountMenu } from "./AccountMenu";
import { CartDrawer } from "./CartDrawer";
import { useChromePanelRequests } from "./chromeEvents";
import { MainNav } from "./MainNav";
import { MobileMenu } from "./MobileMenu";
import { SearchPanel } from "./SearchPanel";
import { WatchlistDrawer } from "./WatchlistDrawer";

function CountIcon({ icon: Icon, count, label, onClick, className = "" }) {
  return (
    <button type="button" onClick={onClick} aria-label={count ? `${label} (${count})` : label} className={cx("c-iconbtn", className)}>
      <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
      {count ? <span className="c-count" aria-hidden="true">{count}</span> : null}
    </button>
  );
}

/** Sticky main header: logo, centred nav, search, wallet, watchlist, cart. */
export function SiteHeader() {
  const { t, ui } = useLang();
  const { base } = useConcept();
  const { cartCount, watched } = useStore();
  const [panel, setPanel] = useState(null); // search · menu · cart · watch
  const searchRef = useRef(null);
  const close = useCallback(() => setPanel(null), []);
  useChromePanelRequests(setPanel);
  const toggleSearch = () => setPanel((p) => (p === "search" ? null : "search"));

  return (
    <>
      <header className="sticky top-pbar z-50 border-b border-line bg-bg/95 backdrop-blur-md supports-[backdrop-filter]:bg-bg/85">
        <div className="c-container grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 lg:flex lg:h-20 lg:gap-6">
          <div className="flex items-center lg:hidden">
            <button type="button" data-testid="mobile-menu-button" onClick={() => setPanel("menu")} aria-label={ui("openMenu")} aria-expanded={panel === "menu"} className="c-iconbtn -ms-2">
              <Menu aria-hidden="true" className="size-6" strokeWidth={1.75} />
            </button>
          </div>

          <Link href={base} aria-label={t(BRAND.name)} className="c-logo justify-self-center lg:shrink-0">
            <Logo variant="lockup" decorative className="h-9 w-auto lg:h-11" />
          </Link>

          <MainNav className="mx-auto hidden lg:block" />

          <div className="flex items-center justify-end gap-0.5 lg:gap-1.5">
            <button
              ref={searchRef}
              type="button"
              onClick={toggleSearch}
              aria-expanded={panel === "search"}
              aria-label={ui("searchShort")}
              className={cx(
                "flex h-11 items-center gap-2.5 rounded-control text-fg-2 transition-colors hover:text-fg",
                "w-11 justify-center xl:w-52 xl:justify-start xl:border xl:border-line-strong xl:bg-surface xl:px-3.5 xl:hover:border-fg",
                panel === "search" && "text-fg xl:border-fg",
              )}
            >
              <Search aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
              <span className="hidden truncate text-sm xl:inline">{ui("searchShort")}</span>
            </button>
            <div className="hidden lg:block">
              <AccountMenu onWatchlist={() => setPanel("watch")} />
            </div>
            <CountIcon icon={Bookmark} count={watched.size} label={ui("watchlist")} onClick={() => setPanel("watch")} className="hidden md:grid" />
            <CountIcon icon={ShoppingBag} count={cartCount} label={ui("cart")} onClick={() => setPanel("cart")} className="-me-2 lg:me-0" />
          </div>
        </div>
        <SearchPanel open={panel === "search"} onClose={close} triggerRef={searchRef} />
      </header>

      <MobileMenu open={panel === "menu"} onClose={close} onWatchlist={() => setPanel("watch")} />
      <CartDrawer open={panel === "cart"} onClose={close} />
      <WatchlistDrawer open={panel === "watch"} onClose={close} />
    </>
  );
}
