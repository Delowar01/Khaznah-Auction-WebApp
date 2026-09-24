"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { GradeChip } from "../ui/GradeChip";
import { COPY } from "../copy";

/** Pallet manifest: each product line with quantity, grade and share of the lot. */
export function Manifest({ lines, note }) {
  const { t, ui, pl } = useLang();
  const total = lines.reduce((sum, line) => sum + line.qty, 0);
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm text-fg-2">
          {lines.length} {ui("lines")} · {pl("units", total)}
        </p>
        <p className="text-sm font-medium text-fg">{note ?? ui("winningBidTakesAll", { n: total })}</p>
      </div>
      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        {lines.map((line, i) => (
          <span key={line.key} className={i % 2 ? "bg-accent" : "bg-primary"} style={{ width: `${(line.qty / total) * 100}%`, opacity: 1 - i * 0.1 }} />
        ))}
      </div>
      <table className="mt-6 w-full border-collapse text-start text-[14px] rtl:text-[15px]">
        <caption className="sr-only">{ui("palletContents")}</caption>
        <thead>
          <tr className="border-b border-line text-start">
            <th scope="col" className="a-eyebrow py-3 text-start !text-fg-3">{ui("description")}</th>
            <th scope="col" className="a-eyebrow hidden py-3 text-start !text-fg-3 sm:table-cell">{ui("grade")}</th>
            <th scope="col" className="a-eyebrow py-3 text-end !text-fg-3">{ui("quantity")}</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.key} className="border-b border-line">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <span className="relative block size-12 shrink-0 overflow-hidden rounded-card bg-plate">
                    <Img image={line.image} alt="" sizes="48px" className="a-plate-img absolute inset-0 size-full object-contain p-1" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-fg">{t(line.name)}</span>
                    <GradeChip grade={line.grade} size="sm" className="mt-1.5 sm:hidden" />
                  </span>
                </div>
              </td>
              <td className="hidden py-3 sm:table-cell">
                <GradeChip grade={line.grade} size="sm" />
              </td>
              <td className="py-3 text-end font-semibold tabular text-fg">{line.qty}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="pt-4 font-semibold text-fg sm:hidden">{t(COPY.total)}</td>
            <td className="hidden pt-4 font-semibold text-fg sm:table-cell" colSpan={2}>
              {t(COPY.total)}
            </td>
            <td className="pt-4 text-end font-semibold tabular text-fg">{total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
