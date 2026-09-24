"use client";

import { useState } from "react";
import { BellRing, CalendarClock } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { getSeller } from "@/data/sellers";
import { useRemaining } from "@/lib/clock";
import { formatDuration } from "@/lib/format";
import { LotImage } from "../ui/LotImage";
import { SellerAvatar } from "../ui/SellerAvatar";
import { StatusChip } from "../ui/Chips";
import { useCopy } from "../lib/useCopy";

/** Upcoming live sale with a start countdown and a reminder toggle. */
export function UpcomingEventCard({ event, className = "" }) {
  const { t, ui, lang, pl } = useLang();
  const { toast } = useStore();
  const c = useCopy();
  const seller = getSeller(event.host);
  const startsIn = useRemaining(event.startsIn);
  const [reminder, setReminder] = useState(false);

  return (
    <article className={`d-panel flex min-w-0 flex-col p-4 ${className}`}>
      <div className="flex gap-4">
        <LotImage image={event.image} alt="" sizes="88px" className="size-20 shrink-0 rounded-xl" inset="p-2" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status="upcoming" />
            <span className="d-num text-xs text-fg-3">{pl("lots", event.lots)}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-[15px] font-medium leading-snug text-fg">{t(event.title)}</h3>
          <p className="mt-1.5 flex items-center gap-2 text-xs text-fg-3">
            <SellerAvatar seller={seller} size="sm" className="size-5 rounded text-[8px]" />
            <span className="truncate">{t(seller.name)}</span>
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="min-h-4 flex-1" />
      <div className="flex items-center gap-3 border-t border-line pt-3.5">
        <p className="flex min-w-0 flex-1 items-center gap-2 text-xs text-fg-2">
          <CalendarClock aria-hidden="true" className="size-4 shrink-0 d-ink" />
          <span className="truncate">{ui("startsIn")}</span>
          <span className="d-num text-sm font-medium text-fg">{formatDuration(startsIn, lang, "clock")}</span>
        </p>
        <button
          type="button"
          aria-pressed={reminder}
          onClick={() => {
            const next = !reminder;
            setReminder(next);
            if (next) toast({ tone: "success", title: ui("remindMe"), description: c("reminderSet") });
          }}
          className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-control px-3 text-[13px] font-medium transition-colors ${
            reminder ? "bg-accent/14 text-auction ring-1 ring-inset ring-accent/40" : "text-fg-2 ring-1 ring-inset ring-line-strong hover:bg-surface-2 hover:text-fg"
          }`}
        >
          <BellRing aria-hidden="true" className="size-3.5" />
          {ui("remindMe")}
        </button>
      </div>
    </article>
  );
}
