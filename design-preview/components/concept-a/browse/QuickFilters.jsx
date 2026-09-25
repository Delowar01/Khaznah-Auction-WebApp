"use client";

import { BadgeCheck, Percent, Timer } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADES } from "@/data/grades";
import { ToggleChip } from "../ui/Choice";
import { Segmented } from "../ui/Segmented";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

/** Sale-type switch plus the three most-used one-tap filters. */
export function QuickFilters({ browse, className = "" }) {
  const { t, ui } = useLang();
  const { state, facets } = browse;
  return (
    <div className={cx("no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0", className)}>
      <Segmented
        label={t(COPY.saleType)}
        value={state.tab}
        onChange={browse.setTab}
        options={[
          { value: "all", label: ui("all"), count: facets.tabs.all },
          { value: "auction", label: ui("auctions"), count: facets.tabs.auction },
          { value: "buy_now", label: ui("buyNow"), count: facets.tabs.buy_now },
        ]}
      />
      <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-line" />
      <ToggleChip icon={Timer} pressed={state.ending === "1h"} onClick={() => browse.setEnding(state.ending === "1h" ? "all" : "1h")}>
        {t(COPY.endingUnderHour)}
      </ToggleChip>
      <ToggleChip icon={Percent} pressed={state.discounted} onClick={() => browse.setDiscounted(!state.discounted)}>
        {ui("discounted")}
      </ToggleChip>
      <ToggleChip icon={BadgeCheck} pressed={state.grades.includes("A")} onClick={() => browse.toggleGrade("A")}>
        {t(GRADES.A.label)}
      </ToggleChip>
    </div>
  );
}
