"use client";

// The phone / tablet menu and the cart drawer of the Premium Modern pages
// (home, Browse, Auction, Live auction and Product). Browse passes its
// current shopping mode as `active`, an auction lot "timed", the live auction
// "live" and a product page "buy".
import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Logo } from "@/components/shared/brand/Logo";
import { CartDrawer, MenuDrawer } from "@/components/shared/r3/drawers";
import { useHomeState } from "@/components/shared/r3/home";
import { CITIES } from "@/data/sellers";
import { COPY } from "./copy";
import { AccountSummary, PremiumLanguage, SavedList, useAccountItems, useNavItems } from "./Header";
import { Chevron, cx } from "./ui";

/**
 * Phones, tablets and Arabic below 1366 px: shopping modes, wishlist, account,
 * city and language. Browse passes its current shopping mode as `active`.
 */
export function Menu({ active } = {}) {
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
          {nav.map((item) => {
            const current = active != null && item.key === active;
            return (
              <li key={item.key}>
                <Link href={link(item.href)} onClick={close} aria-current={current ? "page" : undefined} className={cx("flex h-14 items-center justify-between pr-lg text-fg", current ? "font-semibold" : "font-medium")}>
                  {current ? (
                    <span className="flex items-center gap-3">
                      <span aria-hidden="true" className="pr-dash !w-5" />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                  <Chevron className="size-4 text-fg-2" />
                </Link>
              </li>
            );
          })}
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

export function Cart() {
  const { layer, close } = useHomeState();
  return <CartDrawer open={layer === "cart"} onClose={close} titleClassName="pr-h3 text-fg" priceClassName="pr-price-sm" smallClassName="pr-sm" />;
}
