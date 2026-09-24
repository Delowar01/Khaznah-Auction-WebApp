"use client";

import { useId, useState } from "react";
import { ChevronDown, Repeat } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { Button } from "../ui/Button";
import { TextField } from "../ui/Field";
import { cx } from "../ui/cx";

/** Expandable proxy-bid setting: we bid for you up to your maximum. */
export function MaxBidPanel({ auction, disabled = false }) {
  const { ui } = useLang();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const save = () => {
    const result = auction.setMaxBid(Number(value));
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setValue("");
  };

  return (
    <div className="rounded-lg border border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-start kb-sm font-semibold text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Repeat aria-hidden="true" className="size-4 text-primary" />
        <span className="flex-1">{ui("setMaxBid")}</span>
        {auction.myMax ? <Money value={auction.myMax} className="kb-xs font-bold text-primary" /> : null}
        <ChevronDown aria-hidden="true" className={cx("size-4 text-fg-3 transition-transform", open && "rotate-180")} />
      </button>
      <div id={id} hidden={!open} className="border-t border-line p-3">
        <p className="mb-3 kb-xs text-fg-2">{ui("maxBidExplain")}</p>
        {auction.myMax ? (
          <div className="mb-3 flex items-center justify-between rounded-md bg-primary/10 px-3 py-2">
            <span className="kb-xs font-semibold text-primary">{ui("yourMaxBid")}</span>
            <span className="flex items-center gap-2">
              <Money value={auction.myMax} className="kb-sm font-extrabold text-primary" />
              <button type="button" onClick={auction.clearMaxBid} className="rounded px-1.5 kb-xs font-bold text-fg-2 underline-offset-4 hover:text-danger hover:underline">
                {ui("clearMaxBid")}
              </button>
            </span>
          </div>
        ) : null}
        <div className="flex items-start gap-2">
          <TextField
            label={ui("maxBid")}
            hideLabel
            money
            size="sm"
            type="number"
            inputMode="numeric"
            placeholder={String(auction.minNext + auction.increment * 5)}
            value={value}
            error={error}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") save();
            }}
            className="min-w-0 flex-1"
          />
          <Button variant="soft" size="sm" onClick={save} className="shrink-0">
            {ui("saveMaxBid")}
          </Button>
        </div>
      </div>
    </div>
  );
}
