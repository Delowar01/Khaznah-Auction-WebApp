"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Gavel, Globe2, Heart, LayoutGrid, Menu, Package, Search, ShoppingBag } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { DEMO_USER, NAV } from "@/data/site";
import { COPY } from "./copy";
import { useVisual } from "./state";
import { Count, IconButton, LiveDot, cx } from "./ui";

const navLabel = (key) => NAV.find((item) => item.key === key).label;

/** Link to the same page in the other language. */
export function LangLink({ className = "", onClick }) {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const other = lang === "ar" ? "en" : "ar";
  const href = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);
  return (
    <Link href={href} hrefLang={other} lang={other} onClick={onClick} aria-label={t(COPY.switchLanguageLabel)} className={className}>
      {t(COPY.switchLanguage)}
    </Link>
  );
}

/** Account actions shared by the desktop popover and the mobile menu. */
export function useAccountItems() {
  const { t } = useLang();
  const { toast, watched } = useStore();
  const { open } = useVisual();
  return [
    { key: "bids", icon: Gavel, label: t(COPY.myBids), run: () => toast({ tone: "info", title: t(COPY.myBids), description: t(COPY.myBidsText) }) },
    { key: "orders", icon: Package, label: t(COPY.orders), run: () => toast({ tone: "neutral", title: t(COPY.orders), description: t(COPY.ordersText) }) },
    { key: "watchlist", icon: Heart, label: t(COPY.watchlist), count: watched.size, run: () => open("watchlist") },
    { key: "notifications", icon: Bell, label: t(COPY.notifications), run: () => toast({ tone: "neutral", title: t(COPY.notifications), description: t(COPY.notificationsText) }) },
  ];
}

