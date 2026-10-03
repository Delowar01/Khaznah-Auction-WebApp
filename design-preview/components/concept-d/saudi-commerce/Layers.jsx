"use client";

// The phone / tablet menu and the cart drawer of the Contemporary Saudi
// Commerce pages (home, Browse, Auction and Live auction). Browse passes its
// current shopping mode as `active`, the live auction "live".
import Link from "next/link";
import { ChevronDown, MapPin, Truck } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { CartDrawer, MenuDrawer } from "@/components/shared/r3/drawers";
import { useHomeState } from "@/components/shared/r3/home";
import { CITIES } from "@/data/sellers";
import { COPY } from "./copy";
import { AccountSummary, CityChoices, SaudiLanguage, SavedList, useNavItems } from "./Header";
import { Arrow, cx } from "./ui";

/**
 * Phones and tablets: shopping modes, account, saved lots, city, delivery and
 * language. Browse passes its current shopping mode as `active`.
 */
export function Menu({ active } = {}) {
  const { t } = useLang();
  const { link } = useConcept();
  const { watched } = useStore();
  const { layer, close, city } = useHomeState();
  const nav = useNavItems();
  const [cities, setCities] = useState(false);
  const heading = "sc-xs font-semibold uppercase tracking-[0.08em] text-[var(--sc-muted)]";
  return (
    <MenuDrawer open={layer === "menu"} onClose={close} title={t(COPY.menu)} head={<Logo variant="lockup" decorative className="h-9 w-auto" />}>
      <nav aria-label={t(COPY.mainNav)}>
        <ul className="divide-y divide-[var(--sc-line)] border-y border-[var(--sc-line)]">
          {nav.map((item) => {
            const current = active != null && item.key === active;
            return (
              <li key={item.key}>
                <Link
                  href={link(item.href)}
                  onClick={close}
                  aria-current={current ? "page" : undefined}
                  className={cx("flex h-14 items-center justify-between sc-lg", current ? "font-semibold text-[var(--sc-green)]" : "font-medium text-[var(--sc-ink)]")}
                >
                  {item.label}
                  <Arrow className="size-4 text-[var(--sc-green)]" />
                </Link>
              </li>
            );
          })}
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
      <div className="mt-6 border-t border-[var(--sc-line)] pt-5">
        <button type="button" onClick={() => setCities((v) => !v)} aria-expanded={cities} className="inline-flex h-10 items-center gap-2 sc-md text-[var(--sc-ink)]">
          <MapPin aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          <span className="sr-only">{t(COPY.location)}: </span>
          {t(CITIES[city])}
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </button>
        {cities ? (
          <div className="mt-2">
            <CityChoices onPicked={() => setCities(false)} />
          </div>
        ) : null}
        <p className="mt-3 flex items-start gap-2 sc-sm text-[var(--sc-muted)]">
          <Truck aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} />
          <span>
            <span className="font-semibold text-[var(--sc-ink)]">{t(COPY.delivery)}. </span>
            {t(COPY.deliveryText)}
          </span>
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--sc-line)] pt-5">
        <p className="sc-md font-semibold text-[var(--sc-ink)]">{t(COPY.language)}</p>
        <SaudiLanguage onNavigate={close} />
      </div>
    </MenuDrawer>
  );
}

export function Cart() {
  const { layer, close } = useHomeState();
  return <CartDrawer open={layer === "cart"} onClose={close} titleClassName="sc-h3 text-fg" priceClassName="sc-price !text-[19px]" smallClassName="sc-sm" />;
}
