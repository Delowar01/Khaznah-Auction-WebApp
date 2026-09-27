"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, ChevronDown, Gavel, Heart, Menu, Package, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { CATEGORIES } from "@/data/categories";
import { getProduct } from "@/data/products";
import { SELLERS } from "@/data/sellers";
import { DEMO_USER } from "@/data/site";
import { POPULAR_SEARCHES, detailPath, searchProducts } from "@/lib/catalog";
import { COPY } from "./copy";
import { CATEGORY_TILES } from "./data";
import { usePremium } from "./state";
import { cx } from "./ui";

const tileImage = (slug) => CATEGORY_TILES.find((tile) => tile.slug === slug);

/** The same page in the other language (stays inside this option). */
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

/** Where the header's links go; Shop opens the category panel instead. */
export function useNavItems() {
  const { ui } = useLang();
  return [
    { key: "buy", label: ui("buyNow"), href: "/browse?tab=buy_now" },
    { key: "auctions", label: ui("auctions"), href: "/browse?tab=auction" },
    { key: "live", label: ui("live"), href: "/live-auction", live: true },
    { key: "sellers", label: ui("sellers"), href: "/seller" },
  ];
}

function Count({ n }) {
  if (!n) return null;
  return (
    <span aria-hidden="true" className="absolute -end-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-on-primary tabular">
      {n}
    </span>
  );
}

