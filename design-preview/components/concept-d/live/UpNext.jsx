"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { LotImage } from "../ui/LotImage";

/** The next three lots to come on the block. */
export function UpNext({ live, className = "" }) {
  const { t, ui } = useLang();
  const next = live.upcoming.slice(0, 3);
  if (!next.length) return null;
  return (
    <section aria-labelledby="up-next-title" className={className}>
      <h2 id="up-next-title" className="d-label mb-2.5 text-fg-3">
        {ui("upNext")}
      </h2>
      <ol className="grid gap-2 sm:grid-cols-3">
        {next.map((item) => (
          <li key={item.order} className="d-panel flex items-center gap-3 p-2.5">
            <LotImage image={item.image} alt="" sizes="48px" className="size-11 shrink-0 rounded-lg" inset="p-1" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-fg">{t(item.title)}</p>
              <p className="mt-0.5 text-[11.5px] text-fg-3">
                {ui("openingBid")} <Money value={item.startingBid} className="d-num text-fg-2" />
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
