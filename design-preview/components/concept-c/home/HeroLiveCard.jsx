"use client";

import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { formatNumber } from "@/lib/format";
import { COPY } from "../copy";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";

/** Floating live-sale card on the hero frame; reads the shared live engine. */
export function HeroLiveCard({ live, className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { current, viewers, intermission, event } = live;

  return (
    <div className={cx("rounded-md border border-line bg-elevated p-4 shadow-raised sm:p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-live">
          <Diamond variant="live" size={8} />
          {ui("liveNow")}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-fg-2">
          <Eye aria-hidden="true" className="size-3.5" />
          <span className="c-num">{formatNumber(viewers)}</span>
          {ui("viewers")}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 font-semibold leading-snug text-fg">{t(event.title)}</p>
      {current ? (
        <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
          <span className="c-plate size-14 shrink-0 rounded-sm">
            <Img image={current.image} alt="" sizes="56px" className="c-plate-img p-1" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-fg-3">{t(COPY.onTheBlock)}</p>
            <p className="line-clamp-1 text-sm font-medium text-fg">{t(current.title)}</p>
          </div>
        </div>
      ) : null}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-fg-3">{intermission > 0 ? ui("nextLotIn", { n: intermission }) : ui("currentBid")}</p>
          <Money value={current?.currentBid ?? 0} className="c-num text-2xl font-semibold text-fg" />
        </div>
        <Link href={link("/live-auction")} className="c-btn c-btn--gold c-btn--sm">
          {ui("enterLiveRoom")}
          <DirIcon icon={ArrowRight} className="size-4" />
        </Link>
      </div>
    </div>
  );
}
