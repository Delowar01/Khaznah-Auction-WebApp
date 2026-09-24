"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { UI } from "@/data/ui";
import { COPY } from "../copy";
import { GradeChip } from "../ui/Badges";
import { PlateImage } from "../ui/Frame";
import { EyebrowRule } from "../ui/Section";

/** Pallet / carton manifest as a grid of line items with quantities and grades. */
export function Manifest({ product }) {
  const { t, ui, pl } = useLang();
  const lines = product.palletContents || [];
  if (!lines.length) return null;
  const units = lines.reduce((sum, line) => sum + line.qty, 0);

  return (
    <section aria-labelledby="manifest-title">
      <EyebrowRule content={UI.manifest} className="mb-5" />
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 id="manifest-title" className="c-h3">
          {ui("palletContents")}
        </h2>
        <p className="text-sm text-fg-2">
          {pl("units", units)} · <span className="c-num">{lines.length}</span> {ui("lines")}
        </p>
      </div>
      <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
        {lines.map((line) => (
          <li key={line.key} className="flex items-center gap-4 bg-surface p-3.5">
            <PlateImage image={line.image} alt="" sizes="64px" zoom={false} className="size-16 shrink-0 rounded-sm" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[0.9375rem] font-medium text-fg">{t(line.name)}</p>
              <div className="mt-1.5">
                <GradeChip grade={line.grade} />
              </div>
            </div>
            <div className="text-end">
              <p className="c-num text-2xl font-semibold leading-none text-fg">{line.qty}</p>
              <p className="mt-1 text-xs text-fg-3">{t(COPY.qtyCol)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
