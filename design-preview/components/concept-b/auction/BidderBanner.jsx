"use client";

import { CircleAlert, CircleCheck, Info, Trophy } from "lucide-react";
import { useBidderStatus } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { cx } from "../ui/cx";

const STYLES = {
  highest: { box: "bg-success/10 text-success ring-success/25", icon: CircleCheck },
  outbid: { box: "bg-warning/10 text-warning ring-warning/25", icon: CircleAlert },
  won: { box: "bg-success/10 text-success ring-success/25", icon: Trophy },
  lost: { box: "bg-danger/10 text-danger ring-danger/25", icon: CircleAlert },
  closed: { box: "bg-surface-2 text-fg ring-line", icon: Info },
  bought: { box: "bg-success/10 text-success ring-success/25", icon: Trophy },
};

/**
 * Bidder-state message: highest / outbid while live, won / lost / sold when
 * the auction closes. A polite live region announces each change. With
 * `announce` off (the phone sheet, over a page that already announces) the
 * message is plain text instead.
 */
export function BidderBanner({ detail, announce = true }) {
  const status = useBidderStatus(detail);
  const style = status.kind ? STYLES[status.kind] : null;
  return (
    <>
      {announce ? (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {status.spoken}
        </p>
      ) : null}
      {style ? (
        <div aria-hidden={announce ? "true" : undefined} className={cx("kz-fade-up flex items-start gap-2.5 rounded-lg px-3 py-2.5 ring-1 ring-inset", style.box)}>
          <style.icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <div className="min-w-0 kb-sm">
            <p className="font-bold">{status.title}</p>
            {status.label ? (
              <p className="flex flex-wrap items-baseline gap-1 text-fg-2">
                {status.label}
                <Money value={status.amount} className="font-extrabold text-fg" />
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
