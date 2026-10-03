"use client";

import Link from "next/link";
import { ChevronDown, MapPin, Menu, ShoppingCart, Truck, UserRound } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LanguageSwitch, useHomeState } from "@/components/shared/r3/home";
import { Popover } from "@/components/shared/r3/popover";
import { getProduct } from "@/data/products";
import { CITIES } from "@/data/sellers";
import { DEMO_USER } from "@/data/site";
import { detailPath } from "@/lib/catalog";
import { COPY } from "./copy";
import { cx } from "./ui";

/** Shopping modes, auctions first (Buy Now never leads). */
export function useNavItems() {
  const { t } = useLang();
  return [
    { key: "timed", label: t(COPY.navTimed), href: "/browse?tab=auction" },
    { key: "live", label: t(COPY.navLive), href: "/live-auction" },
    { key: "buy", label: t(COPY.navBuyNow), href: "/browse?tab=buy_now" },
    { key: "sellers", label: t(COPY.navSellers), href: "/seller" },
    { key: "bulk", label: t(COPY.navBulk), href: "/browse?category=bulk-pallets" },
  ];
}

const panel = "rounded-[10px] border border-[var(--sc-line)] bg-white p-4 shadow-overlay";

export function SavedList({ onPick }) {
  const { t } = useLang();
  const { link } = useConcept();
  const { watched } = useStore();
  const items = [...watched].map(getProduct).filter(Boolean);
  if (!items.length) return <p className="sc-sm text-[var(--sc-muted)]">{t(COPY.savedEmpty)}</p>;
  return (
    <ul className="divide-y divide-[var(--sc-line)]">
      {items.map((product) => (
        <li key={product.slug}>
          <Link href={link(detailPath(product))} onClick={onPick} className="flex items-center gap-3 py-2.5 hover:underline">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-[6px] bg-[var(--sc-plate)]">
              <Img image={product.images[0]} alt="" sizes="44px" className="sc-multiply size-full object-contain p-1" />
            </span>
            <span className="min-w-0 flex-1 truncate sc-sm text-[var(--sc-ink)]">{t(product.title)}</span>
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
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--sc-soft)] sc-sm font-bold text-[var(--sc-green)]">
        {t(DEMO_USER.initials)}
      </span>
      <div className="min-w-0">
        <p className="truncate sc-lg font-semibold text-[var(--sc-ink)]">{t(COPY.hello, { name: first })}</p>
        <p className="sc-xs text-[var(--sc-muted)]">
          {t(COPY.walletBalance)} · <Money value={DEMO_USER.walletBalance} className="font-semibold text-[var(--sc-ink)]" />
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
          className={cx("flex h-10 items-center justify-between rounded-[6px] px-3 sc-md", city === key ? "bg-[var(--sc-soft)] font-semibold text-[var(--sc-green)]" : "text-[var(--sc-ink)] hover:bg-[var(--sc-soft)]")}
        >
          {t(name)}
          {city === key ? <span aria-hidden="true" className="size-2 rounded-full bg-[var(--sc-green)]" /> : null}
        </button>
      ))}
    </div>
  );
}

/** "EN | العربية" — header utility bar, white base and menu. */
export function SaudiLanguage({ className = "", onNavigate, tone = "ink" }) {
  const { t } = useLang();
  return (
    <LanguageSwitch
      label={t(COPY.language)}
      onNavigate={onNavigate}
      className={cx("flex items-center", className)}
      separator={<span aria-hidden="true" className={cx("mx-3 h-4 w-px", tone === "ink" ? "bg-[var(--sc-ink)]/60" : "bg-white/60")} />}
      itemClass={(current) => cx("sc-md dt:text-[16px]", current ? "font-semibold text-[var(--sc-ink)]" : "text-[var(--sc-ink)]/85 hover:underline")}
    />
  );
}

const utility = "inline-flex h-9 items-center gap-2 rounded-[6px] sc-md text-[var(--sc-ink)] hover:underline dt:text-[15px]";

function CityButton() {
  const { t } = useLang();
  const { city } = useHomeState();
  return (
    <Popover
      label={t(COPY.chooseCity)}
      align="start"
      panelClassName={cx(panel, "w-64")}
      trigger={({ open, toggle, panelId }) => (
        <button type="button" onClick={toggle} aria-expanded={open} aria-controls={open ? panelId : undefined} className={utility}>
          <MapPin aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          <span className="sr-only">{t(COPY.location)}: </span>
          {t(CITIES[city])}
        </button>
      )}
    >
      {(close) => (
        <>
          <p className="mb-2 sc-md font-semibold text-[var(--sc-ink)]">{t(COPY.chooseCity)}</p>
          <CityChoices onPicked={close} />
        </>
      )}
    </Popover>
  );
}

