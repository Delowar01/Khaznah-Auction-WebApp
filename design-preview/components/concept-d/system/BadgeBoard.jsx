"use client";

import { getProduct } from "@/data/products";
import { GRADE_ORDER } from "@/data/grades";
import { LotImage } from "../ui/LotImage";
import { StatusChip, OverlayChip, DeltaChip, LotTag } from "../ui/Chips";
import { GradeChip } from "../ui/GradeChip";
import { useCopy } from "../lib/useCopy";
import { Specimen } from "./SystemSection";

const STATUSES = ["live", "urgent", "critical", "upcoming", "new", "buyNow", "sold", "ended", "unavailable", "hot", "won"];

/** Status chips in panels and on photography, grade chips, deltas and tags. */
export function BadgeBoard() {
  const c = useCopy();
  const photo = getProduct("tv-43").images[0];
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="d-panel space-y-6 p-5">
        <Specimen label={c("sysSoftChips")}>
          {STATUSES.map((status) => (
            <StatusChip key={status} status={status} />
          ))}
        </Specimen>
        <Specimen label={c("grpGrades")}>
          {GRADE_ORDER.map((grade) => (
            <GradeChip key={grade} grade={grade} label />
          ))}
        </Specimen>
        <Specimen label={c("sysDeltas")}>
          <DeltaChip amount={25} />
          <DeltaChip percent={24} tone="down" />
          <DeltaChip amount={1150} tone="gold" />
          <LotTag lot="KZ-0388" />
          <LotTag lot="KZ-S-0512" />
        </Specimen>
      </div>
      <div className="d-panel p-5">
        <Specimen label={c("sysOverlayChips")} className="h-full">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
            <LotImage image={photo} alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" />
            <div className="absolute inset-3 flex flex-wrap content-start gap-2">
              {["live", "urgent", "critical", "upcoming", "new", "buyNow", "sold", "unavailable"].map((status) => (
                <OverlayChip key={status} status={status} />
              ))}
            </div>
          </div>
        </Specimen>
      </div>
    </div>
  );
}