export function AccountCard({ className = "" }) {
  const { t } = useLang();
  const first = t(DEMO_USER.name).split(" ")[0];
  return (
    <div className={cx("flex items-center gap-3", className)}>
      <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-primary vm-sm font-extrabold text-on-primary">
        {t(DEMO_USER.initials)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate vm-md font-bold text-fg">{t(COPY.hello, { name: first })}</p>
        <p className="vm-xs text-fg-3">
          {t(COPY.walletBalance)} · <Money value={DEMO_USER.walletBalance} className="font-bold text-fg" />
        </p>
      </div>
    </div>
  );
}

function AccountPopover() {
  const { t } = useLang();
  const items = useAccountItems();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-1.5 rounded-full ps-1 pe-2.5 text-fg transition-colors hover:bg-surface-2"
      >
        <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-primary vm-xs font-extrabold text-on-primary">
          {t(DEMO_USER.initials)}
        </span>
        <span className="sr-only">{t(COPY.accountMenu)}</span>
        <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", open ? "rotate-180" : "")} />
      </button>
      {open ? (
        <div id={panelId} className="absolute end-0 top-[calc(100%+10px)] z-50 w-[300px] rounded-[22px] border border-line bg-elevated p-2 shadow-overlay kz-fade-up">
          <AccountCard className="px-3 pb-3 pt-2" />
          <p className="mx-3 mb-2 rounded-xl bg-surface-2 px-3 py-2 vm-xs text-fg-2">{t(COPY.walletText)}</p>
          <ul className="grid">
            {items.map(({ key, icon: Icon, label, count, run }) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    run();
                  }}
                  className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-start vm-sm font-semibold text-fg transition-colors hover:bg-surface-2"
                >
                  <Icon aria-hidden="true" className="size-[18px] text-fg-2" />
                  <span className="flex-1">{label}</span>
                  {count ? <span className="tabular vm-xs font-bold text-fg-3">{count}</span> : null}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-line px-3 pb-1 pt-3 vm-xs text-fg-3">
            <span className="inline-flex items-center gap-1.5">
              <Globe2 aria-hidden="true" className="size-4" />
              {t(COPY.country)}: <span className="font-semibold text-fg-2">{t(COPY.saudiArabia)}</span>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const linkClass = "inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-3 vm-sm font-bold text-fg transition-colors hover:bg-surface-2 xl:px-3.5";

/**
 * Option 2 header: ONE bar with links either side of a centred logo.
 * Transparent over the home hero, solid once the page scrolls. Search is a
 * labelled button (the field itself lives in the hero), Categories opens a
 * full-screen visual overlay. Phones and tablets: menu · logo · watch · search · bag.
 */
export function Header() {
  const { t } = useLang();
  const { link } = useConcept();
  const { cartCount, watched } = useStore();
  const { open, layer } = useVisual();
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="vm-header sticky top-pbar z-40 -mb-[var(--vm-header-h)]" data-solid={solid ? "true" : "false"}>
      <div className="vm-container grid h-[var(--vm-header-h)] grid-cols-[1fr_auto_1fr] items-center gap-2 lg:gap-4">
        {/* Start side */}
        <div className="flex items-center justify-self-start">
          <IconButton label={t(COPY.openMenu)} onClick={() => open("menu")} aria-expanded={layer === "menu"} className="-ms-2 lg:hidden">
            <Menu aria-hidden="true" className="size-6" />
          </IconButton>
          <nav aria-label={t(COPY.primaryNav)} className="hidden items-center gap-0.5 lg:flex">
            <button type="button" onClick={() => open("categories")} aria-expanded={layer === "categories"} className={cx(linkClass, "-ms-3.5")}>
              <LayoutGrid aria-hidden="true" className="size-[18px]" />
              {t(COPY.categories)}
            </button>
            <Link href={link("/browse?tab=buy_now")} className={linkClass}>
              {t(navLabel("buy-now"))}
            </Link>
            <Link href={link("/browse?tab=auction")} className={linkClass}>
              {t(navLabel("auctions"))}
            </Link>
          </nav>
        </div>

        {/* Centre */}
        <Link href={link("/")} className="justify-self-center rounded-lg outline-offset-4">
          <Logo variant="lockup" title={t(COPY.home)} className="h-8 w-auto lg:h-9" />
        </Link>

        {/* End side */}
        <div className="flex items-center justify-self-end">
          <nav aria-label={t(COPY.secondaryNav)} className="hidden items-center gap-0.5 lg:flex">
            <Link href={link("/live-auction")} className={linkClass}>
              <LiveDot />
              {t(navLabel("live"))}
            </Link>
            <Link href={link("/seller")} className={linkClass}>
              {t(navLabel("sellers"))}
            </Link>
          </nav>
          <div className="flex items-center" aria-label={t(COPY.accountNav)} role="group">
            <button
              type="button"
              onClick={() => open("search")}
              aria-expanded={layer === "search"}
              className="hidden h-11 items-center gap-2 whitespace-nowrap rounded-full border border-line-strong/70 bg-surface/70 ps-3.5 pe-4 vm-sm font-bold text-fg transition-colors hover:border-fg lg:ms-1.5 lg:inline-flex"
            >
              <Search aria-hidden="true" className="size-[18px]" />
              <span className="xl:hidden">{t(COPY.searchShort)}</span>
              <span className="hidden xl:inline">{t(COPY.searchTitle)}</span>
            </button>
            <IconButton label={t(COPY.watchlistCount, { n: watched.size })} onClick={() => open("watchlist")} className="lg:ms-1 lg:hidden xl:grid">
              <Heart aria-hidden="true" className="size-[22px]" />
              <Count n={watched.size} />
            </IconButton>
            <IconButton label={t(COPY.searchTitle)} onClick={() => open("search")} className="lg:hidden">
              <Search aria-hidden="true" className="size-[22px]" />
            </IconButton>
            <div className="hidden lg:ms-1 lg:block">
              <AccountPopover />
            </div>
            <IconButton label={t(COPY.bagCount, { n: cartCount })} onClick={() => open("bag")} className="-me-2 lg:me-0">
              <ShoppingBag aria-hidden="true" className="size-[22px]" />
              <Count n={cartCount} />
            </IconButton>
            <LangLink className="ms-1 hidden h-11 items-center rounded-full px-3 vm-sm font-bold text-fg transition-colors hover:bg-surface-2 lg:inline-flex" />
          </div>
        </div>
      </div>
    </header>
  );
}
