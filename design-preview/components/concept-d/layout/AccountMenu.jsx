"use client";

import { Bell, Bookmark, ChevronDown, Gavel, LogOut, Package } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { DEMO_USER } from "@/data/site";
import { Popover } from "../ui/Popover";
import { useCopy } from "../lib/useCopy";

export function UserInitials({ className = "" }) {
  const { t } = useLang();
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-full bg-primary/20 font-semibold d-ink ring-1 ring-inset ring-primary/40 ${className}`}>
      {t(DEMO_USER.initials)}
    </span>
  );
}

/** Account items respond with short, informative toasts in the preview. */
export function useAccountItems() {
  const { ui } = useLang();
  const { toast, watched } = useStore();
  const c = useCopy();
  return [
    { key: "bids", icon: Gavel, label: ui("myBids"), run: () => toast({ tone: "info", title: ui("myBids"), description: c("myBidsToast") }) },
    { key: "watch", icon: Bookmark, label: ui("watchlist"), count: watched.size, run: () => toast({ tone: "info", title: ui("watchlist"), description: c("watchlistToast", { n: watched.size }) }) },
    { key: "orders", icon: Package, label: ui("orders"), run: () => toast({ tone: "info", title: ui("orders"), description: c("ordersToast") }) },
    { key: "alerts", icon: Bell, label: ui("notifications"), run: () => toast({ tone: "info", title: ui("notifications"), description: c("notificationsToast") }) },
  ];
}

export function AccountMenu({ className = "" }) {
  const { t } = useLang();
  const { toast } = useStore();
  const c = useCopy();
  const items = useAccountItems();

  return (
    <Popover
      className={className}
      panelClassName="w-[260px] p-1.5"
      button={(props) => (
        <button type="button" {...props} aria-label={c("accountMenu")} className="flex h-10 items-center gap-1 rounded-full p-0.5 pe-1.5 transition-colors hover:bg-surface-2">
          <UserInitials className="size-8 text-xs" />
          <ChevronDown aria-hidden="true" className="size-3.5 text-fg-3" />
        </button>
      )}
    >
      {({ close }) => (
        <div>
          <div className="flex items-center gap-3 px-2.5 pb-3 pt-2">
            <UserInitials className="size-10 text-sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">{t(DEMO_USER.name)}</p>
              <p className="text-xs text-fg-3">{c("buyerAccount")}</p>
            </div>
          </div>
          <div className="d-hairline mb-1" />
          <ul>
            {items.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    item.run();
                  }}
                  className="flex h-10 w-full items-center gap-3 rounded-lg px-2.5 text-sm text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <item.icon aria-hidden="true" className="size-4" />
                  <span className="flex-1 text-start">{item.label}</span>
                  {item.count ? <span className="d-num text-xs text-fg-3">{item.count}</span> : null}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  close();
                  toast({ tone: "neutral", title: c("signOut"), description: c("signedOutToast") });
                }}
                className="flex h-10 w-full items-center gap-3 rounded-lg px-2.5 text-sm text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <LogOut aria-hidden="true" className="flip-rtl size-4" />
                <span className="flex-1 text-start">{c("signOut")}</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </Popover>
  );
}
