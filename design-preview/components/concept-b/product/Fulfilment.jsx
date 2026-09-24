"use client";

import { RotateCcw, Truck, Warehouse } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { CITIES } from "@/data/sellers";
import { cx } from "../ui/cx";

/** Delivery · pickup · returns rows for a lot's seller. */
export function Fulfilment({ seller, className = "", detailed = false }) {
  const { t, ui } = useLang();
  const rows = [
    { key: "delivery", icon: Truck, title: ui("delivery"), text: ui("deliveryText") },
    {
      key: "pickup",
      icon: Warehouse,
      title: ui("pickup"),
      text: ui("pickupText", { city: t(CITIES[seller?.city]) }),
      extra: seller ? t(seller.pickup) : null,
    },
    { key: "returns", icon: RotateCcw, title: ui("returns"), text: ui("returnsText") },
  ];
  return (
    <ul className={cx("divide-y divide-line rounded-xl border border-line bg-surface", className)}>
      {rows.map((row) => (
        <li key={row.key} className={cx("flex gap-3 px-4", detailed ? "py-4" : "py-3")}>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-fg-2">
            <row.icon aria-hidden="true" className="size-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="kb-sm font-bold text-fg">{row.title}</p>
            <p className="kb-xs text-fg-2">{row.text}</p>
            {row.extra ? <p className="mt-0.5 kb-xs font-medium text-fg-3">{row.extra}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
