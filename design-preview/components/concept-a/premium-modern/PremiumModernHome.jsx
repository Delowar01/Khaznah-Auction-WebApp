"use client";

import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { R3Root } from "@/components/shared/r3/R3Root";
import { CartDrawer, MenuDrawer } from "@/components/shared/r3/drawers";
import { HomeStateProvider, useHomeState } from "@/components/shared/r3/home";
import { CITIES } from "@/data/sellers";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { Footer, Newsletter } from "./Footer";
import { AccountSummary, Header, PremiumLanguage, SavedList, useAccountItems, useNavItems } from "./Header";
import { Hero } from "./Hero";
import { BulkRows, BuyNowShelf, CategoryRow, EndingSoonBand, FeaturedItems, GuidanceSplit, LiveSection, Selected, Sellers, TrustStrip } from "./sections";
import { Chevron, cx } from "./ui";

/** Phones, tablets and Arabic below 1366 px: shopping modes, wishlist, account, city and language. */
function Menu() {
  const { t } = useLang();
  const { link } = useConcept();
  const { layer, close, city, setCity } = useHomeState();
  const nav = useNavItems();
  const accountItems = useAccountItems();
  const [cities, setCities] = useState(false);
  const heading = "pr-xs font-semibold uppercase tracking-[0.12em] text-fg-2";
  return (
    <MenuDrawer open={layer === "menu"} onClose={close} title={t(COPY.menu)} head={<Logo variant="lockup" decorative className="h-9 w-auto" />}>
      <nav aria-label={t(COPY.mainNav)}>
        <ul className="divide-y divide-line border-y border-line">
          {nav.map((item) => (
            <li key={item.key}>
              <Link href={link(item.href)} onClick={close} className="flex h-14 items-center justify-between pr-lg font-medium text-fg">
                {item.label}
                <Chevron className="size-4 text-fg-2" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className={cx(heading, "mt-7")}>{t(COPY.wishlist)}</p>
      <div className="mt-2">
        <SavedList onPick={close} />
      </div>
      <p className={cx(heading, "mt-7")}>{t(COPY.account)}</p>
      <div className="mt-3">
        <AccountSummary />
      </div>
      <ul className="mt-2 divide-y divide-line">
        {accountItems.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => {
                item.run();
                close();
              }}
              className="flex h-12 w-full items-center text-start pr-md text-fg"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <div>
          <button type="button" onClick={() => setCities((v) => !v)} aria-expanded={cities} className="inline-flex h-10 items-center gap-1.5 pr-md text-fg">
            <MapPin aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            <span className="sr-only">{t(COPY.location)}: </span>
            {t(CITIES[city])}
            <ChevronDown aria-hidden="true" className="size-3.5" />
          </button>
        </div>
        <PremiumLanguage onNavigate={close} />
      </div>
      {cities ? (
        <div role="radiogroup" aria-label={t(COPY.chooseCity)} className="mt-2 grid gap-0.5">
          {Object.entries(CITIES).map(([key, name]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={city === key}
              onClick={() => {
                setCity(key);
                setCities(false);
              }}
              className={cx("flex h-11 items-center rounded-[4px] px-3 pr-md", city === key ? "bg-[var(--pr-stone)] font-semibold" : "hover:bg-[var(--pr-stone)]")}
            >
              {t(name)}
            </button>
          ))}
        </div>
      ) : null}
    </MenuDrawer>
  );
}

function Cart() {
  const { layer, close } = useHomeState();
  return <CartDrawer open={layer === "cart"} onClose={close} titleClassName="pr-h3 text-fg" priceClassName="pr-price-sm" smallClassName="pr-sm" />;
}

function Page() {
  const { t } = useLang();
  // One live-event simulation feeds the hero pin and the live section.
  const live = useLiveEvent();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[4px] bg-[var(--pr-charcoal)] px-4 py-2.5 pr-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero live={live} />
        <CategoryRow />
        {/* Auctions come before any Buy Now section. */}
        <EndingSoonBand />
        <FeaturedItems />
        <LiveSection live={live} />
        <BuyNowShelf />
        <Selected />
        <BulkRows />
        <Sellers />
        <TrustStrip />
        <GuidanceSplit />
      </main>
      <Newsletter />
      <Footer />
      <Menu />
      <Cart />
    </div>
  );
}

/**
 * Option 2 — Premium Modern Marketplace home (approved design).
 * Warm ivory storefront: a centred-logo masthead over a separate search row,
 * a panoramic room hero with an inset copy card and a pinned live lot, eight
 * unboxed category photos, then an Ending soon stone band, a Featured Items
 * shelf led by auction lots and a split live auction, before
 * four equal Buy Now cards, two recommendation panels, two pallet rows, five
 * seller cards, a trust strip, grades beside How Khaznah works, a charcoal
 * newsletter and a light footer.
 */
export function PremiumModernHome() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
