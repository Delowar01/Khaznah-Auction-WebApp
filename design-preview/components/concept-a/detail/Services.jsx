"use client";

import { RotateCcw, ShieldCheck, Truck, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { CITIES } from "@/data/sellers";
import { PAYMENT_METHODS } from "@/data/site";

/** Delivery, pickup, returns and payment rows shared by lot pages. */
export function Services({ seller, showPayment = true }) {
  const { t, ui } = useLang();
  const rows = [
    { icon: Truck, title: ui("delivery"), text: ui("deliveryText") },
    { icon: Warehouse, title: ui("pickup"), text: ui("pickupText", { city: t(CITIES[seller.city]) }) },
    { icon: RotateCcw, title: ui("returns"), text: ui("returnsText") },
  ];
  return (
    <div>
      <ul className="divide-y divide-line border-y border-line">
        {rows.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 py-4">
            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-fg-2" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-semibold text-fg">{title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-fg-2 rtl:text-sm rtl:leading-6">{text}</p>
            </div>
          </li>
        ))}
      </ul>
      {showPayment ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-fg-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-fg-2">
            <ShieldCheck aria-hidden="true" className="size-4" />
            {ui("securePayment")}
          </span>
          {PAYMENT_METHODS.map((method) => (
            <span key={method} dir="ltr" className="rounded-xs border border-line px-2 py-1 font-semibold tracking-wide text-fg-2">
              {method}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
