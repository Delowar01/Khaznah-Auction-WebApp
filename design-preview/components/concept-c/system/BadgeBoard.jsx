"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADE_ORDER } from "@/data/grades";
import { POPULAR_SEARCHES } from "@/lib/catalog";
import { Badge, GradeChip } from "../ui/Badges";
import { StateLabel } from "./SystemSection";

/** Status badges, grade chips and filter chips. */
export function BadgeBoard() {
  const { t, ui } = useLang();
  const [pressed, setPressed] = useState(0);
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-md border border-line bg-surface p-6">
        <StateLabel>{ui("auction")}</StateLabel>
        <div className="flex flex-wrap gap-2">
          <Badge tone="live" live>
            {ui("liveNow")}
          </Badge>
          <Badge tone="live" live>
            {ui("closingNow")}
          </Badge>
          <Badge tone="warning" dia>
            {ui("endingSoon")}
          </Badge>
          <Badge tone="primary" dia>
            {ui("upcoming")}
          </Badge>
          <Badge tone="neutral" dia>
            {ui("auction")}
          </Badge>
          <Badge tone="night" dia>
            {ui("sold")}
          </Badge>
          <Badge tone="muted">{ui("ended")}</Badge>
        </div>
        <StateLabel className="mt-6">{ui("buyNow")}</StateLabel>
        <div className="flex flex-wrap gap-2">
          <Badge tone="gold" dia>
            {ui("newListing")}
          </Badge>
          <Badge tone="neutral">{ui("off", { pct: 24 })}</Badge>
          <Badge tone="success" dia>
            {ui("inStock")}
          </Badge>
          <Badge tone="muted">{ui("outOfStock")}</Badge>
          <Badge tone="muted">{ui("unavailable")}</Badge>
        </div>
      </div>
      <div className="rounded-md border border-line bg-surface p-6">
        <StateLabel>{ui("conditionGrade")}</StateLabel>
        <div className="flex flex-wrap gap-2">
          {GRADE_ORDER.map((key) => (
            <GradeChip key={key} grade={key} full />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {GRADE_ORDER.slice(1, 4).map((key) => (
            <GradeChip key={key} grade={key} size="lg" full />
          ))}
        </div>
      </div>
      <div className="rounded-md border border-line bg-surface p-6">
        <StateLabel>{ui("popularSearches")}</StateLabel>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((term, index) => (
            <button key={term.en} type="button" aria-pressed={pressed === index} onClick={() => setPressed(index)} className="c-chip">
              <Search aria-hidden="true" className="size-3.5 text-fg-3" />
              {t(term)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
