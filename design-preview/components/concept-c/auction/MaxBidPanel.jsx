"use client";

import { useId, useState } from "react";
import { ChevronDown, Gauge, TriangleAlert } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { RIYAL } from "@/lib/format";
import { COPY } from "../copy";
import { Button } from "../ui/Button";
import { cx } from "../ui/cx";

/** Maximum (proxy) bid: disclosure with its own input, or the active ceiling with Remove. */
export function MaxBidPanel({ auction }) {
  const { t, ui } = useLang();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  if (auction.myMax) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-primary/30 bg-primary/8 px-4 py-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Gauge aria-hidden="true" className="size-3.5" />
            {t(COPY.proxyActive)}
          </p>
          <p className="mt-0.5 text-sm text-fg">
            {ui("yourMaxBid")}: <Money value={auction.myMax} className="c-num font-semibold" />
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={auction.clearMaxBid}>
          {ui("clearMaxBid")}
        </Button>
      </div>
    );
  }

  const save = (event) => {
    event.preventDefault();
    const result = auction.setMaxBid(Number(value));
    if (result.ok) {
      setOpen(false);
      setValue("");
      setError(null);
    } else setError(result.error);
  };

  return (
    <div className="rounded-md border border-line">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls={`${id}-panel`} className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-sm font-semibold text-fg">
        <span className="flex items-center gap-2">
          <Gauge aria-hidden="true" className="size-4 text-primary" />
          {ui("setMaxBid")}
        </span>
        <ChevronDown aria-hidden="true" className={cx("size-4 text-fg-3 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <form id={`${id}-panel`} onSubmit={save} noValidate className="border-t border-line px-4 pb-4 pt-3">
          <p className="text-sm text-fg-2">{ui("maxBidExplain")}</p>
          <label htmlFor={`${id}-input`} className="sr-only">
            {ui("maxBid")}
          </label>
          <div className="mt-3 flex gap-2">
            <div dir="ltr" className="relative flex-1">
              <span aria-hidden="true" className="c-num pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-3">
                {RIYAL}
              </span>
              <input
                id={`${id}-input`}
                inputMode="numeric"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value.replace(/[^\d]/g, ""));
                  if (error) setError(null);
                }}
                placeholder={String(auction.minNext + auction.increment * 5)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className="c-input c-num ps-8 text-base font-semibold"
              />
            </div>
            <Button type="submit" variant="night">
              {ui("saveMaxBid")}
            </Button>
          </div>
          {error ? (
            <p id={`${id}-error`} role="alert" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-danger">
              <TriangleAlert aria-hidden="true" className="size-3.5" />
              {error}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
