"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADE_ORDER } from "@/data/grades";
import { StatusLabel } from "../ui/Status";
import { GradeChip } from "../ui/GradeChip";
import { WatchButton } from "../ui/Actions";
import { Caption } from "./Section";
import { COPY } from "../copy";

const STATUSES = ["live", "urgent", "critical", "upcoming", "new", "buyNow", "watching", "sold", "ended", "unavailable"];

export function Badges() {
  const { t, ui } = useLang();
  return (
    <div className="space-y-10">
      <div>
        <Caption>{ui("auction")}</Caption>
        <div className="flex flex-wrap gap-3">
          {STATUSES.map((status) => (
            <span key={status} className="rounded-full border border-line bg-surface px-3.5 py-2">
              <StatusLabel status={status} />
            </span>
          ))}
        </div>
      </div>
      <div>
        <Caption>{ui("conditionGrade")}</Caption>
        <div className="flex flex-wrap gap-2">
          {GRADE_ORDER.map((grade) => (
            <GradeChip key={grade} grade={grade} />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-10">
        <div>
          <Caption>{ui("off", { pct: 24 })}</Caption>
          <div className="flex gap-2">
            <span dir="ltr" className="rounded-full bg-secondary px-3 py-1.5 text-[11px] font-semibold tracking-wide text-on-secondary tabular">
              −24%
            </span>
            <span className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg rtl:text-xs rtl:normal-case rtl:tracking-normal">
              {ui("newListing")}
            </span>
          </div>
        </div>
        <div>
          <Caption>{ui("watch")}</Caption>
          <div className="flex items-center gap-3">
            <WatchButton slug="field-watch" forcePressed={false} />
            <WatchButton slug="field-watch" forcePressed />
            <span className="text-[13px] text-fg-2">{t(COPY.watchedLabel)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
