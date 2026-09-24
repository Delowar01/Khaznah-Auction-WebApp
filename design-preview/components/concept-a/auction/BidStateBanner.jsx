"use client";

import { AlertTriangle, CheckCircle2, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/components/shared/providers/LangProvider";

const STATES = {
  highest: { key: "youAreWinning", icon: CheckCircle2, tone: "border-success/40 bg-success/10 text-success" },
  outbid: { key: "youAreOutbid", icon: AlertTriangle, tone: "border-live/40 bg-live/10 text-live" },
  won: { key: "youWon", icon: Trophy, tone: "border-accent/60 bg-accent/15 text-fg" },
};

/** Bidder-state message (highest · outbid · won), announced politely. */
export function BidStateBanner({ state }) {
  const { ui } = useLang();
  const config = STATES[state];
  return (
    <div aria-live="polite">
      <AnimatePresence initial={false} mode="wait">
        {config ? (
          <motion.p
            key={state}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex items-center gap-3 rounded-card border px-4 py-3 text-sm font-semibold ${config.tone}`}
          >
            <config.icon aria-hidden="true" className="size-[18px] shrink-0" />
            {ui(config.key)}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
