"use client";

import { ShieldCheck, Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Money } from "@/components/shared/ui/Money";
import { AUCTION_POLICY, DEMO_USER } from "@/data/site";
import { Popover } from "../ui/Popover";
import { Button } from "../ui/Button";
import { useCopy } from "../lib/useCopy";

/** Wallet chip with balance (mono) and a small balance panel. */
export function WalletMenu({ className = "" }) {
  const { ui, money } = useLang();
  const { toast } = useStore();
  const c = useCopy();
  const balance = DEMO_USER.walletBalance;
  const ready = balance >= AUCTION_POLICY.depositAmount;

  return (
    <Popover
      className={className}
      panelClassName="w-[300px] p-4"
      button={(props) => (
        <button
          type="button"
          {...props}
          aria-label={c("walletMenu", { amount: money(balance) })}
          className="flex h-9 items-center gap-2 rounded-full border border-line-strong bg-surface-2/70 ps-2.5 pe-3 text-[13px] text-fg transition-colors hover:bg-surface-2"
        >
          <Wallet aria-hidden="true" className="size-4 text-fg-2" />
          <Money value={balance} className="d-num font-medium" />
        </button>
      )}
    >
      {({ close }) => (
        <div>
          <p className="d-label text-fg-3">{ui("walletBalance")}</p>
          <p className="mt-1 text-3xl font-medium text-fg">
            <Money value={balance} className="d-num" />
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="d-panel-2 p-3">
              <p className="text-xs text-fg-3">{c("depositLabel")}</p>
              <Money value={AUCTION_POLICY.depositAmount} className="d-num mt-1 text-sm font-medium text-fg" />
            </div>
            <div className="d-panel-2 p-3">
              <p className="text-xs text-fg-3">{c("biddingStatus")}</p>
              <p className="mt-1 text-sm font-medium text-fg">{c(ready ? "readyToBid" : "topUpToBid")}</p>
            </div>
          </div>
          <p className="mt-3 flex gap-2 text-xs text-fg-2">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-success" />
            {c("walletNote")}
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4 w-full"
            onClick={() => {
              close();
              toast({ tone: "info", title: c("topUp"), description: c("topUpToast") });
            }}
          >
            {c("topUp")}
          </Button>
        </div>
      )}
    </Popover>
  );
}
