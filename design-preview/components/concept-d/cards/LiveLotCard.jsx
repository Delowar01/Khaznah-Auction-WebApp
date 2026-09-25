"use client";

import { Eye, Radio } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT } from "@/data/live";
import { Badge } from "../ui/Badge";
import { buttonClass } from "../ui/Button";
import { GradeChip } from "../ui/GradeChip";
import { Plate } from "../ui/Plate";
import { CardShell, PriceLabel, TitleLink } from "./CardParts";

/** Card for the lot currently on the block in the live sale. */
export function LiveLotCard({ className = "" }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const lot = LIVE_EVENT.items.find((item) => item.status === "live");
  if (!lot) return null;
  return (
    <CardShell className={className}>
      <div className="relative">
        <Plate image={lot.image} alt={t(lot.title)} sizes="(min-width: 1280px) 20vw, 46vw" className="aspect-square" imgClassName="transition-transform duration-300 group-hover/card:scale-[1.045]" />
        <div className="pointer-events-none absolute inset-x-2 top-2 z-[3] flex items-start justify-between gap-2">
          <Badge tone="tag-live" dot>
            {ui("liveNow")}
          </Badge>
          <Badge tone="glass" icon={Eye} className="@max-[14rem]:hidden">
            <span className="tabular">{pl("viewers", LIVE_EVENT.viewers)}</span>
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="truncate kb-2xs font-medium text-fg-3">{t(LIVE_EVENT.title)}</p>
        <h3 className="min-h-[2lh] kb-md font-semibold">
          <TitleLink href={link("/live-auction")}>{t(lot.title)}</TitleLink>
        </h3>
        {lot.grade ? <GradeChip grade={lot.grade} className="w-fit" /> : null}
        <div className="mt-auto pt-1">
          <PriceLabel>{ui("currentBid")}</PriceLabel>
          <div className="flex items-baseline justify-between gap-2">
            <Money value={lot.currentBid} className="kb-price text-fg" symbolClassName="text-[0.8em]" />
            <span className="kb-xs text-fg-3">{pl("bids", lot.bidCount)}</span>
          </div>
        </div>
        <span aria-hidden="true" className={buttonClass({ size: "xs", className: "mt-1 w-full" })}>
          <Radio className="size-3.5" />
          {ui("joinLive")}
        </span>
      </div>
    </CardShell>
  );
}
