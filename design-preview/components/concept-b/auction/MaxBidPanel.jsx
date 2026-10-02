"use client";

import { ChevronDown, CircleAlert, Repeat } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useMaxBid } from "@/components/shared/auction/hooks";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL } from "@/lib/format";
import { Button } from "../ui/Button";
import { FIELD_BOX } from "../ui/Field";
import { cx } from "../ui/cx";

/** Expandable proxy-bid setting: we bid for you, one increment at a time, up to your maximum. */
export function MaxBidPanel({ auction }) {
  const { ui } = useLang();
  const max = useMaxBid(auction);

  return (
    <div className="rounded-lg border border-line">
      <button
        type="button"
        aria-expanded={max.open}
        aria-controls={max.panelId}
        onClick={max.toggle}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start kb-sm font-semibold text-fg transition-colors hover:bg-surface-2"
      >
        <Repeat aria-hidden="true" className="size-4 text-primary" />
        <span className="flex-1">{ui("setMaxBid")}</span>
        {max.myMax ? <Money value={max.myMax} className="kb-xs font-bold text-primary" /> : null}
        <ChevronDown aria-hidden="true" className={cx("size-4 text-fg-3 transition-transform", max.open && "rotate-180")} />
      </button>
      <div id={max.panelId} hidden={!max.open} className="border-t border-line p-3">
        <p className="mb-3 kb-xs text-fg-2">{ui("maxBidExplain")}</p>
        {max.myMax ? (
          <div className="mb-3 flex items-center justify-between rounded-md bg-primary/10 px-3 py-2">
            <span className="kb-xs font-semibold text-primary">{ui("yourMaxBid")}</span>
            <span className="flex items-center gap-2">
              <Money value={max.myMax} className="kb-sm font-extrabold text-primary" />
              <button type="button" onClick={max.clear} className="rounded px-1.5 kb-xs font-bold text-fg-2 underline-offset-4 hover:text-danger hover:underline">
                {ui("clearMaxBid")}
              </button>
            </span>
          </div>
        ) : null}
        <label htmlFor={max.inputId} className="sr-only">
          {ui("maxBid")}
        </label>
        <div className="flex items-start gap-2">
          <div className={cx(FIELD_BOX, "h-9 min-w-0 flex-1", max.error ? "border-danger focus-within:border-danger focus-within:ring-danger/15" : "border-line-strong hover:border-fg-3")}>
            <span aria-hidden="true" className="ps-3 font-bold text-fg-2">
              {RIYAL}
            </span>
            <input {...max.inputProps} dir="ltr" className="kb-no-spin h-full min-w-0 flex-1 bg-transparent px-3 kb-md font-bold tabular text-fg outline-none placeholder:font-normal placeholder:text-fg-3" />
          </div>
          <Button variant="soft" size="sm" onClick={max.save} className="shrink-0">
            {ui("saveMaxBid")}
          </Button>
        </div>
        {max.error ? (
          <p id={max.errorId} role="alert" className="mt-1.5 flex items-center gap-1.5 kb-xs font-semibold text-danger">
            <CircleAlert aria-hidden="true" className="size-3.5 shrink-0" />
            {max.error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
