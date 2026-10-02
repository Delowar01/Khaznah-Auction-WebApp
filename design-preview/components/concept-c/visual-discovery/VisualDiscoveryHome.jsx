"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { R3Root } from "@/components/shared/r3/R3Root";
import { CartDrawer, MenuDrawer } from "@/components/shared/r3/drawers";
import { HomeStateProvider, useHomeState } from "@/components/shared/r3/home";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { Footer, Newsletter } from "./Footer";
import { AccountSummary, CityChoices, DiscoveryLanguage, Header, SavedList, useModes } from "./Header";
import { HeroMosaic } from "./Hero";
import { BulkPanels, CategoryPills, Clarity, EndingSoon, FeaturedItems, HowItWorks, LiveBanner, ProductWall, SellerShelves } from "./sections";
import { Arrow, cx } from "./ui";

/** Phones and tablets: shopping modes, saved lots, account, city and language. */
function Menu() {
  const { t } = useLang();
  const { link } = useConcept();
  const { watched } = useStore();
  const { layer, close } = useHomeState();
  const modes = useModes();
  const heading = "vd-xs font-bold uppercase tracking-[0.08em] text-[var(--vd-muted)]";
  return (
    <MenuDrawer open={layer === "menu"} onClose={close} title={t(COPY.menu)} head={<Logo variant="lockup" decorative className="h-9 w-auto" />}>
      <nav aria-label={t(COPY.modes)}>
        <ul className="grid gap-1">
          {modes.map((mode) => (
            <li key={mode.key}>
              <Link
                href={link(mode.href)}
                onClick={close}
                aria-current={mode.current ? "page" : undefined}
                className={cx("flex h-12 items-center justify-between rounded-full px-4 vd-lg", mode.current ? "bg-[var(--vd-indigo)] font-semibold text-white" : "text-[var(--vd-ink)] hover:bg-[var(--vd-bluegray)]")}
              >
                {mode.label}
                <Arrow className={cx("size-4", mode.current ? "text-white" : "text-[var(--vd-indigo)]")} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className={cx(heading, "mt-7")}>{t(COPY.account)}</p>
      <div className="mt-3">
        <AccountSummary />
      </div>
      <p className={cx(heading, "mt-7")}>
        {t(COPY.saved)} · {watched.size}
      </p>
      <div className="mt-1">
        <SavedList onPick={close} />
      </div>
      <p className={cx(heading, "mt-7")}>{t(COPY.chooseCity)}</p>
      <div className="mt-2">
        <CityChoices />
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--vd-line)] pt-5">
        <p className="vd-md font-semibold text-[var(--vd-ink)]">{t(COPY.language)}</p>
        <DiscoveryLanguage onNavigate={close} />
      </div>
    </MenuDrawer>
  );
}

function Cart() {
  const { layer, close } = useHomeState();
  return <CartDrawer open={layer === "cart"} onClose={close} titleClassName="vd-h3 text-fg" priceClassName="vd-price !text-[18px]" smallClassName="vd-sm" />;
}

function Page() {
  const { t } = useLang();
  // One live-event simulation feeds the live banner.
  const live = useLiveEvent();
  return (
    <div className="bg-bg font-sans text-fg">
      <a href="#main" className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-full bg-[var(--vd-indigo)] px-5 py-2.5 vd-md font-semibold text-white transition-transform focus:translate-y-0">
        {t(COPY.skip)}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroMosaic />
        <CategoryPills />
        {/* Auctions come before the Buy Now wall. */}
        <LiveBanner live={live} />
        <FeaturedItems />
        <EndingSoon />
        <ProductWall />
        <SellerShelves />
        <BulkPanels />
        <Clarity />
        <HowItWorks />
      </main>
      <Newsletter />
      <Footer />
      <Menu />
      <Cart />
    </div>
  );
}

/**
 * Option 3 — Visual Discovery Marketplace home (approved design).
 * White marketplace with a logo + pill-search masthead over a Discover row,
 * a mosaic hero (copy tile, furniture scene with an overlapping tote card,
 * stacked Electronics and Home & Kitchen tiles), eight outlined category
 * pills, then the auctions: a navy live banner, a Featured Items mosaic led
 * by auction lots and Ending soon's image-first cards. The
 * mixed-height Buy Now wall follows, then photographic seller shelves, two
 * bulk panels, a compact clarity row, How it works, an ivory newsletter and
 * a white footer with language and social links.
 */
export function VisualDiscoveryHome() {
  return (
    <R3Root>
      <HomeStateProvider>
        <Page />
      </HomeStateProvider>
    </R3Root>
  );
}
