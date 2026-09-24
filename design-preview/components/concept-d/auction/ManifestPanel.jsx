"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { isAuction } from "@/data/products";
import { ManifestBar } from "../ui/ManifestBar";
import { GradeChip } from "../ui/GradeChip";
import { useCopy } from "../lib/useCopy";

/** Pallet manifest: stacked units bar + line table (the chart's table view). */
export function ManifestPanel({ product }) {
  const { t, ui } = useLang();
  const c = useCopy();
  const lines = product.palletContents;
  const total = lines.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-medium text-fg">{ui("palletContents")}</h3>
        <p className="d-num text-sm text-fg-2">{c("manifestTotal", { n: total, lines: lines.length })}</p>
      </div>
      <p className="mt-1 text-[13px] text-fg-3">{isAuction(product) ? ui("winningBidTakesAll", { n: total }) : ui("fullLotOnly")}</p>
      <ManifestBar lines={lines} label={c("manifestChart")} legend={false} height="h-7" className="mt-4" />

      <div role="region" aria-label={ui("manifest")} tabIndex={0} className="d-scroll relative mt-5 overflow-x-auto rounded-xl border border-line outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]">
        <table className="w-full min-w-[520px] text-sm">
          <caption className="sr-only">{ui("manifest")}</caption>
          <thead>
            <tr className="d-label text-fg-3">
              <th scope="col" className="w-10 px-3 py-2.5 text-start font-medium">
                #
              </th>
              <th scope="col" className="px-3 py-2.5 text-start font-medium">
                {c("colItem")}
              </th>
              <th scope="col" className="px-3 py-2.5 text-start font-medium">
                {ui("grade")}
              </th>
              <th scope="col" className="px-3 py-2.5 text-end font-medium">
                {ui("units")}
              </th>
              <th scope="col" className="w-40 px-3 py-2.5 text-end font-medium">
                {c("share")}
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => {
              const share = line.qty / total;
              return (
                <tr key={line.key} className="border-t border-line">
                  <td className="d-num px-3 py-2.5 text-xs text-fg-3">{String(index + 1).padStart(2, "0")}</td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center gap-3">
                      <span className="d-plate relative size-10 shrink-0 overflow-hidden rounded-lg">
                        <Img image={line.image} alt="" sizes="48px" className="absolute inset-0 size-full object-contain p-1 mix-blend-multiply" />
                      </span>
                      <span className="text-fg">{t(line.name)}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <GradeChip grade={line.grade} size="sm" />
                  </td>
                  <td className="d-num px-3 py-2.5 text-end font-medium text-fg">{line.qty}</td>
                  <td className="px-3 py-2.5">
                    <span className="flex items-center justify-end gap-2">
                      <span aria-hidden="true" className="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--d-track)]">
                        <span className="block h-full rounded-full bg-[var(--d-chart)]" style={{ inlineSize: `${share * 100}%` }} />
                      </span>
                      <span className="d-num w-10 text-end text-xs text-fg-2">{Math.round(share * 100)}%</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
