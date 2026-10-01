"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ChevronDown, Heart, MapPin, Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { LanguageSwitch, useGoSearch, useHomeState, useSearchResults } from "@/components/shared/r3/home";
import { Popover } from "@/components/shared/r3/popover";
import { CATEGORIES } from "@/data/categories";
import { getProduct } from "@/data/products";
import { CITIES } from "@/data/sellers";
import { DEMO_USER } from "@/data/site";
import { POPULAR_SEARCHES, detailPath, isAuction } from "@/lib/catalog";
import { COPY } from "./copy";
import { cx } from "./ui";

/** The five shopping modes, in the approved order. */
export function useNavItems() {
  const { t } = useLang();
  return [
    { key: "buy", label: t(COPY.navBuyNow), href: "/browse?tab=buy_now" },
    { key: "timed", label: t(COPY.navTimed), href: "/browse?tab=auction" },
    { key: "live", label: t(COPY.navLive), href: "/live-auction" },
    { key: "sellers", label: t(COPY.navSellers), href: "/seller" },
    { key: "bulk", label: t(COPY.navBulk), href: "/browse?category=bulk-pallets" },
  ];
}

const iconLink = "inline-flex h-10 items-center gap-2 rounded-[4px] px-2 pr-md text-fg transition-colors hover:text-[var(--pr-bronze)]";
const panel = "rounded-[6px] border border-line bg-white p-4 shadow-overlay";

