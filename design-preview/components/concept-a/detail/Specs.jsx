"use client";

import { useLang } from "@/components/shared/providers/LangProvider";

/** Specification list as a two-column catalogue table with hairlines. */
export function Specs({ specs, extra = [] }) {
  const { t } = useLang();
  const rows = [...extra, ...(specs || []).map((row) => ({ k: t(row.k), v: t(row.v) }))];
  return (
    <dl className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
      {rows.map((row) => (
        <div key={row.k} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-line py-3.5 text-[14px] rtl:text-[15px]">
          <dt className="text-fg-3">{row.k}</dt>
          <dd className="font-medium text-fg">{row.v}</dd>
        </div>
      ))}
    </dl>
  );
}
