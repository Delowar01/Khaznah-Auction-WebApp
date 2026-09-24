"use client";

import { useRef, useState } from "react";
import { BadgeCheck, Bookmark, Gavel, LogOut, Receipt, ShieldCheck, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useDismiss } from "@/components/shared/ui/hooks";
import { Money } from "@/components/shared/ui/Money";
import { DEMO_USER } from "@/data/site";
import { COPY } from "../copy";
import { cx } from "../ui/cx";

/** Signed-in customer summary: wallet, deposit status and account shortcuts. */
export function AccountSummary({ onWatchlist, onItem, className = "" }) {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const soon = (title) => () => {
    toast({ tone: "info", title, description: t(COPY.pageSoon) });
    onItem?.();
  };
  const items = [
    { key: "bids", icon: Gavel, label: ui("myBids"), onClick: soon(ui("myBids")) },
    { key: "orders", icon: Receipt, label: ui("orders"), onClick: soon(ui("orders")) },
    { key: "watch", icon: Bookmark, label: ui("watchlist"), onClick: onWatchlist },
    { key: "out", icon: LogOut, label: t(COPY.signOut), onClick: soon(t(COPY.signOut)) },
  ];
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-control bg-secondary font-semibold text-on-secondary">{t(DEMO_USER.initials)}</span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-fg">{t(DEMO_USER.name)}</p>
          <p className="flex items-center gap-1 text-xs text-success">
            <BadgeCheck aria-hidden="true" className="size-3.5" />
            {t(COPY.verifiedAccount)}
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-md border border-line bg-surface-2 p-3.5">
        <p className="flex items-center gap-2 text-xs text-fg-3">
          <Wallet aria-hidden="true" className="size-3.5" />
          {ui("walletBalance")}
        </p>
        <Money value={DEMO_USER.walletBalance} className="c-num mt-1 text-2xl font-semibold text-fg" />
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-success">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          {ui("depositCovered")}
        </p>
      </div>
      <ul className="mt-2">
        {items.map(({ key, icon: Icon, label, onClick }) => (
          <li key={key}>
            <button type="button" onClick={onClick} className="flex min-h-11 w-full items-center gap-3 rounded-sm px-2 text-start text-[0.9375rem] text-fg-2 hover:bg-surface-2 hover:text-fg">
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Wallet chip in the header that opens the account popover. */
export function AccountMenu({ onWatchlist }) {
  const { ui } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, () => setOpen(false), ref);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={ui("account")}
        className={cx("flex h-11 items-center gap-2 rounded-control border px-3 transition-colors", open ? "border-fg bg-surface" : "border-line-strong hover:border-fg")}
      >
        <Wallet aria-hidden="true" className="size-4 text-fg-2" />
        <Money value={DEMO_USER.walletBalance} className="c-num text-sm font-semibold text-fg" />
      </button>
      {open ? (
        <div role="dialog" aria-label={ui("account")} className="kz-fade-up absolute end-0 top-[calc(100%+10px)] z-50 w-72 rounded-lg border border-line bg-elevated p-4 shadow-overlay">
          <AccountSummary
            onItem={() => setOpen(false)}
            onWatchlist={() => {
              setOpen(false);
              onWatchlist?.();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
