"use client";

import { Lock, Minus, Plus } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useCopy } from "../lib/useCopy";

const STEP_BTN = "grid size-11 place-items-center text-fg-2 transition-colors hover:bg-surface hover:text-fg disabled:cursor-not-allowed disabled:opacity-35";

/** Quantity stepper; locks to one lot when the pallet must be bought whole. */
export function QuantityControl({ product, qty, onChange }) {
  const { ui, t, pl } = useLang();
  const c = useCopy();
  const max = Math.max(1, product.stock);

  if (product.fullStockRequired) {
    return (
      <div className="d-panel-2 flex items-start gap-3 p-3.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 d-ink">
          <Lock aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-fg">
            {c("fullLot")} · <span className="d-num">{pl("units", product.quantity)}</span>
          </p>
          <p className="mt-0.5 text-[13px] text-fg-2">{ui("fullLotOnly")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p id="qty-label" className="text-sm font-medium text-fg">
          {ui("quantity")}
          {product.unitLabel ? <span className="font-normal text-fg-3"> · {c("cases")}</span> : null}
        </p>
        {product.unitLabel ? <p className="text-xs text-fg-3">{t(product.unitLabel)}</p> : null}
      </div>
      <div role="group" aria-labelledby="qty-label" className="flex items-center overflow-hidden rounded-control border border-line-strong bg-surface-2">
        <button type="button" onClick={() => onChange(Math.max(1, qty - 1))} disabled={qty <= 1 || product.stock <= 0} aria-label={ui("decrease")} className={STEP_BTN}>
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <output aria-live="polite" className="d-num grid h-11 min-w-12 place-items-center border-x border-line-strong px-2 text-[15px] font-medium text-fg">
          {product.stock <= 0 ? 0 : qty}
        </output>
        <button type="button" onClick={() => onChange(Math.min(max, qty + 1))} disabled={qty >= max || product.stock <= 0} aria-label={ui("increase")} className={STEP_BTN}>
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
