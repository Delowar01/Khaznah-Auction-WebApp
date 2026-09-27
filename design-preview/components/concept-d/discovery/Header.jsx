"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BadgeCheck, Boxes, ChevronDown, Gavel, Heart, LayoutGrid, MapPin, Package, Percent, Search, ShoppingCart, Sparkles, Store, Tag, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { CATEGORIES, CATEGORY_BY_SLUG } from "@/data/categories";
import { getProduct } from "@/data/products";
import { CITIES } from "@/data/sellers";
import { DEMO_USER } from "@/data/site";
import { POPULAR_SEARCHES, detailPath, isAuction, searchProducts } from "@/lib/catalog";
import { moneyText } from "@/lib/format";
import { COPY } from "./copy";
import { CATEGORY_CARDS } from "./data";
import { useDiscovery } from "./state";
import { LiveDot, TONE_BG, cx } from "./ui";

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

/** Shortcut chips: quick ways into the catalogue. */
export function useShortcuts() {
  const { t } = useLang();
  return [
    { key: "deals", icon: Percent, label: t(COPY.chipDeals), href: "/browse?tab=buy_now&has_discount=true" },
    { key: "new", icon: Sparkles, label: t(COPY.chipNew), href: "/browse?sort=newest" },
    { key: "ending", icon: Timer, label: t(COPY.chipEnding), href: "/browse?tab=auction&ending=1h" },
    { key: "live", live: true, label: t(COPY.chipLive), href: "/live-auction" },
    { key: "pallets", icon: Boxes, label: t(COPY.chipPallets), href: "/browse?item_type=pallet,bulk" },
    { key: "under", icon: Tag, label: t(COPY.chipUnder, { amount: moneyText(200) }), href: "/browse?max_price=200" },
    { key: "grade", icon: BadgeCheck, label: t(COPY.chipGrade), href: "/browse?condition=new,A" },
    { key: "sellers", icon: Store, label: t(COPY.chipSellers), href: "/seller" },
  ];
}

