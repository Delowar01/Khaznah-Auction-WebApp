"use client";

import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT } from "@/data/live";
import { Badge, GradeChip } from "../ui/Badges";
import { ChamferFrame, PlateImage } from "../ui/Frame";

/** The lot currently on the block in the live sale, as a card that opens the live room. */
export function LiveLotCard({ className = "" }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const item = LIVE_EVENT.items.find((i) => i.status === "live");
  return (
    <article className={`c-card group @container relative flex flex-col overflow-hidden rounded-card border border-live/40 bg-surface ${className}`}>
      <div className="relative p-2 pb-0">
        <ChamferFrame>
          <PlateImage image={item.image} alt="" sizes="320px" className="aspect-square" />
        </ChamferFrame>
        <div className="pointer-events-none absolute bottom-3.5 start-4">
          <Badge tone="live" live>
            {ui("liveNow")}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
        <GradeChip grade={item.grade} className="self-start" />
        <h3 className="c-card-title mt-3 line-clamp-2 min-h-[2lh]">
          <Link href={link("/live-auction")} className="c-stretch">
            {t(item.title)}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-3.5">
          <div>
            <p className="c-label">{ui("currentBid")}</p>
            <Money value={item.currentBid} className="c-num mt-1 text-[1.3rem] font-semibold text-fg" />
          </div>
          <p className="c-label">{pl("bids", item.bidCount)}</p>
        </div>
      </div>
    </article>
  );
}
