"use client";

import { useCallback, useRef, useState } from "react";
import { BadgeCheck, ChevronDown, UserRound } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { useDismiss } from "@/components/shared/ui/hooks";
import { DEMO_USER } from "@/data/site";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { useChrome } from "./ChromeContext";
import { useAccountActions, useFirstName } from "./useAccountActions";

/** Signed-in identity block used at the top of account menus. */
export function AccountSummary({ className = "" }) {
  const { t, ui } = useLang();
  return (
    <div className={cx("flex items-center gap-3", className)}>
      <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-primary kb-md font-extrabold text-on-primary">
        {t(DEMO_USER.initials)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate kb-md font-bold text-fg">{t(DEMO_USER.name)}</p>
        <p className="flex items-center gap-1 kb-xs font-semibold text-success">
          <BadgeCheck aria-hidden="true" className="size-3.5" />
          {t(COPY.verifiedBuyer)}
        </p>
      </div>
      <div className="text-end">
        <p className="kb-2xs text-fg-3">{ui("wallet")}</p>
        <Money value={DEMO_USER.walletBalance} className="kb-sm font-extrabold text-fg" />
      </div>
    </div>
  );
}

/** Desktop "Hello, Faisal / My account ▾" button with its dropdown menu. */
export function AccountMenu() {
  const { t, ui } = useLang();
  const { signedIn, open: openPanel } = useChrome();
  const firstName = useFirstName();
  const actions = useAccountActions();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  const focusItem = (index) => {
    const items = ref.current?.querySelectorAll('[role="menuitem"]');
    if (!items?.length) return;
    items[(index + items.length) % items.length].focus();
  };

  const onMenuKey = (event) => {
    const items = [...(ref.current?.querySelectorAll('[role="menuitem"]') || [])];
    const current = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(current + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(current - 1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  if (!signedIn) {
    return (
      <button
        type="button"
        onClick={() => openPanel("signin")}
        className="flex h-11 items-center gap-2 rounded-control px-2 text-start transition-colors hover:bg-surface-2"
      >
        <UserRound aria-hidden="true" className="size-5 text-fg-2" />
        <span className="flex flex-col leading-tight">
          <span className="kb-2xs text-fg-3">{t(COPY.helloGuest)}</span>
          <span className="kb-sm font-bold text-fg">{ui("signIn")}</span>
        </span>
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => !v);
          window.requestAnimationFrame(() => focusItem(0));
        }}
        className="flex h-11 items-center gap-2 rounded-control px-1.5 text-start transition-colors hover:bg-surface-2"
      >
        <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-primary/10 kb-xs font-extrabold text-primary">
          {t(DEMO_USER.initials)}
        </span>
        <span className="hidden flex-col leading-tight xl:flex">
          <span className="kb-2xs text-fg-3">{t(COPY.hello, { name: firstName })}</span>
          <span className="kb-sm font-bold text-fg">{ui("account")}</span>
        </span>
        <span className="sr-only xl:hidden">{ui("account")}</span>
        <ChevronDown aria-hidden="true" className={cx("size-4 text-fg-3 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="kb-focus-reset kz-fade-up absolute end-0 top-[calc(100%+8px)] z-[60] w-80 rounded-xl border border-line bg-elevated p-2 shadow-overlay">
          <AccountSummary className="border-b border-line p-2 pb-3" />
          <div role="menu" aria-label={ui("account")} onKeyDown={onMenuKey} className="pt-1.5">
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  setOpen(false);
                  action.onSelect();
                }}
                className={cx(
                  "flex h-10 w-full items-center gap-3 rounded-lg px-2.5 text-start kb-sm font-medium text-fg outline-none transition-colors hover:bg-surface-2 focus-visible:bg-surface-2",
                  action.divider && "mt-1 border-t border-line pt-1",
                )}
              >
                <action.icon aria-hidden="true" className="size-4 text-fg-3" />
                <span className="flex-1">{action.label}</span>
                {action.count ? <span className="rounded-full bg-surface-2 px-2 kb-2xs font-bold text-fg-2 tabular">{action.count}</span> : null}
                {action.money != null ? <Money value={action.money} className="kb-xs font-bold text-fg-2" /> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