function IconButton({ label, onClick, expanded, children, className = "", ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
      className={cx("relative grid size-10 shrink-0 place-items-center rounded-full text-fg transition-colors hover:bg-surface-2", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

// ── Search: suggestions for the expanding header search ─────────────────
function useSuggestions(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const lots = searchProducts(query).slice(0, 5);
  const categories = CATEGORIES.filter((c) => c.name.en.toLowerCase().includes(q) || c.name.ar.includes(query.trim())).slice(0, 3);
  const sellers = SELLERS.filter((s) => s.name.en.toLowerCase().includes(q) || s.name.ar.includes(query.trim())).slice(0, 2);
  return { lots, categories, sellers };
}

function Suggestions({ query, onPick, onSubmitTerm, listId }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const results = useSuggestions(query);
  if (!results) {
    return (
      <div id={listId} className="p-5 lg:p-6">
        <p className="pm-label text-fg-3">{t(COPY.popularSearches)}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <li key={term.en}>
              <button type="button" onClick={() => onSubmitTerm(t(term))} className="h-9 rounded-control border border-line-strong px-3.5 pm-sm text-fg hover:border-fg">
                {t(term)}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 pm-label text-fg-3">{t(COPY.shopByCategory)}</p>
        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link href={link(`/browse?category=${category.slug}`)} onClick={onPick} className="pm-link pm-sm text-fg">
                {t(category.name)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const empty = !results.lots.length && !results.categories.length && !results.sellers.length;
  return (
    <div id={listId} className="grid gap-6 p-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:p-6">
      <div>
        <p className="pm-label text-fg-3">{t(COPY.resultsLots)}</p>
        {empty ? <p className="mt-3 pm-sm text-fg-2">{t(COPY.noMatch, { q: query.trim() })}</p> : null}
        <ul className="mt-2 divide-y divide-line">
          {results.lots.map((product) => (
            <li key={product.slug}>
              <Link href={link(detailPath(product))} onClick={onPick} className="flex items-center gap-3 py-2.5 hover:bg-surface-2/60">
                <span className="pm-plate relative size-12 shrink-0 overflow-hidden rounded-card">
                  <Img image={product.images[0]} alt="" sizes="48px" className="pm-multiply size-full object-contain p-1" />
                </span>
                <span className="min-w-0 flex-1 truncate pm-sm text-fg">{t(product.title)}</span>
                <Money value={product.saleType === "buy_now" ? product.price : product.currentBid} className="pm-sm font-semibold text-fg" />
              </Link>
            </li>
          ))}
        </ul>
        <Link href={link(`/browse?search=${encodeURIComponent(query.trim())}`)} onClick={onPick} className="mt-3 inline-flex items-center gap-1.5 pm-link pm-sm font-semibold text-fg">
          {t(COPY.seeAllResults, { q: query.trim() })}
          <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
        </Link>
      </div>
      <div className="space-y-5">
        {results.categories.length ? (
          <div>
            <p className="pm-label text-fg-3">{t(COPY.resultsCategories)}</p>
            <ul className="mt-2 space-y-1.5">
              {results.categories.map((category) => (
                <li key={category.slug}>
                  <Link href={link(`/browse?category=${category.slug}`)} onClick={onPick} className="pm-link pm-sm text-fg">
                    {t(category.name)} <span className="text-fg-3">· {pl("lots", category.count)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {results.sellers.length ? (
          <div>
            <p className="pm-label text-fg-3">{t(COPY.resultsSellers)}</p>
            <ul className="mt-2 space-y-1.5">
              {results.sellers.map((seller) => (
                <li key={seller.code}>
                  <Link href={link(`/seller/${seller.code}`)} onClick={onPick} className="pm-link pm-sm text-fg">
                    {t(seller.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SearchField({ query, setQuery, onClose, onSubmit, inputId, controls, className = "" }) {
  const { t } = useLang();
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(query);
      }}
      className={cx("flex h-12 items-center gap-3 border-b border-fg", className)}
    >
      <Search aria-hidden="true" className="size-5 shrink-0 text-fg" strokeWidth={1.75} />
      <label className="sr-only" htmlFor={inputId}>
        {t(COPY.searchLabel)}
      </label>
      <input
        data-pm-search=""
        id={inputId}
        type="search"
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t(COPY.searchPlaceholder)}
        aria-controls={controls}
        className="pm-search h-full min-w-0 flex-1 bg-transparent pm-md text-fg outline-none placeholder:text-fg-3"
      />
      <button type="button" onClick={onClose} aria-label={t(COPY.closeSearch)} className="grid size-9 shrink-0 place-items-center rounded-full text-fg hover:bg-surface-2">
        <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
      </button>
    </form>
  );
}

function useSearch() {
  const router = useRouter();
  const { link } = useConcept();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  const submit = (term) => {
    const value = term.trim();
    if (!value) return;
    router.push(link(`/browse?search=${encodeURIComponent(value)}`));
    close();
  };
  useEffect(() => {
    // Desktop and phones each render their own field; focus the visible one.
    if (!open) return;
    const fields = [...document.querySelectorAll("[data-pm-search]")];
    fields.find((field) => field.offsetParent !== null)?.focus();
  }, [open]);
  return { open, setOpen, query, setQuery, close, submit };
}

// ── Shop: the category panel with photography (desktop) ─────────────────
function ShopPanel({ onPick }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const ways = [
    { label: ui("buyNow"), href: "/browse?tab=buy_now" },
    { label: ui("auctions"), href: "/browse?tab=auction" },
    { label: ui("liveAuctions"), href: "/live-auction" },
    { label: t(COPY.bulk), href: "/browse?category=bulk-pallets" },
    { label: ui("sellers"), href: "/seller" },
  ];
  return (
    <div className="pm-container grid grid-cols-[minmax(0,1fr)_220px] gap-10 py-8">
      <ul className="grid grid-cols-4 gap-5">
        {CATEGORIES.map((category) => {
          const tile = tileImage(category.slug);
          return (
            <li key={category.slug}>
              <Link href={link(`/browse?category=${category.slug}`)} onClick={onPick} className="group block">
                <span className={cx("pm-zoom relative block aspect-[4/3] overflow-hidden rounded-card", tile?.studio ? "pm-plate" : "bg-surface-2")}>
                  <Img
                    image={tile?.image || category.image}
                    alt=""
                    sizes="220px"
                    className={cx("absolute inset-0 size-full", tile?.studio ? "pm-multiply object-contain p-[14%]" : "object-cover")}
                    style={tile?.position ? { objectPosition: tile.position } : undefined}
                  />
                </span>
                <span className="mt-2 block pm-sm font-semibold text-fg group-hover:underline">{t(category.name)}</span>
                <span className="block pm-xs text-fg-3">{pl("lots", category.count)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-s border-line ps-8">
        <p className="pm-label text-fg-3">{t(COPY.waysToShop)}</p>
        <ul className="mt-4 space-y-3">
          {ways.map((way) => (
            <li key={way.href}>
              <Link href={link(way.href)} onClick={onPick} className="pm-link pm-md text-fg">
                {way.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Saved lots and account popovers ─────────────────────────────────────
function Popover({ label, icon, count, children, width = "w-80" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);
  return (
    <div ref={ref} className="relative">
      <IconButton label={label} expanded={open} onClick={() => setOpen((v) => !v)} aria-haspopup="dialog">
        {icon}
        <Count n={count} />
      </IconButton>
      {open ? (
        <div role="dialog" aria-label={label} className={cx("absolute end-0 top-[calc(100%+12px)] z-50 rounded-card border border-line bg-elevated p-5 shadow-overlay", width)}>
          {children(close)}
        </div>
      ) : null}
    </div>
  );
}

export function SavedList({ onPick }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { watched } = useStore();
  const items = [...watched].map(getProduct).filter(Boolean);
  if (!items.length) return <p className="pm-sm text-fg-2">{t(COPY.savedEmpty)}</p>;
  return (
    <ul className="divide-y divide-line">
      {items.map((product) => (
        <li key={product.slug}>
          <Link href={link(detailPath(product))} onClick={onPick} className="flex items-center gap-3 py-2.5">
            <span className="pm-plate relative size-12 shrink-0 overflow-hidden rounded-card">
              <Img image={product.images[0]} alt="" sizes="48px" className="pm-multiply size-full object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1 truncate pm-sm text-fg">{t(product.title)}</span>
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
    { key: "bids", icon: Gavel, label: t(COPY.myBids), run: () => toast({ tone: "info", title: t(COPY.myBids), description: t(COPY.myBidsText) }) },
    { key: "orders", icon: Package, label: t(COPY.orders), run: () => toast({ tone: "neutral", title: t(COPY.orders), description: t(COPY.ordersText) }) },
  ];
}

export function AccountSummary() {
  const { t } = useLang();
  const first = t(DEMO_USER.name).split(" ")[0];
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 pm-sm font-semibold text-fg">
        {t(DEMO_USER.initials)}
      </span>
      <div className="min-w-0">
        <p className="truncate pm-md font-semibold text-fg">{t(COPY.hello, { name: first })}</p>
        <p className="pm-xs text-fg-3">
          {t(COPY.walletBalance)} · <Money value={DEMO_USER.walletBalance} className="font-semibold text-fg" />
        </p>
      </div>
    </div>
  );
}

// ── The header ──────────────────────────────────────────────────────────
export function Header() {
  const { t } = useLang();
  const { link } = useConcept();
  const { cartCount, watched } = useStore();
  const { open } = usePremium();
  const nav = useNavItems();
  const search = useSearch();
  const listId = useId();
  const [shopOpen, setShopOpen] = useState(false);
  const shopRef = useRef(null);
  const closeShop = useCallback(() => setShopOpen(false), []);
  const searchRef = useRef(null);
  useDismiss(shopOpen, closeShop, shopRef);
  useDismiss(search.open, search.close, searchRef);
  const accountItems = useAccountItems();

  return (
    <header className="pm-header sticky top-pbar z-40">
      <div ref={searchRef}>
        <div className="pm-container flex h-[60px] items-center gap-4 lg:h-[var(--pm-header-h)] lg:gap-8">
          <Link href={link("/")} className="shrink-0 rounded-sm outline-offset-4">
            <Logo variant="lockup" title={t(COPY.home)} className="h-8 w-auto lg:h-9" />
          </Link>

          {/* Desktop: navigation, or the search field when search is open */}
          <div ref={shopRef} className="hidden min-w-0 flex-1 lg:block">
            {search.open ? (
              <SearchField
                query={search.query}
                setQuery={search.setQuery}
                onClose={search.close}
                onSubmit={search.submit}
                inputId={`${listId}-desktop`}
                controls={listId}
                className="mx-auto max-w-2xl"
              />
            ) : (
              <nav aria-label={t(COPY.mainNav)} className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  aria-expanded={shopOpen}
                  onClick={() => setShopOpen((v) => !v)}
                  className="inline-flex h-10 items-center gap-1 rounded-control px-3.5 pm-sm font-semibold text-fg hover:bg-surface-2"
                >
                  {t(COPY.shop)}
                  <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", shopOpen && "rotate-180")} />
                </button>
                {nav.map((item) => (
                  <Link key={item.key} href={link(item.href)} className="inline-flex h-10 items-center gap-2 rounded-control px-3.5 pm-sm font-semibold text-fg hover:bg-surface-2">
                    {item.live ? <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--live)]" /> : null}
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
            {shopOpen && !search.open ? (
              <div className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-raised">
                <ShopPanel onPick={closeShop} />
              </div>
            ) : null}
          </div>

          <div className="ms-auto flex items-center gap-1 lg:ms-0">
            {search.open ? null : (
              <IconButton label={t(COPY.search)} expanded={search.open} onClick={() => search.setOpen(true)}>
                <Search aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </IconButton>
            )}
            <div className="hidden lg:block">
              <Popover label={t(COPY.savedCount, { n: watched.size })} count={watched.size} icon={<Heart aria-hidden="true" className="size-5" strokeWidth={1.75} />}>
                {(close) => (
                  <>
                    <p className="pm-label text-fg-3">{t(COPY.saved)}</p>
                    <div className="mt-2">
                      <SavedList onPick={close} />
                    </div>
                  </>
                )}
              </Popover>
            </div>
            <div className="hidden lg:block">
              <Popover label={t(COPY.accountMenu)} icon={<UserRound aria-hidden="true" className="size-5" strokeWidth={1.75} />}>
                {(close) => (
                  <>
                    <AccountSummary />
                    <p className="mt-2 pm-xs text-fg-3">{t(COPY.walletText)}</p>
                    <ul className="mt-4 divide-y divide-line border-t border-line">
                      {accountItems.map((item) => (
                        <li key={item.key}>
                          <button
                            type="button"
                            onClick={() => {
                              item.run();
                              close();
                            }}
                            className="flex w-full items-center gap-3 py-3 text-start pm-sm text-fg hover:underline"
                          >
                            <item.icon aria-hidden="true" className="size-4 text-fg-2" strokeWidth={1.75} />
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Popover>
            </div>
            <IconButton label={t(COPY.bagCount, { n: cartCount })} onClick={() => open("bag")}>
              <ShoppingBag aria-hidden="true" className="size-5" strokeWidth={1.75} />
              <Count n={cartCount} />
            </IconButton>
            <LangLink className="hidden h-10 items-center rounded-control px-3 pm-sm font-semibold text-fg hover:bg-surface-2 lg:inline-flex" />
            <IconButton label={t(COPY.openMenu)} onClick={() => open("menu")} className="lg:hidden">
              <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </IconButton>
          </div>
        </div>

        {/* Phones and tablets: the search opens as a row under the bar */}
        {search.open ? (
          <div className="border-t border-line bg-surface lg:hidden">
            <div className="pm-container py-3">
              <SearchField query={search.query} setQuery={search.setQuery} onClose={search.close} onSubmit={search.submit} inputId={`${listId}-phone`} controls={listId} />
            </div>
          </div>
        ) : null}

        {search.open ? (
          <div className="absolute inset-x-0 top-full max-h-[70dvh] overflow-y-auto border-b border-line bg-surface shadow-raised">
            <div className="pm-container">
              <Suggestions query={search.query} onPick={search.close} onSubmitTerm={search.submit} listId={listId} />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

