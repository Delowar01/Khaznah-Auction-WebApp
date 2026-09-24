"use client";

import { BadgeCheck, RotateCcw, ShieldCheck, Truck, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { CITIES, getSeller } from "@/data/sellers";
import { PAYMENT_METHODS } from "@/data/site";
import { useCopy } from "../lib/useCopy";

/** Delivery, pickup, returns and trust — compact list. */
export function DeliveryInfo({ product, className = "" }) {
  const { t, ui } = useLang();
  const c = useCopy();
  const seller = getSeller(product.seller);
  const rows = [
    { icon: Truck, title: ui("delivery"), text: ui("deliveryText") },
    { icon: Warehouse, title: ui("pickup"), text: ui("pickupText", { city: t(CITIES[seller.city]) }) },
    { icon: RotateCcw, title: ui("returns"), text: ui("returnsText") },
    { icon: BadgeCheck, title: ui("inspected"), text: c("inspectedLine") },
  ];
  return (
    <section aria-label={c("buyerProtection")} className={`d-panel ${className}`}>
      <ul>
        {rows.map((row) => (
          <li key={row.title} className="flex gap-3 border-b border-line p-4">
            <row.icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 d-ink" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-fg">{row.title}</p>
              <p className="mt-0.5 text-[13px] text-fg-2">{row.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2 p-4">
        <ShieldCheck aria-hidden="true" className="size-4 text-success" />
        <span className="text-sm font-medium text-fg">{ui("securePayment")}</span>
        <span className="ms-auto flex flex-wrap gap-1">
          {PAYMENT_METHODS.map((method) => (
            <span key={method} className="rounded-md border border-line-strong px-1.5 py-0.5 text-[10.5px] font-medium text-fg-2">
              {method}
            </span>
          ))}
        </span>
      </div>
    </section>
  );
}
