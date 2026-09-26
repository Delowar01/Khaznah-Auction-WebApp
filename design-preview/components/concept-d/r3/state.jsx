"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { COPY } from "./copy";

// Option 4 state: the open layer (menu, search, My bids, cart), the bid
// awaiting confirmation, the preview's own bids (placed from tickets on this
// page — no simulated rivals, so nothing is invented about being outbid) and
// live-event reminders (a concept idea).
const FloorContext = createContext(null);

export function FloorProvider({ children }) {
  const { t, ui, money } = useLang();
  const { toast } = useStore();
  const [layer, setLayer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [bids, setBids] = useState({});
  const [reminders, setReminders] = useState(() => new Set());

  const open = useCallback((name) => setLayer(name), []);
  const close = useCallback(() => setLayer(null), []);
  const askBid = useCallback((slug, amount) => setConfirm({ slug, amount }), []);
  const cancelBid = useCallback(() => setConfirm(null), []);

  const placeBid = useCallback(
    (slug, amount) => {
      setBids((current) => ({ ...current, [slug]: { amount, count: (current[slug]?.count || 0) + 1 } }));
      setConfirm(null);
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
    () => ({ layer, open, close, confirm, askBid, cancelBid, bids, placeBid, reminders, toggleReminder }),
    [layer, open, close, confirm, askBid, cancelBid, bids, placeBid, reminders, toggleReminder],
  );
  return <FloorContext.Provider value={value}>{children}</FloorContext.Provider>;
}

export function useFloor() {
  const context = useContext(FloorContext);
  if (!context) throw new Error("useFloor must be used inside <FloorProvider>");
  return context;
}

/** A lot's figures in this preview, including bids placed from its ticket. */
export function useFloorLot(product) {
  const { bids } = useFloor();
  const mine = bids[product.slug];
  const currentBid = mine ? mine.amount : product.currentBid;
  const bidCount = (product.bidCount || 0) + (mine?.count || 0);
  const minNext = bidCount > 0 ? currentBid + product.increment : product.startingBid;
  return { currentBid, bidCount, minNext, winning: Boolean(mine) };
}
