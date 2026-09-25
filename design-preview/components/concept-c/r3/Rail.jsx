"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Clock3,
  Gavel,
  Globe2,
  Heart,
  Home,
  Layers,
  LayoutList,
  PanelLeftOpen,
  Radio,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
  Wallet,
} from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Img } from "@/components/shared/ui/Img";
import { Drawer } from "@/components/shared/ui/Drawer";
import { CATEGORIES } from "@/data/categories";
import { CITIES } from "@/data/sellers";
import { DEMO_USER } from "@/data/site";
import { plural } from "@/lib/i18n";
import { COPY, PL } from "./copy";
import { CATEGORY_TREE, COUNTS, SELLER_ROWS } from "./data";
import { SearchBox } from "./Search";
import { useHub } from "./state";
import { LiveDot, cx } from "./ui";

export const DECK_INPUT_ID = "hb-deck-input";

/** Focus the home search deck (scrolling back to it when needed). */
export function focusDeck() {
  const input = document.getElementById(DECK_INPUT_ID);
  if (!input) return;
  const top = input.getBoundingClientRect().top;
  if (top < 80 || top > window.innerHeight - 80) window.scrollTo({ top: 0, behavior: "smooth" });
  window.setTimeout(() => input.focus({ preventScroll: true }), top < 80 ? 350 : 0);
}

