"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { COPY } from "./copy";

// Option 3 state: which layer is open (menu, cart, search sheet, expanded
// rail), the quick-view lot, the preview's own bids placed from quick view,
// the search scope, event reminders (a concept idea) and whether the home
// search deck is on screen (the rail docks a search field when it is not).
const HubContext = createContext(null);

export function HubProvider({ children }) {
  const { t, ui, money } = useLang();
  const { toast } = useStore();
  const [layer, setLayer] = useState(null);
  const [quick, setQuick] = useState(null);
  const [lastQuick, setLastQuick] = useState(null); // keeps the panel filled while it animates out
  const [bids, setBids] = useState({});
  const [scope, setScope] = useState("all");
  const [reminders, setReminders] = useState(() => new Set());
  const [deckVisible, setDeckVisible] = useState(true);

  const open = useCallback((name) => setLayer(name), []);
  const close = useCallback(() => setLayer(null), []);
  const openQuick = useCallback((slug) => {
    setQuick(slug);
    setLastQuick(slug);
  }, []);
  const closeQuick = useCallback(() => setQuick(null), []);

  const placeBid = useCallback(
    (slug, amount) => {
      setBids((current) => ({ ...current, [slug]: { amount, count: (current[slug]?.count || 0) + 1 } }));
      toast({ tone: "success", title: ui("bidPlaced"), description: money(amount) });
    },
    [money, toast, ui],
  );

  const toggleReminder = useCallback(
    (event) => {
      const on = !reminders.has(event.slug);
      setReminders((current) => {
        const next = new Set(current);
        if (on) next.add(event.slug);
        else next.delete(event.slug);
        return next;
      });
      if (on) toast({ tone: "info", title: t(COPY.reminderToast), description: t(event.title) });
    },
    [reminders, t, toast],
  );

  const value = useMemo(
    () => ({ layer, open, close, quick, lastQuick, openQuick, closeQuick, bids, placeBid, scope, setScope, reminders, toggleReminder, deckVisible, setDeckVisible }),
    [layer, open, close, quick, lastQuick, openQuick, closeQuick, bids, placeBid, scope, reminders, toggleReminder, deckVisible],
  );
  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}

export function useHub() {
  const context = useContext(HubContext);
  if (!context) throw new Error("useHub must be used inside <HubProvider>");
  return context;
}

/** A lot's live figures in this preview, including bids placed from quick view. */
export function useHubLot(product) {
  const { bids } = useHub();
  const mine = bids[product.slug];
  const currentBid = mine ? mine.amount : product.currentBid;
  const bidCount = (product.bidCount || 0) + (mine?.count || 0);
  const minNext = bidCount > 0 ? currentBid + product.increment : product.startingBid;
  return { currentBid, bidCount, minNext, leading: Boolean(mine) };
}
