"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, Radio, ShoppingCart, UserRound } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { CountBubble } from "./ChromeBits";
import { useChrome } from "./ChromeContext";

const ITEM =
  "flex h-full w-full flex-col items-center justify-center gap-1 kb-2xs font-semibold text-fg-3 transition-colors aria-[current=page]:text-primary aria-expanded:text-primary";

/** Fixed bottom tab bar on phones and tablets (Home · Categories · Live · Cart · Account). */
export function MobileTabBar() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const pathname = usePathname();
  const { cartCount } = useStore();
  const { panel, open, signedIn } = useChrome();

  return (
    <nav
      aria-label={t(COPY.shortcuts)}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-(--kb-sh-bar) backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto grid h-[60px] max-w-xl grid-cols-5">
        <li>
          <Link href={link("/")} aria-current={pathname === link("/") ? "page" : undefined} className={ITEM}>
            <House aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
            {ui("home")}
          </Link>
        </li>
        <li>
          <button type="button" onClick={() => open("categories")} aria-expanded={panel === "categories"} className={ITEM}>
            <LayoutGrid aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
            {ui("categories")}
          </button>
        </li>
        <li>
          <Link href={link("/live-auction")} aria-current={pathname.startsWith(link("/live-auction")) ? "page" : undefined} className={ITEM}>
            <span className="relative">
              <Radio aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
              <span aria-hidden="true" className="kz-live-dot absolute! -end-0.5 -top-0.5 ring-2 ring-surface" />
            </span>
            {ui("live")}
          </Link>
        </li>
        <li>
          <button type="button" onClick={() => open("cart")} aria-expanded={panel === "cart"} className={ITEM}>
            <span className="relative">
              <ShoppingCart aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
              <CountBubble count={cartCount} />
            </span>
            {ui("cart")}
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => open(signedIn ? "account" : "signin")}
            aria-expanded={panel === "account"}
            className={cx(ITEM)}
          >
            <UserRound aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
            {ui("account")}
          </button>
        </li>
      </ul>
    </nav>
  );
}
