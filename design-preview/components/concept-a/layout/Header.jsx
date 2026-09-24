"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/shared/brand/Logo";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useDismiss } from "@/components/shared/ui/hooks";
import { DEMO_USER } from "@/data/site";
import { Money } from "@/components/shared/ui/Money";
import { SearchOverlay } from "./SearchOverlay";
import { MobileMenu } from "./MobileMenu";
import { BagDrawer, WatchlistDrawer } from "./Drawers";
import { useChrome } from "./ChromeContext";

export const A_NAV = [
  { key: "auctions", path: "/browse?tab=auction", match: "auction", label: "auctions" },
  { key: "buy-now", path: "/browse?tab=buy_now", match: "product", label: "buyNow" },
  { key: "live", path: "/live-auction", match: "live-auction", label: "live", live: true },
  { key: "sellers", path: "/seller", match: "seller", label: "sellers" },
];

function AccountMenu() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, () => setOpen(false), ref);
  const item = (key) => (
    <button
      key={key}
      type="button"
      role="menuitem"
      onClick={() => {
        setOpen(false);
        toast({ tone: "info", title: ui(key) });
      }}
      className="block w-full px-4 py-2.5 text-start text-sm text-fg-2 hover:bg-surface-2 hover:text-fg"
    >
      {ui(key)}
    </button>
  );
  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ui("account")}
        className="a-serif grid size-10 place-items-center rounded-full border border-line-strong text-[15px] text-fg transition-colors hover:border-fg"
      >
        {t(DEMO_USER.initials)}
      </button>
      {open ? (
        <div role="menu" className="kz-fade-up absolute end-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-lg border border-line bg-elevated py-2 shadow-raised">
          <div className="border-b border-line px-4 pb-3 pt-1">
            <p className="a-serif text-lg text-fg">{t(DEMO_USER.name)}</p>
            <p className="mt-1 text-[13px] text-fg-3">
              {ui("walletBalance")} · <Money value={DEMO_USER.walletBalance} className="text-fg" />
            </p>
          </div>
          <div className="py-1">{["myBids", "orders", "watchlist", "wallet"].map(item)}</div>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const { ui } = useLang();
  const { link } = useConcept();
  const pathname = usePathname();
  const { cartCount, watched } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { bagOpen, setBagOpen } = useChrome();
  const [watchOpen, setWatchOpen] = useState(false);

  return (
    <header className="sticky top-pbar z-40 border-b border-line bg-bg/92 backdrop-blur-md supports-[backdrop-filter]:bg-bg/80">
      <div className="mx-auto grid h-16 max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:h-[76px] lg:px-10">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={ui("openMenu")}
            data-testid="mobile-menu-button"
            className="-ms-2 grid size-11 place-items-center rounded-full text-fg hover:bg-surface-2 lg:hidden"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
          <nav aria-label={ui("menu")} className="hidden items-center gap-7 lg:flex">
            {A_NAV.map((item) => {
              const active = pathname.includes(`/${item.match}`);
              return (
                <Link
                  key={item.key}
                  href={link(item.path)}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center gap-2 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors rtl:text-[15px] rtl:normal-case rtl:tracking-normal ${active ? "text-fg" : "text-fg-2 hover:text-fg"}`}
                >
                  {item.live ? <span className="kz-live-dot" aria-hidden="true" /> : null}
                  {ui(item.label)}
                  <span aria-hidden="true" className={`absolute inset-x-0 -bottom-0.5 h-px bg-fg transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        <Link href={link("/")} aria-label="Khazna" className="block">
          <Logo variant="lockup" decorative className="h-8 w-auto lg:h-10" />
        </Link>

        <div className="flex items-center justify-end gap-0.5 sm:gap-1.5">
          <button type="button" onClick={() => setSearchOpen(true)} aria-label={ui("search")} className="flex h-11 items-center gap-2 rounded-full px-3 text-fg hover:bg-surface-2">
            <Search aria-hidden="true" className="size-5" />
            <span className="hidden text-[12px] font-semibold uppercase tracking-[0.14em] xl:inline rtl:text-sm rtl:normal-case rtl:tracking-normal">{ui("search")}</span>
          </button>
          <button type="button" onClick={() => setWatchOpen(true)} aria-label={`${ui("watchlist")} (${watched.size})`} className="relative hidden size-11 place-items-center rounded-full text-fg hover:bg-surface-2 sm:grid">
            <Heart aria-hidden="true" className="size-5" />
            {watched.size ? <span className="absolute end-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-on-accent tabular">{watched.size}</span> : null}
          </button>
          <button type="button" onClick={() => setBagOpen(true)} aria-label={`${ui("bag")} (${cartCount})`} className="relative grid size-11 place-items-center rounded-full text-fg hover:bg-surface-2">
            <ShoppingBag aria-hidden="true" className="size-5" />
            {cartCount ? <span className="absolute end-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-secondary px-1 text-[10px] font-bold text-on-secondary tabular">{cartCount}</span> : null}
          </button>
          <AccountMenu />
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSearch={() => setSearchOpen(true)} />
      <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} />
      <WatchlistDrawer open={watchOpen} onClose={() => setWatchOpen(false)} />
    </header>
  );
}