function DeliveryButton() {
  const { t } = useLang();
  return (
    <Popover
      label={t(COPY.delivery)}
      align="start"
      panelClassName={cx(panel, "w-72")}
      trigger={({ open, toggle, panelId }) => (
        <button type="button" onClick={toggle} aria-expanded={open} aria-controls={open ? panelId : undefined} className={utility}>
          <Truck aria-hidden="true" className="size-5" strokeWidth={1.7} />
          {t(COPY.delivery)}
        </button>
      )}
    >
      {() => (
        <>
          <p className="sc-md font-semibold text-[var(--sc-ink)]">{t(COPY.delivery)}</p>
          <p className="mt-1 sc-sm text-[var(--sc-muted)]">{t(COPY.deliveryText)}</p>
        </>
      )}
    </Popover>
  );
}

function AccountButton() {
  const { t } = useLang();
  const { watched } = useStore();
  return (
    <Popover
      label={t(COPY.account)}
      panelClassName={cx(panel, "w-72")}
      trigger={({ open, toggle, panelId }) => (
        <button type="button" onClick={toggle} aria-expanded={open} aria-controls={open ? panelId : undefined} className="inline-flex h-11 items-center gap-2.5 rounded-[6px] px-1 sc-md text-[var(--sc-ink)] hover:text-[var(--sc-green)] dt:text-[16px]">
          <UserRound aria-hidden="true" className="size-6" strokeWidth={1.5} />
          <span className="max-md:sr-only">{t(COPY.account)}</span>
          <ChevronDown aria-hidden="true" className="size-4 max-md:hidden" strokeWidth={2} />
        </button>
      )}
    >
      {(close) => (
        <>
          <AccountSummary />
          <p className="mt-4 sc-xs font-semibold uppercase tracking-[0.08em] text-[var(--sc-muted)]">
            {t(COPY.saved)} · {watched.size}
          </p>
          <div className="mt-1">
            <SavedList onPick={close} />
          </div>
        </>
      )}
    </Popover>
  );
}

/** `active`: the current shopping mode on Browse ("timed", "buy", "bulk" or null), or "live" on the live auction. */
export function Header({ active } = {}) {
  const { t } = useLang();
  const { link } = useConcept();
  const { cartCount } = useStore();
  const { open } = useHomeState();
  const nav = useNavItems();
  return (
    <header>
      {/* Utility bar: city and delivery at the start, language at the end */}
      <div data-ref="01" className="bg-[var(--sc-utility)]">
        <div className="sc-head flex h-11 items-center justify-between gap-4 dt:h-[49px]">
          <div role="group" aria-label={t(COPY.utility)} className="flex items-center gap-4 dt:gap-[38px]">
            <CityButton />
            <div className="max-sm:hidden">
              <DeliveryButton />
            </div>
          </div>
          <SaudiLanguage />
        </div>
      </div>
      {/* Main row: logo · shopping modes · account and cart */}
      <div data-ref="02" className="border-b border-[var(--sc-line)] bg-white">
        <div className="sc-head flex h-16 items-center gap-3 md:h-[76px] dt:grid dt:h-[94px] dt:grid-cols-[auto_minmax(0,1fr)_auto] dt:gap-8">
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => open("menu")} aria-label={t(COPY.openMenu)} className="-ms-2 grid size-11 place-items-center rounded-[6px] text-[var(--sc-ink)] dt:hidden">
              <Menu aria-hidden="true" className="size-6" strokeWidth={1.8} />
            </button>
            <Link href={link("/")} className="shrink-0 rounded-[6px] outline-offset-4">
              <Logo variant="lockup" title={t(COPY.home)} className="h-10 w-auto md:h-12 dt:h-[58px]" />
            </Link>
          </div>
          {/* 46 px apart from 1366 px; tighter below so the modes stay on one line. */}
          <nav aria-label={t(COPY.mainNav)} className="hidden justify-self-center dt:block min-[1366px]:pe-[70px]">
            <ul className="flex items-center gap-7 min-[1366px]:gap-[46px]">
              {nav.map((item) => {
                const current = active != null && item.key === active;
                return (
                  <li key={item.key}>
                    <Link
                      href={link(item.href)}
                      aria-current={current ? "page" : undefined}
                      className={cx(
                        "sc-nav underline-offset-[10px] transition-colors hover:text-[var(--sc-green)] hover:underline",
                        current ? "font-semibold text-[var(--sc-green)] underline decoration-2" : "text-[var(--sc-ink)]",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="ms-auto flex items-center gap-2 dt:ms-0 dt:gap-[40px]">
            <AccountButton />
            <button type="button" onClick={() => open("cart")} aria-label={t(COPY.cartCount, { n: cartCount })} className="relative inline-flex h-11 items-center gap-2.5 rounded-[6px] px-1 sc-md text-[var(--sc-ink)] hover:text-[var(--sc-green)] dt:text-[16px]">
              <ShoppingCart aria-hidden="true" className="size-6" strokeWidth={1.5} />
              <span aria-hidden="true" className="max-md:hidden">
                {t(COPY.cart)}
              </span>
              {cartCount ? (
                <span aria-hidden="true" className="absolute -top-0.5 start-4 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[var(--sc-green)] px-1 text-[11px] font-bold text-white tabular">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
