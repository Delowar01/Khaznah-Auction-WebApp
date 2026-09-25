"use client";

import { Heart, ShoppingCart, UserRound } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { cx } from "../ui/cx";
import { AccountMenu } from "./AccountMenu";
import { CountBubble } from "./ChromeBits";
import { useChrome } from "./ChromeContext";

const ACTION = "relative h-11 shrink-0 items-center gap-2 rounded-control px-2.5 text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg";

/** End cluster of the main bar: account, watchlist, cart (desktop) / account + cart (mobile). */
export function HeaderActions() {
  const { ui, pl } = useLang();
  const { cartCount, watched } = useStore();
  const { open, signedIn } = useChrome();
  const cartLabel = `${ui("cart")} · ${pl("items", cartCount)}`;

  return (
    <div className="flex items-center gap-0.5 lg:gap-1">
      <div className="hidden lg:block">
        <AccountMenu />
      </div>
      <button
        type="button"
        onClick={() => open(signedIn ? "account" : "signin")}
        aria-label={ui("account")}
        className={cx(ACTION, "inline-flex px-2 lg:hidden")}
      >
        <UserRound aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={() => open("watchlist")}
        aria-label={`${ui("watchlist")} · ${pl("items", watched.size)}`}
        className={cx(ACTION, "hidden lg:inline-flex")}
      >
        <span className="relative">
          <Heart aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
          <CountBubble count={watched.size} tone="primary" />
        </span>
      </button>
      <button type="button" onClick={() => open("cart")} aria-label={cartLabel} className={cx(ACTION, "inline-flex px-2 lg:px-3")}>
        <span className="relative">
          <ShoppingCart aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />
          <CountBubble count={cartCount} />
        </span>
        <span className="hidden kb-sm font-bold text-fg xl:inline">{ui("cart")}</span>
      </button>
    </div>
  );
}