export function LangLink({ className = "", onClick }) {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const other = lang === "ar" ? "en" : "ar";
  return (
    <Link
      href={pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`)}
      hrefLang={other}
      lang={other}
      onClick={onClick}
      aria-label={t(COPY.switchLanguageLabel)}
      className={className}
    >
      {t(COPY.switchLanguage)}
    </Link>
  );
}

function RailLink({ href, icon: Icon, label, count, active, live, onNavigate }) {
  const { link } = useConcept();
  return (
    <Link
      href={link(href)}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cx(
        "flex h-9 items-center gap-2.5 rounded-[8px] px-2.5 hb-sm transition-colors",
        active ? "bg-surface-2 font-semibold text-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg",
      )}
    >
      <Icon aria-hidden="true" className={cx("size-4 shrink-0", live ? "text-live" : "")} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {live ? <LiveDot /> : null}
      {count != null ? <span className="hb-num hb-xs font-semibold text-fg-3">{count}</span> : null}
    </Link>
  );
}

function RailHeading({ children }) {
  return <p className="px-2.5 pb-1.5 pt-5 hb-eyebrow text-fg-3">{children}</p>;
}

function CategoryBranch({ row, defaultOpen, onNavigate }) {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const [open, setOpen] = useState(defaultOpen);
  const { category, total, auctions, buyNow } = row;
  const branchId = `hb-branch-${category.slug}`;
  return (
    <li>
      <div className="flex items-center rounded-[8px] hover:bg-surface-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={branchId}
          aria-label={t(COPY.showBranches, { name: t(category.name) })}
          onClick={() => setOpen((v) => !v)}
          className="grid size-8 shrink-0 place-items-center rounded-[6px] text-fg-3 hover:text-fg"
        >
          <ChevronDown aria-hidden="true" className={cx("size-4 transition-transform", open ? "" : lang === "ar" ? "rotate-90" : "-rotate-90")} />
        </button>
        <Link href={link(`/browse?category=${category.slug}`)} onClick={onNavigate} className="flex h-9 min-w-0 flex-1 items-center gap-2 pe-2.5 hb-sm text-fg-2 hover:text-fg">
          <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-[5px] bg-plate">
            <Img image={category.image} alt="" sizes="24px" className="size-full object-contain p-0.5 mix-blend-multiply" />
          </span>
          <span className="min-w-0 flex-1 truncate">{t(category.name)}</span>
          <span className="hb-num hb-xs font-semibold text-fg-3">{total}</span>
        </Link>
      </div>
      {open ? (
        <ul id={branchId} className="mb-1 ms-[42px] border-s border-line ps-2">
          <li>
            <Link href={link(`/browse?category=${category.slug}&tab=auction`)} onClick={onNavigate} className="flex h-8 items-center justify-between rounded-[6px] px-2 hb-sm text-fg-2 hover:bg-surface-2 hover:text-fg">
              {t(COPY.auctions)}
              <span className="hb-num hb-xs text-fg-3">{auctions}</span>
            </Link>
          </li>
          <li>
            <Link href={link(`/browse?category=${category.slug}&tab=buy_now`)} onClick={onNavigate} className="flex h-8 items-center justify-between rounded-[6px] px-2 hb-sm text-fg-2 hover:bg-surface-2 hover:text-fg">
              {t(COPY.buyNow)}
              <span className="hb-num hb-xs text-fg-3">{buyNow}</span>
            </Link>
          </li>
        </ul>
      ) : null}
    </li>
  );
}

/** The full rail content: marketplace, category tree, sellers, My Khazna. */
export function RailContent({ onNavigate, showSearch = false, inMenu = false }) {
  const { t, lang } = useLang();
  const { link } = useConcept();
  const { toast, watched } = useStore();
  const [allSellers, setAllSellers] = useState(false);
  const sellers = allSellers ? SELLER_ROWS : SELLER_ROWS.slice(0, 2);

  return (
    <div className={cx("flex flex-col", inMenu ? "" : "px-3 pb-6")}>
      {!inMenu ? (
        <div className="sticky top-0 z-10 -mx-3 bg-[var(--hb-rail-bg)] px-3 pb-3 pt-4">
          <Link href={link("/")} onClick={onNavigate} className="flex items-center gap-2.5 rounded-lg px-1.5 outline-offset-4">
            <Logo variant="lockup" title={t(COPY.home)} className="h-8 w-auto" />
            <span aria-hidden="true" className="h-5 w-px bg-line-strong" />
            <span className="hb-xs font-semibold text-fg-3">{t(COPY.brandCaption)}</span>
          </Link>
          {showSearch ? (
            <div className="mt-3 kz-fade-up">
              <SearchBox variant="rail" />
            </div>
          ) : null}
        </div>
      ) : null}

      <nav aria-label={t(COPY.railLabel)}>
        <RailHeading>{t(COPY.marketplace)}</RailHeading>
        <ul className="grid gap-0.5">
          <li>
            <RailLink href="/" icon={Home} label={t(COPY.pageTitle)} active={!inMenu} onNavigate={onNavigate} />
          </li>
          <li>
            <RailLink href="/browse" icon={LayoutList} label={t(COPY.allLots)} count={COUNTS.all} onNavigate={onNavigate} />
          </li>
          <li>
            <RailLink href="/browse?tab=auction" icon={Gavel} label={t(COPY.auctions)} count={COUNTS.auctions} onNavigate={onNavigate} />
          </li>
          <li>
            <RailLink href="/browse?tab=buy_now" icon={ShoppingBag} label={t(COPY.buyNow)} count={COUNTS.buyNow} onNavigate={onNavigate} />
          </li>
          <li>
            <RailLink href="/live-auction" icon={Radio} label={t(COPY.liveNow)} count={COUNTS.liveEvents} live onNavigate={onNavigate} />
          </li>
          <li>
            <RailLink href="/browse?tab=auction&ending=1h" icon={Clock3} label={t(COPY.endingSoon)} count={COUNTS.endingHour} onNavigate={onNavigate} />
          </li>
          <li>
            <RailLink href="/browse?sort=newest" icon={Sparkles} label={t(COPY.newToday)} count={COUNTS.newToday} onNavigate={onNavigate} />
          </li>
          <li>
            <RailLink href="/browse?category=bulk-pallets" icon={Layers} label={t(COPY.bulk)} count={COUNTS.bulk} onNavigate={onNavigate} />
          </li>
        </ul>

        <RailHeading>{t(COPY.categories)}</RailHeading>
        <ul className="grid gap-0.5">
          {CATEGORY_TREE.map((row) => (
            <CategoryBranch key={row.category.slug} row={row} defaultOpen={row.category.slug === "home-appliances"} onNavigate={onNavigate} />
          ))}
        </ul>

        <RailHeading>{t(COPY.sellers)}</RailHeading>
        <ul className="grid gap-0.5">
          {sellers.map(({ seller, stats }) => (
            <li key={seller.code}>
              <Link
                href={link(`/seller/${seller.code}`)}
                onClick={onNavigate}
                className="flex h-10 items-center gap-2.5 rounded-[8px] px-2.5 text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: seller.tone }}>
                  {seller.monogram}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate hb-sm">{t(seller.name)}</span>
                  <span className="block truncate hb-2xs text-fg-3">
                    {t(CITIES[seller.city])} · {plural(stats.total, { en: { one: "{n} lot", other: "{n} lots" }, ar: { zero: "لا منتجات", one: "منتج واحد", two: "منتجان", few: "{n} منتجات", many: "{n} منتجاً", other: "{n} منتج" } }, lang)}
                  </span>
                </span>
                {seller.liveNow ? <span className="rounded-[4px] bg-live px-1.5 hb-2xs font-bold uppercase text-white">{t(COPY.live)}</span> : null}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              aria-expanded={allSellers}
              onClick={() => setAllSellers((v) => !v)}
              className="flex h-9 w-full items-center gap-2.5 rounded-[8px] px-2.5 text-start hb-sm font-semibold text-primary hover:bg-surface-2"
            >
              {allSellers ? t(COPY.fewerSellers) : `+ ${t(COPY.moreSellers, { n: SELLER_ROWS.length - 2 })}`}
            </button>
          </li>
        </ul>

        <RailHeading>{t(COPY.myKhazna)}</RailHeading>
        <ul className="grid gap-0.5">
          <li>
            <button
              type="button"
              onClick={() => toast({ tone: "info", title: t(COPY.watchBids), description: t(COPY.myBidsText) })}
              className="flex h-9 w-full items-center gap-2.5 rounded-[8px] px-2.5 text-start hb-sm text-fg-2 hover:bg-surface-2 hover:text-fg"
            >
              <Heart aria-hidden="true" className="size-4" />
              <span className="flex-1">{t(COPY.watchBids)}</span>
              <span className="hb-num hb-xs font-semibold text-fg-3">{watched.size}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => toast({ tone: "neutral", title: t(COPY.ordersWallet), description: t(COPY.ordersText) })}
              className="flex h-9 w-full items-center gap-2.5 rounded-[8px] px-2.5 text-start hb-sm text-fg-2 hover:bg-surface-2 hover:text-fg"
            >
              <Wallet aria-hidden="true" className="size-4" />
              <span className="flex-1">{t(COPY.ordersWallet)}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => toast({ tone: "neutral", title: t(COPY.hello, { name: t(DEMO_USER.name).split(" ")[0] }) })}
              className="flex h-9 w-full items-center gap-2.5 rounded-[8px] px-2.5 text-start hb-sm text-fg-2 hover:bg-surface-2 hover:text-fg"
            >
              <UserRound aria-hidden="true" className="size-4" />
              <span className="flex-1">{t(COPY.account)}</span>
            </button>
          </li>
        </ul>

        <div className="mt-5 grid gap-0.5 border-t border-line pt-3">
          <a
            href="#buying"
            onClick={onNavigate}
            className="flex h-9 items-center gap-2.5 rounded-[8px] px-2.5 hb-sm font-semibold text-fg hover:bg-surface-2"
          >
            <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
            {t(COPY.buyingOnKhazna)}
          </a>
          <div className="flex min-h-9 flex-wrap items-center gap-x-2.5 gap-y-1 rounded-[8px] px-2.5 hb-sm text-fg-2">
            <Globe2 aria-hidden="true" className="size-4" />
            <span className="sr-only">{t(COPY.countryLanguage)}: </span>
            <span>{t(COPY.saudiArabia)}</span>
            <span aria-hidden="true" className="text-fg-3">
              ·
            </span>
            <LangLink onClick={onNavigate} className="font-semibold text-primary hover:underline" />
          </div>
        </div>
      </nav>
    </div>
  );
}

function CollapsedItem({ href, onClick, label, children, live, active }) {
  const { link } = useConcept();
  const cls = cx(
    "group relative grid size-11 place-items-center rounded-[10px] transition-colors",
    active ? "bg-surface-2 text-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg",
  );
  const tip = (
    <span className="hb-tip absolute start-full top-1/2 z-50 ms-2 -translate-y-1/2 whitespace-nowrap rounded-[6px] bg-fg px-2 py-1 hb-xs font-semibold text-bg shadow-raised">
      {label}
    </span>
  );
  return href ? (
    <Link href={link(href)} aria-label={label} aria-current={active ? "page" : undefined} className={cls}>
      {children}
      {live ? (
        <span aria-hidden="true" className="absolute end-2 top-2 flex">
          <LiveDot />
        </span>
      ) : null}
      {tip}
    </Link>
  ) : (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>
      {children}
      {tip}
    </button>
  );
}

/** 1024–1279px: a 72px column of icons and category thumbnails with labels on hover/focus. */
function CollapsedRail() {
  const { t } = useLang();
  const { link } = useConcept();
  const { open } = useHub();
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      <Link href={link("/")} aria-label={t(COPY.home)} className="mb-1 grid size-11 place-items-center rounded-[10px]">
        <Logo variant="mark" decorative className="h-7 w-auto" />
      </Link>
      <CollapsedItem onClick={() => open("rail")} label={t(COPY.expandRail)}>
        <PanelLeftOpen aria-hidden="true" className="flip-rtl size-[18px]" />
      </CollapsedItem>
      <CollapsedItem onClick={focusDeck} label={t(COPY.searchShort)}>
        <Search aria-hidden="true" className="size-[18px]" />
      </CollapsedItem>
      <span aria-hidden="true" className="my-1 h-px w-8 bg-line" />
      <CollapsedItem href="/" label={t(COPY.pageTitle)} active>
        <Home aria-hidden="true" className="size-[18px]" />
      </CollapsedItem>
      <CollapsedItem href="/browse?tab=auction" label={`${t(COPY.auctions)} · ${COUNTS.auctions}`}>
        <Gavel aria-hidden="true" className="size-[18px]" />
      </CollapsedItem>
      <CollapsedItem href="/browse?tab=buy_now" label={`${t(COPY.buyNow)} · ${COUNTS.buyNow}`}>
        <ShoppingBag aria-hidden="true" className="size-[18px]" />
      </CollapsedItem>
      <CollapsedItem href="/live-auction" label={`${t(COPY.liveNow)} · ${COUNTS.liveEvents}`} live>
        <Radio aria-hidden="true" className="size-[18px]" />
      </CollapsedItem>
      <span aria-hidden="true" className="my-1 h-px w-8 bg-line" />
      {CATEGORIES.map((category) => (
        <CollapsedItem key={category.slug} href={`/browse?category=${category.slug}`} label={t(category.name)}>
          <span className="grid size-8 place-items-center overflow-hidden rounded-[7px] bg-plate">
            <Img image={category.image} alt="" sizes="32px" className="size-full object-contain p-0.5 mix-blend-multiply" />
          </span>
        </CollapsedItem>
      ))}
    </div>
  );
}

/** The navigation rail (tablet landscape and up). */
export function Rail() {
  const { t } = useLang();
  const { deckVisible, layer, close } = useHub();
  return (
    <>
      <aside aria-label={t(COPY.railLabel)} className="hb-rail z-20 col-start-1 row-start-1 hidden lg:block">
        <div className="xl:hidden">
          <CollapsedRail />
        </div>
        <div className="hidden xl:block">
          <RailContent showSearch={!deckVisible} />
        </div>
      </aside>
      <Drawer
        open={layer === "rail"}
        onClose={close}
        title={t(COPY.railLabel)}
        side="start"
        panelClassName="bg-[var(--hb-rail-bg)] font-sans text-fg shadow-overlay w-[300px] overflow-y-auto"
      >
        <RailContent onNavigate={close} showSearch />
      </Drawer>
    </>
  );
}
