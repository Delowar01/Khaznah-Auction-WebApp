"use client";

import { BadgeCheck, CreditCard, ShieldCheck, Truck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { TRUST_POINTS } from "@/data/site";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

export const TRUST_ICONS = { graded: BadgeCheck, deposit: ShieldCheck, payments: CreditCard, delivery: Truck };

/** Four trust points in one compact row under the hero. */
export function TrustStrip({ className = "" }) {
  const { t } = useLang();
  return (
    <ul aria-label={t(COPY.trustNotes)} className={cx("grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4", className)}>
      {TRUST_POINTS.map((point) => {
        const Icon = TRUST_ICONS[point.key];
        return (
          <li key={point.key} className="flex items-start gap-3 bg-surface p-3 sm:p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary sm:size-10">
              <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="kb-sm font-bold text-fg">{t(point.title)}</p>
              <p className="mt-0.5 hidden kb-xs text-fg-2 sm:block">{t(point.text)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
