"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { manifestUnits } from "../utils/lots";
import { COPY } from "../copy";

/** Line-by-line pallet manifest with a units total. */
export function ManifestTable({ product, caption }) {
  const { t, ui, pl } = useLang();
  const lines = product.palletContents || [];
  const units = manifestUnits(product);
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <table className="w-full border-collapse text-start">
        <caption className="border-b border-line px-4 py-3 text-start">
          <span className="block kb-md font-bold text-fg">{caption || ui("palletContents")}</span>
          <span className="block kb-xs text-fg-3">{t(COPY.totalUnits, { units: pl("units", units), lines: `${lines.length} ${ui("lines")}` })}</span>
        </caption>
        <thead className="bg-surface-2 kb-2xs font-bold text-fg-3">
          <tr>
            <th scope="col" className="px-4 py-2 text-start font-bold">
              {t(COPY.line)}
            </th>
            <th scope="col" className="px-2 py-2 text-start font-bold">
              {ui("grade")}
            </th>
            <th scope="col" className="px-4 py-2 text-end font-bold">
              {t(COPY.qty)}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {lines.map((line) => (
            <tr key={line.key}>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <Plate image={line.image} alt="" sizes="44px" pad="p-1" className="size-11 shrink-0 rounded-md border border-line" />
                  <span className="kb-sm font-semibold text-fg">{t(line.name)}</span>
                </div>
              </td>
              <td className="px-2 py-2.5">
                <GradeChip grade={line.grade} />
              </td>
              <td className="px-4 py-2.5 text-end kb-sm font-bold text-fg tabular">×{line.qty}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-line-strong bg-surface-2/60">
            <th scope="row" colSpan={2} className="px-4 py-2.5 text-start kb-sm font-bold text-fg">
              {t(COPY.lotTotal)}
            </th>
            <td className="px-4 py-2.5 text-end kb-sm font-extrabold text-fg tabular">{pl("units", units)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
