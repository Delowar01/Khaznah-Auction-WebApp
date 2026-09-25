"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Gavel, Globe2, Layers, Radio, Search, ShoppingBag, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useOverlay } from "@/components/shared/ui/useOverlay";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { CATEGORIES } from "@/data/categories";
import { CITIES, SELLERS } from "@/data/sellers";
import { NAV } from "@/data/site";
import { POPULAR_SEARCHES, detailPath, searchProducts, sellerStats } from "@/lib/catalog";
import { isAuction } from "@/data/products";
import { COPY } from "./copy";
import { CategoryArt } from "./art";
import { AccountCard, LangLink, useAccountItems } from "./Header";
import { BUY_NOW_COUNT, OPEN_AUCTION_COUNT, mainImage } from "./lots";
import { useVisual } from "./state";
import { IconButton, LiveDot, TimeLeft, cx, pillClass } from "./ui";

const navLabel = (key) => NAV.find((item) => item.key === key).label;

/** Full-screen layer shared by Categories, Search and the phone menu. */
function FullScreen({ open, onClose, title, children }) {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const panelRef = useOverlay(open, onClose);

  useEffect(() => {
    // Portals need the DOM; render nothing on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="layer"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 top-pbar z-[190] flex flex-col bg-bg font-sans text-fg outline-none"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="shrink-0 border-b border-line">
            <div className="vm-container flex h-[var(--vm-header-h)] items-center justify-between gap-4">
              <h2 id={titleId} className="vm-h3">
                {title}
              </h2>
              <IconButton label={t(COPY.close)} onClick={onClose} className="-me-2 border border-line bg-surface">
                <X aria-hidden="true" className="size-5" />
              </IconButton>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function SellerCard({ seller, onNavigate }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const stats = sellerStats(seller.code);
  return (
    <Link href={link(`/seller/${seller.code}`)} onClick={onNavigate} className="group relative block aspect-[4/3] overflow-hidden rounded-card bg-surface-2 outline-offset-[3px]">
      <Img image={seller.cover} alt="" sizes="(min-width: 768px) 20vw, 50vw" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      {seller.liveNow ? (
        <span className="absolute start-2.5 top-2.5 inline-flex h-7 items-center gap-1.5 rounded-full bg-white px-2.5 vm-xs font-extrabold text-[#181614]">
          <LiveDot />
          {t(COPY.liveHosting)}
        </span>
      ) : null}
      <span className="vm-band absolute inset-x-2 bottom-2 rounded-[14px] px-3 py-2">
        <span className="block truncate vm-sm font-bold">{t(seller.name)}</span>
        <span className="block truncate vm-xs opacity-80">
          {pl("lots", stats.total)} · {t(CITIES[seller.city])}
        </span>
      </span>
    </Link>
  );
}

function WaysToShop({ onNavigate }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const ways = [
    { key: "auctions", icon: Gavel, href: "/browse?tab=auction", title: t(navLabel("auctions")), line: t(COPY.openAuctions, { n: OPEN_AUCTION_COUNT }) },
    { key: "buy", icon: ShoppingBag, href: "/browse?tab=buy_now", title: t(navLabel("buy-now")), line: t(COPY.buyNowItems, { n: BUY_NOW_COUNT }) },
    { key: "live", icon: Radio, href: "/live-auction", title: t(navLabel("live")), line: t(COPY.liveNowCount), live: true },
    { key: "pallets", icon: Layers, href: "/browse?category=bulk-pallets", title: ui("bulkLots"), line: t(COPY.palletsLine) },
  ];
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ways.map(({ key, icon: Icon, href, title, line, live }) => (
        <li key={key}>
          <Link href={link(href)} onClick={onNavigate} className="group flex h-full items-center gap-3.5 rounded-[18px] border border-line bg-surface p-4 transition-colors hover:border-fg">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 vm-md font-bold">
                {title}
                {live ? <LiveDot /> : null}
              </span>
              <span className="block vm-xs text-fg-3">{line}</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="flip-rtl size-5 text-fg-3 transition-colors group-hover:text-fg" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Categories: a full-screen visual overlay — photo tiles, sellers, ways to shop. */
export function CategoriesOverlay() {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const { layer, close } = useVisual();
  return (
    <FullScreen open={layer === "categories"} onClose={close} title={t(COPY.browseCategories)}>
      <div className="vm-container py-6 lg:py-10">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
          {CATEGORIES.map((category, i) => (
            <li key={category.slug} className="vm-rise" style={{ animationDelay: `${i * 30}ms` }}>
              <Link
                href={link(`/browse?category=${category.slug}`)}
                onClick={close}
                className="group relative block aspect-[4/5] overflow-hidden rounded-card bg-surface-2 outline-offset-[3px] md:aspect-[5/4]"
              >
                <CategoryArt slug={category.slug} sizes="(min-width: 768px) 25vw, 50vw" />
                <span className="vm-band absolute inset-x-2 bottom-2 rounded-[14px] px-3.5 py-2.5">
                  <span className="block vm-md font-bold">{t(category.name)}</span>
                  <span className="block vm-xs opacity-80">{pl("lots", category.count)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 vm-h3">{t(COPY.sellersRow)}</h3>
        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5 lg:gap-4">
          {SELLERS.map((seller) => (
            <li key={seller.code}>
              <SellerCard seller={seller} onNavigate={close} />
            </li>
          ))}
        </ul>

        <h3 className="mt-10 vm-h3">{t(COPY.waysToShop)}</h3>
        <div className="mt-4">
          <WaysToShop onNavigate={close} />
        </div>
      </div>
    </FullScreen>
  );
}

function ResultLot({ product, onNavigate }) {
  const { t } = useLang();
  const { link } = useConcept();
  const auction = isAuction(product);
  return (
    <Link href={link(detailPath(product))} onClick={onNavigate} className="group flex items-center gap-3 rounded-[18px] p-2 transition-colors hover:bg-surface-2">
      <span className="vm-plate relative size-16 shrink-0 overflow-hidden rounded-[14px]">
        <Img image={mainImage(product)} alt="" sizes="64px" className={cx("size-full", mainImage(product)?.kind === "scene" ? "object-cover" : "vm-multiply object-contain p-1.5")} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate vm-sm font-semibold text-fg">{t(product.title)}</span>
        <span className="flex items-center gap-2 vm-sm">
          <Money value={auction ? product.currentBid : product.price} className="font-extrabold text-fg" />
          {auction && product.status === "live" ? (
            <span className="text-fg-3">
              · <TimeLeft endsIn={product.endsIn} />
            </span>
          ) : null}
        </span>
      </span>
    </Link>
  );
}

/** Search: a full-screen visual layer. Popular + categories first; results while typing. */
export function SearchOverlay() {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const { layer, close, query: initialQuery } = useVisual();
  const open = layer === "search";
  const inputId = useId();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    // Re-seed the field every time the layer opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setQuery(initialQuery);
  }, [open, initialQuery]);

  const q = query.trim();
  const results = useMemo(() => {
    if (!q) return null;
    const needle = q.toLowerCase();
    const matches = searchProducts(q).filter((p) => p.status !== "sold");
    const lots = matches.slice(0, 6);
    const categories = CATEGORIES.filter((c) => c.name.en.toLowerCase().includes(needle) || c.name.ar.includes(q));
    const sellers = SELLERS.filter((s) => s.name.en.toLowerCase().includes(needle) || s.name.ar.includes(q));
    return { lots, categories, sellers, total: matches.length };
  }, [q]);

  const go = (term) => {
    const value = term.trim();
    close();
    router.push(link(value ? `/browse?search=${encodeURIComponent(value)}` : "/browse"));
  };

  const empty = results && !results.lots.length && !results.categories.length && !results.sellers.length;

  return (
    <FullScreen open={open} onClose={close} title={t(COPY.searchTitle)}>
      <div className="vm-container max-w-[1100px] py-6 lg:py-10">
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            go(query);
          }}
          className="flex items-center gap-3 rounded-full border-2 border-fg bg-surface p-2 ps-5 shadow-card"
        >
          <label htmlFor={inputId} className="sr-only">
            {t(COPY.searchLabel)}
          </label>
          <Search aria-hidden="true" className="size-6 shrink-0 text-fg-2" />
          <input
            id={inputId}
            data-autofocus
            type="search"
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(COPY.searchPlaceholder)}
            className="vm-search h-12 min-w-0 flex-1 bg-transparent vm-lg font-semibold text-fg outline-none placeholder:font-normal placeholder:text-fg-3"
          />
          <button type="submit" className={pillClass("solid", "md", "h-12")}>
            {t(COPY.searchTitle)}
          </button>
        </form>

        {!results ? (
          <div className="mt-8">
            <p className="vm-eyebrow text-fg-3">{t(COPY.popular)}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <li key={term.en}>
                  <button type="button" onClick={() => go(t(term))} className={pillClass("outline", "md")}>
                    {t(term)}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-10 vm-eyebrow text-fg-3">{t(COPY.searchBrowse)}</p>
            <ul className="mt-4 grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-8">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link href={link(`/browse?category=${category.slug}`)} onClick={close} className="group flex flex-col items-center gap-2 text-center">
                    <span className="grid aspect-square w-full max-w-[96px] place-items-center overflow-hidden rounded-full bg-surface-2 p-[14%] ring-1 ring-line transition-shadow group-hover:ring-2 group-hover:ring-fg">
                      <Img image={category.image} cutout alt="" sizes="96px" className="vm-floor size-full object-contain" />
                    </span>
                    <span className="vm-xs font-semibold text-fg">{t(category.name)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : empty ? (
          <p className="mt-10 vm-lg text-fg-2">{t(COPY.searchNoMatch, { q })}</p>
        ) : (
          <div className={cx("mt-8 grid gap-10", results.categories.length || results.sellers.length ? "lg:grid-cols-[minmax(0,1fr)_300px]" : "")}>
            <section aria-label={t(COPY.searchResultsLots)}>
              <p className="flex items-baseline gap-3 vm-eyebrow text-fg-3">
                {t(COPY.searchResultsLots)}
                <span className="tabular normal-case tracking-normal">· {pl("results", results.total)}</span>
              </p>
              <ul className={cx("mt-3 grid gap-1 sm:grid-cols-2", results.categories.length || results.sellers.length ? "" : "lg:grid-cols-3")}>
                {results.lots.map((product) => (
                  <li key={product.slug}>
                    <ResultLot product={product} onNavigate={close} />
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => go(query)} className={pillClass("solid", "md", "mt-5")}>
                {t(COPY.searchSeeAll, { q })}
                <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
              </button>
            </section>
            <div className="grid content-start gap-8">
              {results.categories.length ? (
                <section aria-label={t(COPY.searchResultsCats)}>
                  <p className="vm-eyebrow text-fg-3">{t(COPY.searchResultsCats)}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {results.categories.map((category) => (
                      <li key={category.slug}>
                        <Link href={link(`/browse?category=${category.slug}`)} onClick={close} className={pillClass("soft", "md")}>
                          {t(category.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {results.sellers.length ? (
                <section aria-label={t(COPY.searchResultsSellers)}>
                  <p className="vm-eyebrow text-fg-3">{t(COPY.searchResultsSellers)}</p>
                  <ul className="mt-3 grid gap-3">
                    {results.sellers.map((seller) => (
                      <li key={seller.code}>
                        <SellerCard seller={seller} onNavigate={close} />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </FullScreen>
  );
}

/** Phones and tablets: the full-screen visual menu (there is no bottom tab bar). */
export function MenuOverlay() {
  const { t } = useLang();
  const { link } = useConcept();
  const { layer, close } = useVisual();
  const items = useAccountItems();
  const links = [
    { key: "buy-now", href: "/browse?tab=buy_now", line: t(COPY.buyNowItems, { n: BUY_NOW_COUNT }) },
    { key: "auctions", href: "/browse?tab=auction", line: t(COPY.openAuctions, { n: OPEN_AUCTION_COUNT }) },
    { key: "live", href: "/live-auction", line: t(COPY.liveNowCount), live: true },
    { key: "sellers", href: "/seller", line: t(COPY.sellersLine, { n: SELLERS.length }) },
  ];

  const toHow = (event) => {
    event.preventDefault();
    close();
    window.requestAnimationFrame(() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <FullScreen open={layer === "menu"} onClose={close} title={t(COPY.menu)}>
      <div className="vm-container py-5">
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link href={link(`/browse?category=${category.slug}`)} onClick={close} className="group relative block aspect-[16/10] overflow-hidden rounded-[16px] bg-surface-2">
                <CategoryArt slug={category.slug} sizes="(min-width: 640px) 25vw, 50vw" />
                <span className="vm-band absolute inset-x-1.5 bottom-1.5 truncate rounded-[10px] px-2.5 py-1.5 vm-xs font-bold">{t(category.name)}</span>
              </Link>
            </li>
          ))}
        </ul>

        <nav aria-label={t(COPY.primaryNav)} className="mt-6 border-t border-line">
          <ul>
            {links.map(({ key, href, line, live }) => (
              <li key={key} className="border-b border-line">
                <Link href={link(href)} onClick={close} className="flex min-h-16 items-center justify-between gap-3 py-3">
                  <span>
                    <span className="flex items-center gap-2.5 vm-h3">
                      {t(navLabel(key))}
                      {live ? <LiveDot /> : null}
                    </span>
                    {line ? <span className="block vm-xs text-fg-3">{line}</span> : null}
                  </span>
                  <ArrowUpRight aria-hidden="true" className="flip-rtl size-5 text-fg-3" />
                </Link>
              </li>
            ))}
            <li className="border-b border-line">
              <a href="#how-it-works" onClick={toHow} className="flex min-h-16 items-center justify-between gap-3 py-3">
                <span className="vm-h3">{t(navLabel("how"))}</span>
                <ArrowUpRight aria-hidden="true" className="flip-rtl size-5 text-fg-3" />
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-6 rounded-[22px] bg-surface p-4 shadow-card">
          <AccountCard />
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {items.map(({ key, icon: Icon, label, count, run }) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    run();
                  }}
                  className="flex h-12 w-full items-center gap-2.5 rounded-[14px] bg-surface-2 px-3 text-start vm-sm font-semibold"
                >
                  <Icon aria-hidden="true" className="size-[18px] text-fg-2" />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {count ? <span className="tabular vm-xs font-bold text-fg-3">{count}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pb-6 vm-sm text-fg-2">
          <span className="inline-flex items-center gap-2">
            <Globe2 aria-hidden="true" className="size-4" />
            {t(COPY.country)}: <span className="font-semibold text-fg">{t(COPY.saudiArabia)}</span>
          </span>
          <LangLink onClick={close} className={pillClass("outline", "md")} />
        </div>
      </div>
    </FullScreen>
  );
}
