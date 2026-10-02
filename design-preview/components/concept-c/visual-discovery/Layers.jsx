"use client";

// The phone / tablet menu and the cart drawer of the Visual Discovery pages
// (home, Browse and Auction). Browse passes its current shopping mode as
// `active`.
import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { CartDrawer, MenuDrawer } from "@/components/shared/r3/drawers";
import { useHomeState } from "@/components/shared/r3/home";
import { COPY } from "./copy";
import { AccountSummary, CityChoices, DiscoveryLanguage, SavedList, useModes } from "./Header";
import { Arrow, cx } from "./ui";

/**
 * Phones and tablets: shopping modes, saved lots, account, city and language.
 * Browse passes its current shopping mode as `active`.
 */
export function Menu({ active } = {}) {
  const { t } = useLang();
  const { link } = useConcept();
  const { watched } = useStore();
  const { layer, close } = useHomeState();
  const modes = useModes(active);
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

export function Cart() {
  const { layer, close } = useHomeState();
  return <CartDrawer open={layer === "cart"} onClose={close} titleClassName="vd-h3 text-fg" priceClassName="vd-price !text-[18px]" smallClassName="vd-sm" />;
}
