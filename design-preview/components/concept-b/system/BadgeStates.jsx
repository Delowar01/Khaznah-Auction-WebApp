"use client";

import { CalendarClock, Gavel, TrendingDown } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { GRADE_ORDER } from "@/data/grades";
import { getProduct } from "@/data/products";
import { marketSaving } from "@/lib/catalog";
import { Badge, LiveBadge } from "../ui/Badge";
import { CountdownPill } from "../ui/Countdown";
import { GradeChip } from "../ui/GradeChip";
import { COPY } from "../copy";
import { Panel, Specimen } from "./SystemSection";

const FRIDGE = getProduct("fridge-690");

/** Status badges, grade chips and urgency-coloured countdown pills. */
export function BadgeStates() {
  const { t, ui } = useLang();
  return (
    <Panel className="grid gap-6 lg:grid-cols-3">
      <Specimen label={t(COPY.sysStatus)}>
        <div className="flex flex-wrap gap-2 rounded-lg bg-plate p-3">
          <LiveBadge size="md">{ui("liveNow")}</LiveBadge>
          <Badge tone="tag-warn" size="md">
            {ui("endingSoon")}
          </Badge>
          <Badge tone="tag-live" size="md" dot>
            {ui("closingNow")}
          </Badge>
          <Badge tone="tag-new" size="md">
            {ui("newListing")}
          </Badge>
          <Badge tone="tag-ink" size="md">
            {ui("sold")}
          </Badge>
          <Badge tone="tag-muted" size="md">
            {ui("unavailable")}
          </Badge>
          <Badge tone="tag-indigo" size="md" icon={Gavel}>
            {ui("auction")}
          </Badge>
          <Badge tone="tag-indigo" size="md" icon={CalendarClock}>
            {ui("upcoming")}
          </Badge>
          <Badge tone="tag-gold" size="md">
            <span dir="ltr">−24%</span>
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent" size="md" icon={TrendingDown}>
            {ui("belowMarket", { pct: marketSaving(FRIDGE, FRIDGE.currentBid) })}
          </Badge>
          <Badge tone="success" size="md">
            {ui("verifiedSeller")}
          </Badge>
          <Badge tone="warning" size="md">
            {ui("onlyLeft", { n: 3 })}
          </Badge>
          <Badge tone="neutral" size="md">
            {ui("passed")}
          </Badge>
        </div>
      </Specimen>
      <Specimen label={t(COPY.sysGrades)}>
        <div className="flex flex-wrap gap-2">
          {GRADE_ORDER.map((grade) => (
            <GradeChip key={grade} grade={grade} size="md" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {GRADE_ORDER.map((grade) => (
            <GradeChip key={grade} grade={grade} size="lg" letter />
          ))}
        </div>
      </Specimen>
      <Specimen label={t(COPY.countdowns)}>
        <div className="flex flex-wrap gap-2">
          <CountdownPill phase="live" remaining={2 * 3600 + 14 * 60} size="md" />
          <CountdownPill phase="urgent" remaining={18 * 60 + 24} size="md" />
          <CountdownPill phase="critical" remaining={9 * 60 + 12} size="md" />
          <CountdownPill phase="upcoming" remaining={30 * 3600} size="md" prefix={ui("startsIn")} />
          <CountdownPill phase="ended" size="md" />
          <CountdownPill phase="sold" size="md" />
        </div>
      </Specimen>
    </Panel>
  );
}