export function SavedList({ onPick }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { watched } = useStore();
  const items = [...watched].map(getProduct).filter(Boolean);
  if (!items.length) return <p className="pr-sm text-fg-2">{t(COPY.wishlistEmpty)}</p>;
  return (
    <ul className="divide-y divide-line">
      {items.map((product) => (
        <li key={product.slug}>
          <Link href={link(detailPath(product))} onClick={onPick} className="flex items-center gap-3 py-2.5 hover:underline">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-[4px] bg-white">
              <Img image={product.images[0]} alt="" sizes="44px" className="size-full object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1 truncate pr-sm text-fg">{t(product.title)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function useAccountItems() {
  const { t } = useLang();
  const { toast } = useStore();
  return [
    { key: "bids", label: t(COPY.myBids), run: () => toast({ tone: "info", title: t(COPY.myBids), description: t(COPY.myBidsText) }) },
    { key: "orders", label: t(COPY.orders), run: () => toast({ tone: "neutral", title: t(COPY.orders), description: t(COPY.ordersText) }) },
  ];
}

export function AccountSummary() {
  const { t } = useLang();
  const first = t(DEMO_USER.name).split(" ")[0];
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--pr-stone)] pr-sm font-semibold text-fg">
        {t(DEMO_USER.initials)}
      </span>
      <div className="min-w-0">
        <p className="truncate pr-lg font-semibold text-fg">{t(COPY.hello, { name: first })}</p>
        <p className="pr-xs text-fg-2">
          {t(COPY.walletBalance)} · <Money value={DEMO_USER.walletBalance} className="font-semibold text-fg" />
        </p>
      </div>
    </div>
  );
}

function CityPicker({ onPicked }) {
  const { t } = useLang();
  const { city, setCity } = useHomeState();
  return (
    <div>
      <p className="pr-md font-semibold text-fg">{t(COPY.chooseCity)}</p>
      <div role="radiogroup" aria-label={t(COPY.chooseCity)} className="mt-2 grid gap-0.5">
        {Object.entries(CITIES).map(([key, name]) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={city === key}
            onClick={() => {
              setCity(key);
              onPicked?.();
            }}
            className={cx("flex h-10 items-center justify-between rounded-[4px] px-2.5 pr-md", city === key ? "bg-[var(--pr-stone)] font-semibold text-fg" : "text-fg hover:bg-[var(--pr-stone)]")}
          >
            {t(name)}
            {city === key ? <span aria-hidden="true" className="size-2 rounded-full bg-[var(--pr-brass)]" /> : null}
          </button>
        ))}
      </div>
      <p className="mt-3 pr-xs text-fg-2">{t(COPY.cityText)}</p>
    </div>
  );
}

/** Hamburger + "All categories" and its category panel. */
function CategoryMenu({ compact = false }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  return (
    <Popover
      label={t(COPY.allCategories)}
      align="start"
      panelClassName={cx(panel, "w-[min(92vw,560px)]")}
      trigger={({ open, toggle, panelId }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={compact ? t(COPY.allCategories) : undefined}
          className={cx("inline-flex h-11 items-center gap-2.5 rounded-[4px] pr-lg font-medium text-fg hover:text-[var(--pr-bronze)]", compact ? "w-11 justify-center border border-line bg-white" : "pe-2")}
        >
          <Menu aria-hidden="true" className="size-[22px]" strokeWidth={1.7} />
          {compact ? null : (
            <>
              {t(COPY.allCategories)}
              <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", open && "rotate-180")} strokeWidth={2} />
            </>
          )}
        </button>
      )}
    >
      {(close) => (
        <ul className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link href={link(`/browse?category=${category.slug}`)} onClick={close} className="flex flex-col items-center gap-1.5 rounded-[4px] p-2 text-center hover:bg-[var(--pr-stone)]">
                <span className="relative h-14 w-full">
                  <Img image={category.image} cutout alt="" sizes="96px" className="absolute inset-0 size-full object-contain" />
                </span>
                <span className="pr-sm font-medium text-fg">{t(category.name)}</span>
                <span className="pr-xs text-fg-2">{pl("lots", category.count)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}

/** Broad rectangular search field with suggestions (no separate submit button). */
function SearchField({ className = "" }) {
  const { t } = useLang();
  const { link } = useConcept();
  const go = useGoSearch();
  const id = useId();
  const ref = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const results = useSearchResults(query);
  useDismiss(open, () => setOpen(false), ref);
  const listId = `${id}-list`;
  const pick = () => setOpen(false);
  return (
    <div ref={ref} className={cx("relative", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(false);
          go(query);
        }}
        className="flex h-12 items-center gap-3 rounded-[5px] border border-[#e0ddd6] bg-[var(--pr-search)] ps-4 pe-3 focus-within:border-[var(--pr-bronze)]"
      >
        <Search aria-hidden="true" className="size-5 shrink-0 text-fg" strokeWidth={1.8} />
        <label htmlFor={`${id}-q`} className="sr-only">
          {t(COPY.searchLabel)}
        </label>
        <input
          id={`${id}-q`}
          type="search"
          autoComplete="off"
          enterKeyHint="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t(COPY.searchPlaceholder)}
          aria-controls={open ? listId : undefined}
          className="pr-search h-full min-w-0 flex-1 bg-transparent pr-md text-fg outline-none"
        />
      </form>
      {open ? (
        <div id={listId} className={cx("absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-[70dvh] overflow-y-auto", panel)}>
          {!results ? (
            <>
              <p className="pr-xs font-semibold uppercase tracking-[0.1em] text-fg-2">{t(COPY.popularSearches)}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <li key={term.en}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        go(t(term));
                      }}
                      className="h-9 rounded-[4px] border border-line bg-white px-3 pr-sm text-fg hover:border-[var(--pr-bronze)]"
                    >
                      {t(term)}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div>
                <p className="pr-xs font-semibold uppercase tracking-[0.1em] text-fg-2">{t(COPY.resultsLots)}</p>
                {results.lots.length ? null : <p className="mt-2 pr-sm text-fg-2">{t(COPY.noMatch, { q: query.trim() })}</p>}
                <ul className="mt-1 divide-y divide-line">
                  {results.lots.map((product) => (
                    <li key={product.slug}>
                      <Link href={link(detailPath(product))} onClick={pick} className="flex items-center gap-3 py-2 hover:underline">
                        <span className="relative size-11 shrink-0 overflow-hidden rounded-[4px] bg-white">
                          <Img image={product.images[0]} alt="" sizes="44px" className="size-full object-contain p-1" />
                        </span>
                        <span className="min-w-0 flex-1 truncate pr-sm text-fg">{t(product.title)}</span>
                        <Money value={isAuction(product) ? product.currentBid : product.price} className="pr-sm font-semibold text-fg" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={link(`/browse?search=${encodeURIComponent(query.trim())}`)} onClick={pick} className="pr-link mt-2 inline-flex pr-sm font-semibold text-[var(--pr-bronze)]">
                  {t(COPY.seeAllResults, { q: query.trim() })}
                </Link>
              </div>
              {results.categories.length || results.sellers.length ? (
                <div className="space-y-4">
                  {results.categories.length ? (
                    <div>
                      <p className="pr-xs font-semibold uppercase tracking-[0.1em] text-fg-2">{t(COPY.resultsCategories)}</p>
                      <ul className="mt-1.5 space-y-1">
                        {results.categories.map((category) => (
                          <li key={category.slug}>
                            <Link href={link(`/browse?category=${category.slug}`)} onClick={pick} className="pr-link pr-sm text-fg">
                              {t(category.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {results.sellers.length ? (
                    <div>
                      <p className="pr-xs font-semibold uppercase tracking-[0.1em] text-fg-2">{t(COPY.resultsSellers)}</p>
                      <ul className="mt-1.5 space-y-1">
                        {results.sellers.map((seller) => (
                          <li key={seller.code}>
                            <Link href={link(`/seller/${seller.code}`)} onClick={pick} className="pr-link pr-sm text-fg">
                              {t(seller.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function CityButton() {
  const { t } = useLang();
  const { city } = useHomeState();
  return (
    <Popover
      label={t(COPY.chooseCity)}
      panelClassName={cx(panel, "w-64")}
      trigger={({ open, toggle, panelId }) => (
        <button type="button" onClick={toggle} aria-expanded={open} aria-controls={open ? panelId : undefined} className="inline-flex h-10 items-center gap-1.5 rounded-[4px] px-1.5 pr-md text-fg hover:text-[var(--pr-bronze)]">
          <MapPin aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          <span className="sr-only">{t(COPY.location)}: </span>
          {t(CITIES[city])}
          <ChevronDown aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
        </button>
      )}
    >
      {(close) => <CityPicker onPicked={close} />}
    </Popover>
  );
}

export function PremiumLanguage({ className = "", onNavigate }) {
  const { t } = useLang();
  return (
    <LanguageSwitch
      label={t(COPY.language)}
      onNavigate={onNavigate}
      className={cx("flex items-center", className)}
      separator={<span aria-hidden="true" className="mx-2.5 h-4 w-px bg-[#cfcac0]" />}
      itemClass={(current) => cx("pr-md", current ? "font-semibold text-fg" : "text-fg hover:text-[var(--pr-bronze)] hover:underline")}
    />
  );
}

export function Header() {
  const { t } = useLang();
  const { link } = useConcept();
  const { cartCount, watched } = useStore();
  const { open } = useHomeState();
  const nav = useNavItems();
  const accountItems = useAccountItems();

  const account = (
    <Popover
      label={t(COPY.account)}
      panelClassName={cx(panel, "w-72")}
      trigger={({ open: isOpen, toggle, panelId }) => (
        <button type="button" onClick={toggle} aria-expanded={isOpen} aria-controls={isOpen ? panelId : undefined} className={iconLink}>
          <UserRound aria-hidden="true" className="size-[21px]" strokeWidth={1.6} />
          <span className="hidden dt:inline">{t(COPY.account)}</span>
          <span className="sr-only dt:hidden">{t(COPY.account)}</span>
        </button>
      )}
    >
      {(close) => (
        <>
          <AccountSummary />
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {accountItems.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => {
                    item.run();
                    close();
                  }}
                  className="flex h-11 w-full items-center text-start pr-md text-fg hover:underline"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Popover>
  );

  return (
    <header className="bg-bg">
      {/* Row 1: shopping modes · centred logo · wishlist, account, cart */}
      <div data-ref="01" className="border-b border-line">
        <div className="pr-container grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 md:h-[76px] dt:h-[85px]">
          {/* The shopping modes sit inline from 1200 px (16 px apart below
              1440 so they stay on one line). The Arabic labels are wider, so
              Arabic keeps the menu button until 1366 px. */}
          <div className="flex items-center justify-self-start">
            <button type="button" onClick={() => open("menu")} aria-label={t(COPY.openMenu)} className="-ms-2 grid size-11 place-items-center rounded-[4px] text-fg ltr:dt:hidden rtl:min-[1366px]:hidden">
              <Menu aria-hidden="true" className="size-6" strokeWidth={1.7} />
            </button>
            <nav aria-label={t(COPY.mainNav)} className="hidden ltr:dt:block rtl:min-[1366px]:block">
              <ul className="flex items-center gap-4 wd:gap-7">
                {nav.map((item, i) => (
                  <li key={item.key}>
                    <Link href={link(item.href)} className={cx("pr-link pr-md hover:text-[var(--pr-bronze)]", i === 0 ? "font-semibold text-fg" : "text-[#3c3f49]")}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link href={link("/")} className="justify-self-center rounded-[4px] outline-offset-4">
            <Logo variant="lockup" title={t(COPY.home)} className="h-10 w-auto md:h-12 dt:h-[60px]" />
          </Link>

          <div className="flex items-center justify-self-end gap-1 dt:gap-4">
            <div className="hidden dt:block">
              <Popover
                label={t(COPY.wishlist)}
                panelClassName={cx(panel, "w-80")}
                trigger={({ open: isOpen, toggle, panelId }) => (
                  <button type="button" onClick={toggle} aria-expanded={isOpen} aria-controls={isOpen ? panelId : undefined} aria-label={t(COPY.wishlistCount, { n: watched.size })} className={iconLink}>
                    <Heart aria-hidden="true" className="size-[21px]" strokeWidth={1.6} />
                    <span aria-hidden="true">{t(COPY.wishlist)}</span>
                  </button>
                )}
              >
                {(close) => (
                  <>
                    <p className="mb-1 pr-md font-semibold text-fg">{t(COPY.wishlist)}</p>
                    <SavedList onPick={close} />
                  </>
                )}
              </Popover>
            </div>
            {account}
            <button type="button" onClick={() => open("cart")} aria-label={t(COPY.cartCount, { n: cartCount })} className={cx(iconLink, "-me-2 dt:me-0")}>
              <ShoppingCart aria-hidden="true" className="size-[22px]" strokeWidth={1.6} />
              <span aria-hidden="true" className="hidden dt:inline">
                {t(COPY.cart)}
              </span>
              <span aria-hidden="true" className="grid h-[22px] min-w-[22px] place-items-center rounded-full bg-[var(--pr-brass)] px-1 pr-xs font-semibold text-[#171b27] tabular">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: all categories · broad search · city · language */}
      <div data-ref="02" className="border-b border-line">
        <div className="pr-container grid h-[60px] grid-cols-[auto_minmax(0,1fr)] items-center gap-2 dt:h-[57px] dt:grid-cols-[242px_minmax(0,1fr)_248px] dt:gap-0">
          <div className="hidden dt:block">
            <CategoryMenu />
          </div>
          <div className="dt:hidden">
            <CategoryMenu compact />
          </div>
          <SearchField />
          <div className="hidden items-center justify-end gap-5 dt:flex">
            <CityButton />
            <PremiumLanguage />
          </div>
        </div>
      </div>
    </header>
  );
}
