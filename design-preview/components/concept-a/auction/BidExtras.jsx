"use client";

import { useId, useState } from "react";
import { ChevronDown, ShieldCheck, Timer, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { marketSaving } from "@/lib/catalog";
import { RIYAL } from "@/lib/format";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

/** Proxy (maximum) bid: disclosure with input, save and remove. */
export function MaxBid({ a }) {
  const { ui } = useLang();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const inputId = useId();
  const panelId = useId();

  if (a.myMax) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-card border border-line bg-surface-2 px-4 py-3">
        <div>
          <p className="text-[12px] text-fg-3">{ui("yourMaxBid")}</p>
          <p className="a-serif text-[22px] leading-tight text-fg">
            <Money value={a.myMax} />
          </p>
        </div>
        <button type="button" onClick={a.clearMaxBid} className="inline-flex h-11 items-center gap-1.5 text-sm font-medium text-fg">
          <X aria-hidden="true" className="size-4" />
          <span className="a-underline-hover">{ui("clearMaxBid")}</span>
        </button>
      </div>
    );
  }

  const save = (event) => {
    event.preventDefault();
    const result = a.setMaxBid(Number(draft));
    if (!result.ok) return setError(result.error);
    setError("");
    setDraft("");
    setOpen(false);
  };

  return (
    <div className="border-t border-line pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex h-11 w-full items-center justify-between text-sm font-semibold text-fg"
      >
        {ui("setMaxBid")}
        <ChevronDown aria-hidden="true" className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={panelId} hidden={!open}>
        <p className="text-[13px] leading-relaxed text-fg-2 rtl:text-sm rtl:leading-6">{ui("maxBidExplain")}</p>
        <form onSubmit={save} noValidate className="mt-3 flex gap-2">
          <label htmlFor={inputId} className="sr-only">
            {ui("maxBid")}
          </label>
          <div
            dir="ltr"
            className={`flex h-11 min-w-0 flex-1 items-center rounded-control border bg-surface ${error ? "border-danger ring-1 ring-danger" : "border-line-strong focus-within:border-fg"}`}
          >
            <span aria-hidden="true" className="ps-3 text-fg-3">
              {RIYAL}
            </span>
            <input
              id={inputId}
              inputMode="numeric"
              autoComplete="off"
              placeholder={String(a.minNext + a.increment * 4)}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value.replace(/[^\d]/g, "").slice(0, 7));
                setError("");
              }}
              aria-invalid={error ? true : undefined}
              className="h-full w-full min-w-0 bg-transparent px-2 font-semibold tabular text-fg outline-none placeholder:font-normal placeholder:text-fg-3"
            />
          </div>
          <Button type="submit" variant="outline" className="shrink-0">
            {ui("saveMaxBid")}
          </Button>
        </form>
        {error ? (
          <p role="alert" className="mt-2 text-[13px] font-medium text-danger">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** "Or buy it now" box for lots sold as auction + Buy Now. */
export function BuyNowBox({ product, onBuy }) {
  const { ui, money } = useLang();
  return (
    <div className="rounded-card border border-line bg-surface-2 p-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="a-eyebrow !text-fg">{ui("orBuyNow")}</p>
        <p className="a-serif text-[28px] leading-none text-fg">
          <Money value={product.buyNowPrice} symbolClassName="text-[0.8em]" />
        </p>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-fg-2 rtl:text-sm">{ui("buyNowClosesAuction")}</p>
      <Button variant="outline" className="mt-4 w-full" onClick={onBuy}>
        {ui("buyNowFor", { amount: money(product.buyNowPrice) })}
      </Button>
    </div>
  );
}

/** Current bid against the typical market price. */
export function MarketMeter({ product, currentBid }) {
  const { t, ui } = useLang();
  if (!product.marketPrice) return null;
  const pct = marketSaving(product, currentBid);
  const ratio = Math.min(1, currentBid / product.marketPrice);
  return (
    <div>
      <p className="a-eyebrow">{t(COPY.marketCompare)}</p>
      <div className="mt-3 flex items-baseline justify-between gap-3 text-[13px]">
        <span className="text-fg-2">{ui("marketPrice")}</span>
        <Money value={product.marketPrice} className="font-semibold text-fg" />
      </div>
      <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <span className="absolute inset-y-0 start-0 rounded-full bg-accent transition-[width] duration-700" style={{ width: `${ratio * 100}%` }} />
      </div>
      {pct > 0 ? <p className="mt-2 text-[13px] font-medium text-success">{ui("belowMarket", { pct })}</p> : null}
    </div>
  );
}

/** Deposit status and the anti-sniping rule. */
export function BidAssurances({ a }) {
  const { t, ui, money } = useLang();
  return (
    <ul className="space-y-4 text-[13px] leading-relaxed rtl:text-sm rtl:leading-6">
      <li className="flex gap-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-success" strokeWidth={1.75} />
        <div>
          <p className="font-semibold text-fg">{ui(a.deposit.covered ? "depositCovered" : "depositRequired")}</p>
          <p className="text-fg-2">
            {t(COPY.depositHeld, { amount: money(a.deposit.required) })} {t(COPY.walletLine)}: <Money value={a.deposit.walletBalance} />
          </p>
        </div>
      </li>
      <li className="flex gap-3">
        <Timer aria-hidden="true" className="mt-0.5 size-[18px] shrink-0 text-fg-2" strokeWidth={1.75} />
        <p className="text-fg-2">{ui("antiSnipe")}</p>
      </li>
    </ul>
  );
}
