"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Bell, CircleHelp, Gavel, Globe2, Menu, Package, Search, ShoppingCart, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { CATEGORIES } from "@/data/categories";
import { SELLERS, CITIES } from "@/data/sellers";
import { DEMO_USER, FOOTER_COLUMNS } from "@/data/site";
import { isAuction, isBuyNow } from "@/data/products";
import { searchProducts } from "@/lib/catalog";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";
import { plural } from "@/lib/i18n";
import { COPY, PL } from "./copy";
import { BUY_NOW_COUNT, FLOOR, OPEN, STOCK } from "./data";
import { useFloor } from "./state";
import { Count, IconButton, LiveDot, Thumb, TimeText, cx } from "./ui";

export const SECTIONS = ["floor-live", "floor-ending", "floor-upcoming", "floor-buy"];

export function LangLink({ className = "", onClick }) {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const other = lang === "ar" ? "en" : "ar";
  return (
    <Link href={pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`)} hrefLang={other} lang={other} onClick={onClick} aria-label={t(COPY.switchLanguageLabel)} className={className}>
      {t(COPY.switchLanguage)}
    </Link>
  );
}

/** Which floor section is on screen (for the switcher). */
function useActiveSection() {
  const [active, setActive] = useState(SECTIONS[0]);
  useEffect(() => {
    const nodes = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!nodes.length) return undefined;
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
        const best = SECTIONS.filter((id) => (seen.get(id) || 0) > 0)[0];
        if (best) setActive(best);
      },
      { rootMargin: "-140px 0px -45% 0px", threshold: [0, 0.01, 0.2] },
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);
  return active;
}

export function goToSection(id) {
  const node = document.getElementById(id);
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
  node.focus({ preventScroll: true });
}

/** The floor switcher: auction status leads navigation (Live · Ending · Upcoming · Buy Now). */
export function Switcher({ live, className = "", mobile = false }) {
  const { t, lang } = useLang();
  const active = useActiveSection();
  const nextClose = useRemaining(OPEN[0]?.endsIn);
  const item = live.current;
  const segments = [
    { id: "floor-live", label: t(COPY.segLive), meta: item ? `${item.order}/${live.items.length}` : null, live: true },
    { id: "floor-ending", label: t(COPY.segEnding), meta: formatDuration(nextClose ?? 0, lang).split(" ")[0], urgent: (nextClose ?? 0) <= 3600 },
    { id: "floor-upcoming", label: t(COPY.segUpcoming), meta: null },
    { id: "floor-buy", label: t(COPY.segBuyNow), meta: String(BUY_NOW_COUNT) },
  ];
  return (
    <nav aria-label={t(COPY.floor)} className={className}>
      <ul className={cx("flex items-center gap-1 rounded-[10px] bg-surface-2 p-1", mobile ? "no-scrollbar overflow-x-auto" : "")}>
        {segments.map((seg) => {
          const on = active === seg.id;
          return (
            <li key={seg.id} className={mobile ? "flex-1" : ""}>
              <a
                href={`#${seg.id}`}
                aria-current={on ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  goToSection(seg.id);
                }}
                className={cx(
                  "flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] ac-sm font-semibold transition-colors",
                  mobile ? "px-2" : "px-3",
                  on ? "bg-surface text-fg shadow-card" : "text-fg-2 hover:text-fg",
                )}
              >
                {seg.live ? <LiveDot /> : null}
                {seg.label}
                {seg.meta ? (
                  <span dir={lang === "ar" ? "rtl" : "ltr"} className={cx("ac-num ac-xs font-semibold", seg.urgent ? "text-accent" : "text-fg-3")}>
                    {seg.meta}
                  </span>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SearchResults({ query, scope, onPick }) {
  const { t } = useLang();
  const { link } = useConcept();
  const q = query.trim();
  const lots = useMemo(() => {
    if (!q) return scope === "buy_now" ? STOCK : OPEN.slice(0, 5);
    return searchProducts(q)
      .filter((p) => p.status !== "sold" && (scope === "buy_now" ? isBuyNow(p) : isAuction(p)))
      .sort((a, b) => (a.endsIn ?? Infinity) - (b.endsIn ?? Infinity))
      .slice(0, 6);
  }, [q, scope]);
  if (q && !lots.length) return <p className="px-4 py-5 ac-sm text-fg-2">{t(COPY.searchNone, { q })}</p>;
  return (
    <div className="p-2">
      {!q ? <p className="px-2.5 pb-1 pt-1.5 ac-label text-fg-3">{scope === "buy_now" ? t(COPY.buyNowTitle) : t(COPY.endingFirst)}</p> : null}
      <ul>
        {lots.map((p) => (
          <li key={p.slug}>
            <Link href={link(isAuction(p) ? `/auction/${p.slug}` : `/product/${p.slug}`)} onClick={onPick} className="flex items-center gap-3 rounded-[8px] px-2.5 py-2 hover:bg-surface-2">
              <Thumb image={p.images[0]} size={36} />
              <span className="min-w-0 flex-1 truncate ac-sm font-medium text-fg">{t(p.title)}</span>
              <Money value={isAuction(p) ? p.currentBid : p.price} className="ac-sm font-semibold text-fg" />
              {isAuction(p) && p.status === "live" ? (
                <span className="w-[86px] text-end ac-xs">
                  <TimeText target={p.endsIn} />
                </span>
              ) : p.status === "scheduled" ? (
                <span className="w-[86px] text-end ac-xs text-fg-3">{t(COPY.segUpcoming)}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      {q ? (
        <Link
          href={link(`/browse?tab=${scope}&search=${encodeURIComponent(q)}`)}
          onClick={onPick}
          className="mt-1 flex items-center justify-between rounded-[8px] px-2.5 py-2.5 ac-sm font-semibold text-fg hover:bg-surface-2"
        >
          {t(COPY.searchAll, { q })}
          <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
        </Link>
      ) : null}
    </div>
  );
}

/** Search: an icon that expands inline over the switcher, with an Auctions / Buy Now scope. */
function InlineSearch({ open, onClose }) {
  const { t } = useLang();
  const { link } = useConcept();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("auction");
  const ref = useRef(null);
  const inputId = useId();
  useDismiss(open, onClose, ref);
  useEffect(() => {
    if (open) ref.current?.querySelector("input")?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div ref={ref} className="absolute inset-x-0 top-1/2 z-10 mx-auto w-full max-w-[640px] -translate-y-1/2 kz-fade-up">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const q = query.trim();
          onClose();
          router.push(link(`/browse?tab=${scope}${q ? `&search=${encodeURIComponent(q)}` : ""}`));
        }}
        className="flex h-11 items-center gap-2 rounded-[10px] border border-fg bg-surface ps-3 pe-1 shadow-raised"
      >
        <label htmlFor={inputId} className="sr-only">
          {t(COPY.searchLabel)}
        </label>
        <Search aria-hidden="true" className="size-4 shrink-0 text-fg-3" />
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
          }}
          placeholder={t(COPY.searchPlaceholder)}
          className="ac-search h-full min-w-0 flex-1 bg-transparent ac-sm text-fg outline-none placeholder:text-fg-3"
        />
        <div role="radiogroup" aria-label={t(COPY.searchScope)} className="flex rounded-[7px] bg-surface-2 p-0.5">
          {[
            ["auction", COPY.scopeAuctions],
            ["buy_now", COPY.scopeBuyNow],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={scope === key}
              onClick={() => setScope(key)}
              className={cx("h-8 rounded-[6px] px-2.5 ac-xs font-semibold", scope === key ? "bg-surface text-fg shadow-card" : "text-fg-3")}
            >
              {t(label)}
            </button>
          ))}
        </div>
        <IconButton label={t(COPY.close)} onClick={onClose} className="size-9">
          <X aria-hidden="true" className="size-4" />
        </IconButton>
      </form>
      <div className="absolute inset-x-0 top-[calc(100%+8px)] rounded-[12px] border border-line bg-elevated shadow-overlay">
        <SearchResults query={query} scope={scope} onPick={onClose} />
      </div>
    </div>
  );
}

function AccountPopover() {
  const { t } = useLang();
  const { toast } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);
  const first = t(DEMO_USER.name).split(" ")[0];
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className="grid size-10 place-items-center rounded-full">
        <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-primary ac-xs font-bold text-on-primary">
          {t(DEMO_USER.initials)}
        </span>
        <span className="sr-only">{t(COPY.accountMenu)}</span>
      </button>
      {open ? (
        <div id={id} className="absolute end-0 top-[calc(100%+8px)] z-50 w-[280px] rounded-[12px] border border-line bg-elevated p-2 shadow-overlay kz-fade-up">
          <div className="px-2 pb-2.5 pt-1.5">
            <p className="ac-md font-semibold">{t(COPY.hello, { name: first })}</p>
            <p className="ac-xs text-fg-3">
              {t(COPY.wallet)} · <Money value={DEMO_USER.walletBalance} className="font-semibold text-fg-2" />
            </p>
          </div>
          <ul className="grid border-t border-line pt-1.5">
            {[
              [Bell, COPY.notifications, COPY.notificationsEmpty],
              [Package, COPY.orders, COPY.ordersText],
            ].map(([Icon, title, text]) => (
              <li key={title.en}>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    toast({ tone: "neutral", title: t(title), description: t(text) });
                  }}
                  className="flex h-10 w-full items-center gap-2.5 rounded-[8px] px-2 text-start ac-sm hover:bg-surface-2"
                >
                  <Icon aria-hidden="true" className="size-4 text-fg-3" />
                  {t(title)}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-1 flex items-center justify-between border-t border-line px-2 pt-2.5 ac-xs text-fg-3">
            {t(COPY.country)}
            <LangLink onClick={close} className="font-semibold text-fg hover:underline" />
          </p>
        </div>
      ) : null}
    </div>
  );
}

/** Menu drawer: categories, sellers, how bidding works, help, country & language. */
function MenuDrawer() {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const { layer, close } = useFloor();
  const help = FOOTER_COLUMNS.find((c) => c.title.en === "Help");
  return (
    <Drawer open={layer === "menu"} onClose={close} title={t(COPY.menu)} side="start" panelClassName="bg-elevated font-sans text-fg shadow-overlay overflow-y-auto">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
        <Logo variant="lockup" decorative className="h-7 w-auto" />
        <IconButton label={t(COPY.close)} onClick={close} className="-me-2">
          <X aria-hidden="true" className="size-5" />
        </IconButton>
      </div>
      <div className="grid gap-6 p-4">
        <section>
          <p className="ac-label text-fg-3">{t(COPY.categories)}</p>
          <ul className="mt-2 grid">
            {FLOOR.map(({ category, open, buy }) => (
              <li key={category.slug}>
                <Link href={link(`/browse?category=${category.slug}`)} onClick={close} className="flex items-center gap-3 rounded-[8px] px-2 py-2 hover:bg-surface-2">
                  <Thumb image={category.image} size={32} />
                  <span className="min-w-0 flex-1 truncate ac-sm font-medium">{t(category.name)}</span>
                  <span className="ac-xs text-fg-3">{open ? plural(open, PL.open, lang) : t(COPY.buyOnly)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <p className="ac-label text-fg-3">{t(COPY.sellers)}</p>
          <ul className="mt-2 grid">
            {SELLERS.map((seller) => (
              <li key={seller.code}>
                <Link href={link(`/seller/${seller.code}`)} onClick={close} className="flex items-center gap-3 rounded-[8px] px-2 py-2 hover:bg-surface-2">
                  <span aria-hidden="true" className="grid size-8 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: `color-mix(in oklab, ${seller.tone} 80%, black)` }}>
                    {seller.monogram}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate ac-sm font-medium">{t(seller.name)}</span>
                    <span className="block ac-xs text-fg-3">{t(CITIES[seller.city])}</span>
                  </span>
                  {seller.liveNow ? <LiveDot /> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <a
            href="#floor-how"
            onClick={(event) => {
              event.preventDefault();
              close();
              window.setTimeout(() => goToSection("floor-how"), 50);
            }}
            className="flex items-center gap-2 rounded-[8px] px-2 py-2 ac-sm font-semibold hover:bg-surface-2"
          >
            <CircleHelp aria-hidden="true" className="size-4" />
            {t(COPY.rules)}
          </a>
          {help ? (
            <ul className="mt-1 grid">
              {help.links.map((item) => (
                <li key={item.label.en}>
                  <Link href={item.href.startsWith("#") ? item.href : link(item.href)} onClick={close} className="block rounded-[8px] px-2 py-1.5 ac-sm text-fg-2 hover:bg-surface-2 hover:text-fg">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
        <p className="flex items-center justify-between border-t border-line pt-4 ac-sm text-fg-2">
          <span className="inline-flex items-center gap-2">
            <Globe2 aria-hidden="true" className="size-4" />
            {t(COPY.country)}
          </span>
          <LangLink onClick={close} className="font-semibold text-fg hover:underline" />
        </p>
      </div>
    </Drawer>
  );
}

/**
 * One 64px bar: menu + logo at the start, the floor switcher in the centre,
 * search · how bidding works · My bids · cart · account · language at the end.
 * Phones: the bar scrolls away; the switcher and a live strip stay sticky.
 */
export function Header({ live }) {
  const { t, pl, lang } = useLang();
  const { link } = useConcept();
  const { cartCount } = useStore();
  const { bids, open, layer } = useFloor();
  const [searching, setSearching] = useState(false);
  const bidCount = Object.keys(bids).length;

  return (
    <>
      <header className="z-40 border-b border-line bg-[color-mix(in_oklab,var(--bg)_94%,transparent)] backdrop-blur-md md:sticky md:top-pbar">
        <div className="ac-container relative flex h-[var(--ac-bar-h)] items-center gap-2">
          <div className="flex items-center gap-1">
            <IconButton label={t(COPY.openMenu)} onClick={() => open("menu")} aria-expanded={layer === "menu"} className="-ms-2">
              <Menu aria-hidden="true" className="size-5" />
            </IconButton>
            <Link href={link("/")} className="rounded-md outline-offset-4">
              <Logo variant="lockup" title={t(COPY.home)} className="h-8 w-auto" />
            </Link>
          </div>

          <div className="relative hidden min-w-0 flex-1 justify-center md:flex">
            <Switcher live={live} className={searching ? "invisible" : ""} />
            <InlineSearch open={searching} onClose={() => setSearching(false)} />
          </div>
          <span className="flex-1 md:hidden" />

          <div className="flex items-center gap-0.5">
            <IconButton label={t(COPY.search)} onClick={() => (window.matchMedia("(min-width: 768px)").matches ? setSearching(true) : open("search"))}>
              <Search aria-hidden="true" className="size-5" />
            </IconButton>
            <IconButton label={t(COPY.rules)} onClick={() => goToSection("floor-how")} className="hidden lg:grid">
              <CircleHelp aria-hidden="true" className="size-5" />
            </IconButton>
            <button
              type="button"
              onClick={() => open("bids")}
              aria-expanded={layer === "bids"}
              aria-label={`${t(COPY.myBids)}${lang === "ar" ? "، " : ", "}${pl("lots", bidCount)}`}
              className="relative inline-flex h-10 items-center gap-1.5 rounded-control px-2.5 ac-sm font-semibold text-fg transition-colors hover:bg-surface-2"
            >
              <Gavel aria-hidden="true" className="size-[18px]" />
              <span className="hidden sm:inline">{t(COPY.myBids)}</span>
              {bidCount ? (
                <span aria-hidden="true" className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-on-accent ac-num">
                  {bidCount}
                </span>
              ) : null}
            </button>
            <IconButton label={t(COPY.cartCount, { n: cartCount })} onClick={() => open("cart")}>
              <ShoppingCart aria-hidden="true" className="size-5" />
              <Count n={cartCount} />
            </IconButton>
            <div className="hidden lg:block">
              <AccountPopover />
            </div>
            <LangLink className="hidden h-10 items-center rounded-control px-2.5 ac-sm font-semibold text-fg hover:bg-surface-2 xl:inline-flex" />
          </div>
        </div>
      </header>
      <MenuDrawer />
    </>
  );
}
