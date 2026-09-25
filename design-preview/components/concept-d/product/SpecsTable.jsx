"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { cx } from "../ui/cx";

/** Two-column specification list with zebra rows. */
export function SpecsTable({ specs, className = "" }) {
  const { t } = useLang();
  return (
    <dl className={cx("divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface", className)}>
      {specs.map((row) => (
        <div key={row.k.en} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-3 odd:bg-surface-2/50">
          <dt className="kb-sm text-fg-3">{t(row.k)}</dt>
          <dd className="kb-sm font-semibold text-fg">{t(row.v)}</dd>
        </div>
      ))}
    </dl>
  );
}
