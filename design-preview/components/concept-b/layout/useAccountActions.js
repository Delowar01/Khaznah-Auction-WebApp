"use client";

import { Gavel, Heart, LogOut, Package, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { DEMO_USER } from "@/data/site";
import { COPY } from "../copy";
import { useChrome } from "./ChromeContext";

/** First name of the signed-in customer ("Faisal" / "فيصل"). */
export function useFirstName() {
  const { t } = useLang();
  return t(DEMO_USER.name).split(" ")[0];
}

/** Account menu entries shared by the desktop dropdown and the mobile sheet. */
export function useAccountActions() {
  const { t, ui, money } = useLang();
  const { toast, watched } = useStore();
  const chrome = useChrome();

  return [
    {
      key: "bids",
      icon: Gavel,
      label: ui("myBids"),
      onSelect: () => toast({ tone: "info", title: ui("myBids"), description: t(COPY.myBidsText) }),
    },
    {
      key: "orders",
      icon: Package,
      label: ui("orders"),
      onSelect: () => toast({ tone: "neutral", title: ui("orders"), description: t(COPY.ordersText) }),
    },
    {
      key: "watchlist",
      icon: Heart,
      label: ui("watchlist"),
      count: watched.size,
      onSelect: () => chrome.open("watchlist"),
    },
    {
      key: "wallet",
      icon: Wallet,
      label: ui("walletBalance"),
      money: DEMO_USER.walletBalance,
      onSelect: () =>
        toast({ tone: "info", title: ui("walletBalance"), description: `${money(DEMO_USER.walletBalance)} · ${ui("depositCovered")}` }),
    },
    {
      key: "signout",
      icon: LogOut,
      label: t(COPY.signOut),
      divider: true,
      onSelect: () => {
        chrome.setSignedIn(false);
        chrome.close();
        toast({ tone: "neutral", title: t(COPY.signedOut), description: t(COPY.signedOutText) });
      },
    },
  ];
}
