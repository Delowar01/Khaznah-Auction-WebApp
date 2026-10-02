"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { MapPin, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { LanguageSwitch, useGoSearch, useHomeState, useSearchResults } from "@/components/shared/r3/home";
import { Popover } from "@/components/shared/r3/popover";
import { getProduct } from "@/data/products";
import { CITIES } from "@/data/sellers";
import { DEMO_USER } from "@/data/site";
import { POPULAR_SEARCHES, detailPath, isAuction } from "@/lib/catalog";
import { COPY } from "./copy";
import { cx } from "./ui";

/**
 * Shopping modes; auctions come before Buy Now. On the home page Discover is
 * the selected one; Browse passes its current mode as `active` (or null).
 */
export function useModes(active) {
  const { t } = useLang();
  const modes = [
    { key: "discover", label: t(COPY.discover), href: "/", current: true },
    { key: "timed", label: t(COPY.navTimed), href: "/browse?tab=auction" },
    { key: "live", label: t(COPY.navLive), href: "/live-auction" },
    { key: "buy", label: t(COPY.navBuyNow), href: "/browse?tab=buy_now" },
    { key: "sellers", label: t(COPY.navSellers), href: "/seller" },
    { key: "bulk", label: t(COPY.navBulk), href: "/browse?category=bulk-pallets" },
  ];
  return active === undefined ? modes : modes.map((mode) => ({ ...mode, current: mode.key === active }));
}

const panel = "rounded-[16px] border border-[var(--vd-line)] bg-white p-4 shadow-overlay";
const utility = "inline-flex h-10 items-center gap-2 rounded-full px-2 vd-md text-[var(--vd-ink)] transition-colors hover:text-[var(--vd-indigo)]";

export function SavedList({ onPick }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { watched } = useStore();
  const items = [...watched].map(getProduct).filter(Boolean);
  if (!items.length) return <p className="vd-sm text-[var(--vd-muted)]">{t(COPY.savedEmpty)}</p>;
  return (
    <ul className="divide-y divide-[var(--vd-line)]">
      {items.map((product) => (
        <li key={product.slug}>
          <Link href={link(detailPath(product))} onClick={onPick} className="flex items-center gap-3 py-2.5 hover:underline">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-[10px] bg-[var(--vd-bluegray)]">
              <Img image={product.images[0]} alt="" sizes="44px" className="vd-multiply size-full object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1 truncate vd-sm text-[var(--vd-ink)]">{t(product.title)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function AccountSummary() {
  const { t } = useLang();
  const first = t(DEMO_USER.name).split(" ")[0];
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--vd-bluegray)] vd-sm font-bold text-[var(--vd-indigo)]">
        {t(DEMO_USER.initials)}
      </span>
      <div className="min-w-0">
        <p className="truncate vd-lg font-bold text-[var(--vd-ink)]">{t(COPY.hello, { name: first })}</p>
        <p className="vd-xs text-[var(--vd-muted)]">
          {t(COPY.walletBalance)} · <Money value={DEMO_USER.walletBalance} className="font-semibold text-[var(--vd-ink)]" />
        </p>
      </div>
    </div>
  );
}

export function CityChoices({ onPicked }) {
  const { t } = useLang();
  const { city, setCity } = useHomeState();
  return (
    <div role="radiogroup" aria-label={t(COPY.chooseCity)} className="grid gap-0.5">
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
          className={cx("flex h-10 items-center justify-between rounded-full px-3 vd-md", city === key ? "bg-[var(--vd-bluegray)] font-semibold text-[var(--vd-indigo)]" : "text-[var(--vd-ink)] hover:bg-[var(--vd-bluegray)]")}
        >
          {t(name)}
          {city === key ? <span aria-hidden="true" className="size-2 rounded-full bg-[var(--vd-indigo)]" /> : null}
        </button>
      ))}
    </div>
  );
}

/** "EN | العربية"; `roomy` is the footer's larger spacing. */
export function DiscoveryLanguage({ className = "", onNavigate, roomy = false }) {
  const { t } = useLang();
  return (
    <LanguageSwitch
      label={t(COPY.language)}
      onNavigate={onNavigate}
      className={cx("flex items-center", className)}
      separator={<span aria-hidden="true" className={cx("w-px bg-[var(--vd-indigo)]/50", roomy ? "mx-[17px] h-[22px]" : "mx-2 h-4")} />}
      itemClass={(current) => cx(roomy ? "vd-body" : "vd-md", current ? cx("text-[var(--vd-ink)]", !roomy && "font-semibold") : "text-[var(--vd-muted)] hover:text-[var(--vd-indigo)] hover:underline")}
    />
  );
}

