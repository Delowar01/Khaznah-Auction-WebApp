"use client";

import { Gavel } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";

/** Sticky one-tap bid bar for small screens. */
export function LiveMobileBar({ live }) {
  const { ui, money } = useLang();
  const { current, minNext, placeBid, intermission, remaining, phase } = live;
  const hot = phase === "going_twice" || phase === "closing";
  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-bg/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="c-label">{intermission > 0 ? ui("nextLotIn", { n: intermission }) : ui("currentBid")}</p>
          <div className="flex items-baseline gap-2.5">
            <Money value={current?.currentBid ?? 0} className="c-num text-xl font-semibold text-fg" />
            {intermission > 0 ? null : (
              <span className={cx("c-num text-sm font-semibold", hot ? "text-live" : "text-fg-2")}>
                <span dir="ltr">00:{String(Math.max(0, remaining)).padStart(2, "0")}</span>
              </span>
            )}
          </div>
        </div>
        <Button icon={Gavel} onClick={() => placeBid(minNext)} disabled={intermission > 0}>
          {ui("bidAmount", { amount: money(minNext) })}
        </Button>
      </div>
    </div>
  );
}
