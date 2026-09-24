"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CircleCheck, Trophy } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Button } from "../ui/Button";
import { useCopy } from "../lib/useCopy";

const TONES = {
  highest: { cls: "d-winning bg-accent/10", icon: CircleCheck, iconCls: "text-auction" },
  won: { cls: "d-winning bg-accent/12", icon: Trophy, iconCls: "text-auction" },
  outbid: { cls: "bg-live/10 ring-1 ring-inset ring-live/40", icon: AlertTriangle, iconCls: "text-live" },
  lost: { cls: "bg-surface-2 ring-1 ring-inset ring-line", icon: AlertTriangle, iconCls: "text-fg-3" },
};

/** Your position on this lot: highest (gold edge) · outbid (red) · won · lost. */
export function BidderBanner({ state }) {
  const { ui } = useLang();
  const { toast } = useStore();
  const c = useCopy();
  const tone = TONES[state];
  const copy = {
    highest: [ui("youAreWinning"), c("highestText")],
    won: [ui("youWon"), c("wonText")],
    outbid: [ui("youAreOutbid"), c("outbidText")],
    lost: [ui("auctionEnded"), c("lostText")],
  }[state];

  return (
    <AnimatePresence initial={false} mode="wait">
      {tone ? (
        <motion.div
          key={state}
          role="status"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className={`flex gap-3 rounded-xl p-3.5 ${tone.cls}`}
        >
          <tone.icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${tone.iconCls}`} />
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-semibold ${state === "outbid" ? "text-live" : state === "lost" ? "text-fg" : "text-auction"}`}>{copy[0]}</p>
            <p className="mt-0.5 text-[13px] text-fg-2">{copy[1]}</p>
            {state === "won" ? (
              <Button variant="gold" size="sm" className="mt-3" onClick={() => toast({ tone: "info", title: ui("checkout"), description: c("checkoutToast") })}>
                {c("payNow")}
              </Button>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