/** Pale blue-grey pill search with suggestions. */
function SearchPill({ className = "" }) {
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
  const heading = "vd-xs font-bold uppercase tracking-[0.08em] text-[var(--vd-muted)]";
  return (
    <div ref={ref} className={cx("relative", className)}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setOpen(false);
          go(query);
        }}
        className="flex h-12 items-center gap-3 rounded-full bg-[var(--vd-bluegray)] ps-5 pe-4 ring-[var(--vd-indigo)] focus-within:ring-2"
      >
        <Search aria-hidden="true" className="size-[18px] shrink-0 text-[var(--vd-indigo)]" strokeWidth={2.2} />
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
          className="vd-search h-full min-w-0 flex-1 bg-transparent vd-md text-[var(--vd-ink)] outline-none"
        />
      </form>
      {open ? (
        <div id={listId} className={cx("absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-[70dvh] overflow-y-auto", panel)}>
          {!results ? (
            <>
              <p className={heading}>{t(COPY.popularSearches)}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <li key={term.en}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        go(t(term));
                      }}
                      className="h-9 rounded-full border border-[var(--vd-line)] bg-white px-3.5 vd-sm text-[var(--vd-ink)] hover:border-[var(--vd-indigo)]"
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
                <p className={heading}>{t(COPY.resultsLots)}</p>
                {results.lots.length ? null : <p className="mt-2 vd-sm text-[var(--vd-muted)]">{t(COPY.noMatch, { q: query.trim() })}</p>}
                <ul className="mt-1">
                  {results.lots.map((product) => (
                    <li key={product.slug}>
                      <Link href={link(detailPath(product))} onClick={pick} className="flex items-center gap-3 rounded-[12px] px-2 py-2 hover:bg-[var(--vd-bluegray)]">
                        <span className="relative size-11 shrink-0 overflow-hidden rounded-[10px] bg-[var(--vd-bluegray)]">
                          <Img image={product.images[0]} alt="" sizes="44px" className="vd-multiply size-full object-contain p-1" />
                        </span>
                        <span className="min-w-0 flex-1 truncate vd-sm font-semibold text-[var(--vd-ink)]">{t(product.title)}</span>
                        <Money value={isAuction(product) ? product.currentBid : product.price} className="vd-sm font-bold text-[var(--vd-ink)]" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={link(`/browse?search=${encodeURIComponent(query.trim())}`)} onClick={pick} className="vd-link mt-2 inline-flex vd-sm font-bold text-[var(--vd-indigo)]">
                  {t(COPY.seeAllResults, { q: query.trim() })}
                </Link>
              </div>
              {results.categories.length || results.sellers.length ? (
                <div className="space-y-4">
                  {results.categories.length ? (
                    <div>
                      <p className={heading}>{t(COPY.resultsCategories)}</p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {results.categories.map((category) => (
                          <li key={category.slug}>
                            <Link href={link(`/browse?category=${category.slug}`)} onClick={pick} className="inline-flex h-9 items-center rounded-full border border-[var(--vd-line)] px-3.5 vd-sm text-[var(--vd-ink)] hover:border-[var(--vd-indigo)]">
                              {t(category.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {results.sellers.length ? (
                    <div>
                      <p className={heading}>{t(COPY.resultsSellers)}</p>
                      <ul className="mt-2 space-y-1">
                        {results.sellers.map((seller) => (
                          <li key={seller.code}>
                            <Link href={link(`/seller/${seller.code}`)} onClick={pick} className="vd-link vd-sm text-[var(--vd-ink)]">
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

function ModeNav({ active, className = "" }) {
  const { t } = useLang();
  const { link } = useConcept();
  const modes = useModes(active);
  return (
    <nav aria-label={t(COPY.modes)} className={className}>
      <ul className="vd-rail flex items-center gap-2 overflow-x-auto dt:gap-[13px]">
        {modes.map((mode) => (
          <li key={mode.key} className="shrink-0">
            <Link
              href={link(mode.href)}
              aria-current={mode.current ? "page" : undefined}
              className={cx(
                "inline-flex h-[34px] items-center rounded-full px-4 vd-md transition-colors",
                mode.current ? "bg-[var(--vd-indigo)] px-6 font-semibold text-white dt:px-[33px]" : "text-[var(--vd-ink)] hover:bg-[var(--vd-bluegray)]",
              )}
            >
              {mode.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** `active`: the current shopping mode on Browse (see useModes). */
export function Header({ active } = {}) {
  const { t } = useLang();
  const { link } = useConcept();
  const { cartCount, watched } = useStore();
  const { open, city } = useHomeState();
  return (
    <header className="border-b border-[var(--vd-line)] bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-7 dt:px-16">
        {/* Row 1: logo · pill search · utilities */}
        <div data-ref="01" className="flex h-16 items-center gap-3 dt:grid dt:h-[73px] dt:grid-cols-[257px_minmax(0,637px)_minmax(0,1fr)] dt:gap-0">
          <button type="button" onClick={() => open("menu")} aria-label={t(COPY.openMenu)} className="-ms-2 grid size-11 place-items-center rounded-full text-[var(--vd-ink)] dt:hidden">
            <Menu aria-hidden="true" className="size-6" strokeWidth={1.8} />
          </button>
          <Link href={link("/")} className="shrink-0 rounded-[8px] outline-offset-4 dt:self-end dt:pb-[3px]">
            <Logo variant="lockup" title={t(COPY.home)} className="h-9 w-auto md:h-11 dt:h-[53px]" />
          </Link>
          <SearchPill className="hidden flex-1 md:block dt:w-full" />
          <div className="ms-auto flex items-center gap-1 dt:ms-0 dt:justify-end dt:gap-3">
            <div className="hidden items-center dt:flex">
              <Popover
                label={t(COPY.chooseCity)}
                panelClassName={cx(panel, "w-64")}
                trigger={({ open: isOpen, toggle, panelId }) => (
                  <button type="button" onClick={toggle} aria-expanded={isOpen} aria-controls={isOpen ? panelId : undefined} className={utility}>
                    <MapPin aria-hidden="true" className="size-5 fill-[var(--vd-indigo)] text-white" strokeWidth={1.6} />
                    <span className="sr-only">{t(COPY.location)}: </span>
                    {t(CITIES[city])}
                  </button>
                )}
              >
                {(close) => (
                  <>
                    <p className="mb-2 vd-md font-bold text-[var(--vd-ink)]">{t(COPY.chooseCity)}</p>
                    <CityChoices onPicked={close} />
                    <p className="mt-3 vd-xs text-[var(--vd-muted)]">{t(COPY.cityText)}</p>
                  </>
                )}
              </Popover>
              <span aria-hidden="true" className="mx-2 h-5 w-px bg-[var(--vd-line)]" />
              <DiscoveryLanguage />
            </div>
            <Popover
              label={t(COPY.account)}
              panelClassName={cx(panel, "w-72")}
              trigger={({ open: isOpen, toggle, panelId }) => (
                <button type="button" onClick={toggle} aria-expanded={isOpen} aria-controls={isOpen ? panelId : undefined} className={cx(utility, "hidden md:inline-flex")}>
                  <UserRound aria-hidden="true" className="size-[22px] text-[var(--vd-indigo)]" strokeWidth={1.7} />
                  <span className="hidden dt:inline">{t(COPY.account)}</span>
                  <span className="sr-only dt:hidden">{t(COPY.account)}</span>
                </button>
              )}
            >
              {(close) => (
                <>
                  <AccountSummary />
                  <p className="mt-4 vd-xs font-bold uppercase tracking-[0.08em] text-[var(--vd-muted)]">
                    {t(COPY.saved)} · {watched.size}
                  </p>
                  <div className="mt-1">
                    <SavedList onPick={close} />
                  </div>
                </>
              )}
            </Popover>
            <button type="button" onClick={() => open("cart")} aria-label={t(COPY.cartCount, { n: cartCount })} className={cx(utility, "relative -me-2 dt:me-0")}>
              <ShoppingBag aria-hidden="true" className="size-[22px] text-[var(--vd-indigo)]" strokeWidth={1.7} />
              <span aria-hidden="true" className="hidden dt:inline">
                {t(COPY.cart)}
              </span>
              {cartCount ? (
                <span aria-hidden="true" className="absolute -top-0.5 start-6 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--vd-gold)] px-1 text-[11px] font-bold text-[var(--vd-ink)] tabular">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
        {/* Phones: the pill search gets its own full-width row */}
        <SearchPill className="pb-3 md:hidden" />
        {/* Row 2: shopping modes, starting under the search */}
        <div data-ref="02" className="pb-2.5 dt:grid dt:h-[55px] dt:grid-cols-[257px_minmax(0,1fr)] dt:items-start dt:pb-0 dt:pt-1">
          <span aria-hidden="true" className="hidden dt:block" />
          <ModeNav active={active} className="-mx-4 px-4 md:mx-0 md:px-0 dt:ps-6" />
        </div>
      </div>
    </header>
  );
}
