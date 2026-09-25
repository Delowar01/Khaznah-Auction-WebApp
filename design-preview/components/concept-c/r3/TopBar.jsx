"use client";

import Link from "next/link";
import { useCallback, useId, useRef, useState } from "react";
import { Bell, ChevronDown, Heart, ShoppingCart, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { DEMO_USER } from "@/data/site";
import { COPY } from "./copy";
import { LangLink } from "./Rail";
import { useHub } from "./state";
import { Count, IconButton, cx } from "./ui";

function Popover({ label, icon, children, align = "end", buttonClass = "", badge = null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cx("relative flex h-10 items-center gap-1.5 rounded-control px-2 text-fg transition-colors hover:bg-surface-2", buttonClass)}
      >
        {icon}
        <span className="sr-only">{label}</span>
        {badge}
      </button>
      {open ? (
        <div id={id} className={cx("absolute top-[calc(100%+8px)] z-50 w-[292px] rounded-[12px] border border-line bg-elevated p-2 shadow-overlay kz-fade-up", align === "end" ? "end-0" : "start-0")}>
          {children(close)}
        </div>
      ) : null}
    </div>
  );
}

/** Slim top bar: page title at the start; notifications, cart and account at the end. */
export function TopBar() {
  const { t } = useLang();
  const { link } = useConcept();
  const { cartCount, watched, toast } = useStore();
  const { open } = useHub();
  const first = t(DEMO_USER.name).split(" ")[0];

  return (
    <header className="sticky top-pbar z-30 border-b border-line bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur-md">
      <div className="hb-main flex h-[var(--hb-top-h)] items-center gap-3">
        <Link href={link("/")} className="shrink-0 rounded-md outline-offset-4 lg:hidden">
          <Logo variant="lockup" title={t(COPY.home)} className="h-7 w-auto" />
        </Link>
        <span aria-hidden="true" className="h-5 w-px bg-line-strong lg:hidden" />
        <p className="min-w-0 flex-1 truncate hb-h2 text-fg">
          {t(COPY.pageTitle)}
          <span className="ms-2 hidden hb-sm font-normal text-fg-3 md:inline">· {t(COPY.countersLabel)}</span>
        </p>

        <Popover
          label={t(COPY.notifications)}
          icon={<Bell aria-hidden="true" className="size-5" />}
        >
          {() => (
            <div className="p-2">
              <p className="hb-h2">{t(COPY.notifications)}</p>
              <p className="mt-1 hb-sm text-fg-2">{t(COPY.notificationsEmpty)}</p>
            </div>
          )}
        </Popover>

        <IconButton label={t(COPY.cartCount, { n: cartCount })} onClick={() => open("cart")} className="hidden lg:grid">
          <ShoppingCart aria-hidden="true" className="size-5" />
          <Count n={cartCount} />
        </IconButton>

        <Popover
          label={t(COPY.accountMenu)}
          buttonClass="-me-2 ps-1"
          icon={
            <>
              <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-primary hb-xs font-bold text-on-primary">
                {t(DEMO_USER.initials)}
              </span>
              <ChevronDown aria-hidden="true" className="hidden size-4 text-fg-3 sm:block" />
            </>
          }
        >
          {(close) => (
            <div>
              <div className="flex items-center gap-3 px-2 pb-3 pt-1.5">
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-primary hb-sm font-bold text-on-primary">
                  {t(DEMO_USER.initials)}
                </span>
                <div className="min-w-0">
                  <p className="truncate hb-md font-semibold">{t(COPY.hello, { name: first })}</p>
                  <p className="hb-xs text-fg-3">
                    {t(COPY.wallet)} · <Money value={DEMO_USER.walletBalance} className="font-semibold text-fg-2" />
                  </p>
                </div>
              </div>
              <ul className="grid border-t border-line pt-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      toast({ tone: "info", title: t(COPY.watchBids), description: t(COPY.myBidsText) });
                    }}
                    className="flex h-10 w-full items-center gap-2.5 rounded-[8px] px-2 text-start hb-sm hover:bg-surface-2"
                  >
                    <Heart aria-hidden="true" className="size-4 text-fg-3" />
                    <span className="flex-1">{t(COPY.watchBids)}</span>
                    <span className="hb-num hb-xs text-fg-3">{watched.size}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      toast({ tone: "neutral", title: t(COPY.ordersWallet), description: t(COPY.ordersText) });
                    }}
                    className="flex h-10 w-full items-center gap-2.5 rounded-[8px] px-2 text-start hb-sm hover:bg-surface-2"
                  >
                    <Wallet aria-hidden="true" className="size-4 text-fg-3" />
                    <span className="flex-1">{t(COPY.ordersWallet)}</span>
                  </button>
                </li>
              </ul>
              <p className="mt-1.5 flex items-center justify-between border-t border-line px-2 pt-2.5 hb-xs text-fg-3">
                {t(COPY.saudiArabia)}
                <LangLink onClick={close} className="font-semibold text-primary hover:underline" />
              </p>
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
}