export function ChipRail({ className = "" }) {
  const { t } = useLang();
  const { link } = useConcept();
  const shortcuts = useShortcuts();
  return (
    <nav aria-label={t(COPY.shortcuts)} className={className}>
      <ul className="no-scrollbar relative flex gap-2 overflow-x-auto py-2.5">
        {shortcuts.map((chip) => (
          <li key={chip.key} className="shrink-0">
            <Link href={link(chip.href)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 dc-sm font-semibold text-fg transition-colors hover:border-fg">
              {chip.live ? <LiveDot /> : <chip.icon aria-hidden="true" className="size-4 text-accent" strokeWidth={2.2} />}
              {chip.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ── Search with suggestions ─────────────────────────────────────────────
function Suggestions({ query, onPick, onTerm, id }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const q = query.trim();
  if (!q) {
    return (
      <div id={id} className="p-4">
        <p className="dc-xs font-bold text-fg-3">{t(COPY.popularSearches)}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <li key={term.en}>
              <button type="button" onClick={() => onTerm(t(term))} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface-2 px-3 dc-sm font-semibold text-fg hover:bg-[color-mix(in_oklab,var(--surface-2)_85%,var(--text-primary))]">
                <Search aria-hidden="true" className="size-3.5 text-fg-3" />
                {t(term)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const lots = searchProducts(q).slice(0, 5);
  const lower = q.toLowerCase();
  const categories = CATEGORIES.filter((c) => c.name.en.toLowerCase().includes(lower) || c.name.ar.includes(q)).slice(0, 3);
  return (
    <div id={id} className="p-2">
      {lots.length === 0 && categories.length === 0 ? <p className="px-3 py-3 dc-sm text-fg-2">{t(COPY.noMatch, { q })}</p> : null}
      {categories.length ? (
        <ul className="flex flex-wrap gap-2 px-2 pb-2 pt-1">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={link(`/browse?category=${category.slug}`)} onClick={onPick} className="inline-flex h-8 items-center rounded-full bg-surface-2 px-3 dc-xs font-bold text-fg">
                {t(category.name)} · {pl("lots", category.count)}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      <ul>
        {lots.map((product) => (
          <li key={product.slug}>
            <Link href={link(detailPath(product))} onClick={onPick} className="flex items-center gap-3 rounded-[12px] px-2 py-2 hover:bg-surface-2">
              <span className="dc-plate relative size-11 shrink-0 overflow-hidden rounded-[10px]">
                <Img image={product.images[0]} alt="" sizes="44px" className="dc-multiply size-full object-contain p-1" />
              </span>
              <span className="min-w-0 flex-1 truncate dc-sm font-semibold text-fg">{t(product.title)}</span>
              <Money value={isAuction(product) ? product.currentBid : product.price} className="dc-sm font-bold text-fg" />
            </Link>
          </li>
        ))}
      </ul>
      <Link href={link(`/browse?search=${encodeURIComponent(q)}`)} onClick={onPick} className="mt-1 flex h-10 items-center rounded-[12px] px-2 dc-sm font-bold text-accent hover:bg-surface-2">
        {t(COPY.seeAllResults, { q })}
      </Link>
    </div>
  );
}

export function SearchBox({ className = "" }) {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const id = useId();
  const ref = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);
  const go = (term) => {
    const value = term.trim();
    if (!value) return;
    setOpen(false);
    router.push(link(`/browse?search=${encodeURIComponent(value)}`));
  };
  return (
    <div ref={ref} className={cx("relative", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          go(query);
        }}
        className="flex h-11 items-center gap-2 rounded-full border-2 border-fg bg-surface ps-4 pe-1 lg:h-12"
      >
        <Search aria-hidden="true" className="size-[18px] shrink-0 text-fg-2" />
        <label htmlFor={`${id}-q`} className="sr-only">
          {t(COPY.searchLabel)}
        </label>
        <input
          id={`${id}-q`}
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t(COPY.searchPlaceholder)}
          aria-controls={open ? `${id}-list` : undefined}
          className="dc-search h-full min-w-0 flex-1 bg-transparent dc-md text-fg outline-none placeholder:text-fg-3"
        />
        <button type="submit" className="inline-flex h-9 shrink-0 items-center rounded-full bg-primary px-4 dc-sm font-bold text-on-primary hover:bg-primary-hover lg:h-10 lg:px-5">
          {t(COPY.searchButton)}
        </button>
      </form>
      {open ? (
        <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-[60dvh] overflow-y-auto rounded-[18px] border border-line bg-elevated shadow-overlay">
          <Suggestions query={query} onPick={() => setOpen(false)} onTerm={go} id={`${id}-list`} />
        </div>
      ) : null}
    </div>
  );
}

// ── Popovers ────────────────────────────────────────────────────────────
function Popover({ label, button, children, width = "w-80", align = "end" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);
  return (
    <div ref={ref} className="relative">
      {button({ open, toggle: () => setOpen((v) => !v), label })}
      {open ? (
        <div role="dialog" aria-label={label} className={cx("absolute top-[calc(100%+10px)] z-50 rounded-[18px] border border-line bg-elevated p-4 shadow-overlay", align === "end" ? "end-0" : "start-0", width)}>
          {children(close)}
        </div>
      ) : null}
    </div>
  );
}

export function CityPicker({ onPicked }) {
  const { t } = useLang();
  const { city, setCity } = useDiscovery();
  return (
    <div>
      <p className="dc-sm font-bold text-fg">{t(COPY.chooseCity)}</p>
      <div role="radiogroup" aria-label={t(COPY.chooseCity)} className="mt-3 grid gap-1">
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
            className={cx("flex h-10 items-center justify-between rounded-[12px] px-3 dc-sm font-semibold", city === key ? "bg-surface-2 text-fg" : "text-fg-2 hover:bg-surface-2")}
          >
            {t(name)}
            {city === key ? <span aria-hidden="true" className="size-2 rounded-full bg-accent" /> : null}
          </button>
        ))}
      </div>
      <p className="mt-3 dc-xs text-fg-3">{t(COPY.deliveryText)}</p>
    </div>
  );
}

export function SavedList({ onPick }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { watched } = useStore();
  const items = [...watched].map(getProduct).filter(Boolean);
  if (!items.length) return <p className="dc-sm text-fg-2">{t(COPY.savedEmpty)}</p>;
  return (
    <ul className="grid gap-1">
      {items.map((product) => (
        <li key={product.slug}>
          <Link href={link(detailPath(product))} onClick={onPick} className="flex items-center gap-3 rounded-[12px] p-1.5 hover:bg-surface-2">
            <span className="dc-plate relative size-11 shrink-0 overflow-hidden rounded-[10px]">
              <Img image={product.images[0]} alt="" sizes="44px" className="dc-multiply size-full object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1 truncate dc-sm font-semibold text-fg">{t(product.title)}</span>
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
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--dc-butter)] dc-sm font-extrabold text-fg">
        {t(DEMO_USER.initials)}
      </span>
      <div className="min-w-0">
        <p className="truncate dc-md font-bold text-fg">{t(COPY.hello, { name: first })}</p>
        <p className="dc-xs text-fg-3">
          {t(COPY.walletBalance)} · <Money value={DEMO_USER.walletBalance} className="font-bold text-fg" />
        </p>
      </div>
    </div>
  );
}

// ── Discover flyout (desktop) ───────────────────────────────────────────
function DiscoverPanel({ onPick }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  return (
    <div className="dc-container py-6">
      <p className="dc-kicker text-fg-3">{t(COPY.discoverTitle)}</p>
      <ul className="mt-3 grid grid-cols-4 gap-3">
        {CATEGORY_CARDS.map((card) => {
          const category = CATEGORY_BY_SLUG[card.slug];
          return (
            <li key={card.slug}>
              <Link href={link(`/browse?category=${card.slug}`)} onClick={onPick} className={cx("dc-lift flex h-20 items-center gap-3 overflow-hidden rounded-card px-4", TONE_BG[card.tone])}>
                <span className="relative h-14 w-14 shrink-0">
                  <Img image={card.cutouts[0] ? { sources: card.cutouts[0].sources } : category.image} alt="" sizes="56px" className="size-full object-contain" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate dc-md font-bold text-fg">{t(category.name)}</span>
                  <span className="block dc-xs text-fg-2">{pl("lots", category.count)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── The header ──────────────────────────────────────────────────────────
export function Header() {
  const { t } = useLang();
  const { link } = useConcept();
  const { cartCount, watched } = useStore();
  const { open, city } = useDiscovery();
  const [discover, setDiscover] = useState(false);
  const discoverRef = useRef(null);
  const closeDiscover = useCallback(() => setDiscover(false), []);
  useDismiss(discover, closeDiscover, discoverRef);
  const accountItems = useAccountItems();

  const iconBtn = "relative grid size-10 shrink-0 place-items-center rounded-full text-fg hover:bg-surface-2";
  const count = (n) =>
    n ? (
      <span aria-hidden="true" className="absolute -end-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-on-accent tabular">
        {n}
      </span>
    ) : null;

  return (
    <>
      <header className="dc-header relative z-40 lg:sticky lg:top-pbar">
        <div ref={discoverRef}>
          <div className="dc-container flex h-14 items-center gap-2 lg:h-16 lg:gap-4">
            <button type="button" onClick={() => open("discover")} aria-label={t(COPY.openMenu)} className={cx(iconBtn, "-ms-2 lg:hidden")}>
              <LayoutGrid aria-hidden="true" className="size-5" />
            </button>
            <Link href={link("/")} className="shrink-0 rounded-sm outline-offset-4">
              <Logo variant="lockup" title={t(COPY.home)} className="h-8 w-auto lg:h-9" />
            </Link>
            <button
              type="button"
              aria-expanded={discover}
              onClick={() => setDiscover((v) => !v)}
              className="hidden h-11 shrink-0 items-center gap-2 rounded-full bg-surface-2 px-4 dc-sm font-bold text-fg hover:bg-[color-mix(in_oklab,var(--surface-2)_85%,var(--text-primary))] lg:inline-flex"
            >
              <LayoutGrid aria-hidden="true" className="size-4" />
              {t(COPY.discover)}
              <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", discover && "rotate-180")} />
            </button>
            <SearchBox className="hidden min-w-0 flex-1 lg:block" />
            <div className="ms-auto flex items-center gap-0.5 lg:ms-0">
              <div className="hidden xl:block">
                <Popover
                  label={t(COPY.chooseCity)}
                  width="w-72"
                  button={({ open: isOpen, toggle }) => (
                    <button type="button" aria-expanded={isOpen} onClick={toggle} className="flex h-11 items-center gap-2 rounded-full px-3 text-start hover:bg-surface-2">
                      <MapPin aria-hidden="true" className="size-4 text-accent" />
                      <span className="leading-tight">
                        <span className="block dc-xs text-fg-3">{t(COPY.deliverTo)}</span>
                        <span className="block dc-sm font-bold text-fg">{t(CITIES[city])}</span>
                      </span>
                    </button>
                  )}
                >
                  {(close) => <CityPicker onPicked={close} />}
                </Popover>
              </div>
              <Popover
                label={t(COPY.savedCount, { n: watched.size })}
                button={({ open: isOpen, toggle, label }) => (
                  <button type="button" aria-expanded={isOpen} onClick={toggle} aria-label={label} className={iconBtn}>
                    <Heart aria-hidden="true" className="size-5" />
                    {count(watched.size)}
                  </button>
                )}
              >
                {(close) => (
                  <>
                    <p className="mb-2 dc-kicker text-fg">{t(COPY.saved)}</p>
                    <SavedList onPick={close} />
                  </>
                )}
              </Popover>
              <div className="hidden lg:block">
                <Popover
                  label={t(COPY.account)}
                  button={({ open: isOpen, toggle, label }) => (
                    <button type="button" aria-expanded={isOpen} onClick={toggle} aria-label={label} className={iconBtn}>
                      <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-[var(--dc-butter)] dc-xs font-extrabold text-fg">
                        {t(DEMO_USER.initials)}
                      </span>
                    </button>
                  )}
                >
                  {(close) => (
                    <>
                      <AccountSummary />
                      <ul className="mt-3 grid gap-1 border-t border-line pt-3">
                        {accountItems.map((item) => (
                          <li key={item.key}>
                            <button
                              type="button"
                              onClick={() => {
                                item.run();
                                close();
                              }}
                              className="flex h-10 w-full items-center gap-3 rounded-[12px] px-2 text-start dc-sm font-semibold text-fg hover:bg-surface-2"
                            >
                              <item.icon aria-hidden="true" className="size-4 text-fg-2" />
                              {item.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </Popover>
              </div>
              <button type="button" onClick={() => open("cart")} aria-label={t(COPY.cartCount, { n: cartCount })} className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-2.5 text-fg hover:bg-surface-2 lg:bg-surface-2 lg:px-4">
                <ShoppingCart aria-hidden="true" className="size-5" />
                <span aria-hidden="true" className="hidden dc-sm font-bold lg:inline">
                  {t(COPY.cart)}
                </span>
                {cartCount ? (
                  <span aria-hidden="true" className="absolute -end-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-on-accent tabular lg:static lg:h-5 lg:min-w-5">
                    {cartCount}
                  </span>
                ) : null}
              </button>
              <LangLink className="hidden h-10 items-center rounded-full px-3 dc-sm font-bold text-fg hover:bg-surface-2 lg:inline-flex" />
            </div>
          </div>
          {discover ? (
            <div className="absolute inset-x-0 top-full hidden border-b border-line bg-surface shadow-raised lg:block">
              <DiscoverPanel onPick={closeDiscover} />
            </div>
          ) : null}
        </div>
        <ChipRail className="dc-container hidden border-t border-line lg:block" />
      </header>

      {/* Phones and tablets: search and shortcuts stay pinned while you scroll */}
      <div className="dc-header sticky top-pbar z-30 lg:hidden">
        <div className="dc-container pt-2.5">
          <SearchBox />
        </div>
        <ChipRail className="dc-container" />
      </div>
    </>
  );
}
