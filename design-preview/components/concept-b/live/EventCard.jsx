"use client";

import { BellRing, CalendarClock } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { getSeller } from "@/data/sellers";
import { useRemaining } from "@/lib/clock";
import { Duration } from "../ui/Countdown";
import { SellerAvatar } from "../ui/SellerAvatar";
import { cx } from "../ui/cx";
import { COPY } from "../copy";

/** Upcoming live event with host, lot count, countdown and a reminder toggle. */
export function EventCard({ event, reminded, onRemind, className = "" }) {
  const { t, ui, pl } = useLang();
  const host = getSeller(event.host);
  const startsIn = useRemaining(event.startsIn);
  return (
    <article className={cx("flex gap-3 rounded-xl bg-surface p-3 ring-1 ring-line", className)}>
      <span className="size-24 shrink-0 overflow-hidden rounded-lg bg-plate">
        <Img image={event.image} alt="" sizes="96px" className="kb-pack size-full object-contain p-2" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="flex items-center gap-1.5 kb-2xs font-bold text-primary">
          <CalendarClock aria-hidden="true" className="size-3.5" />
          {ui("startsIn")} <Duration seconds={startsIn} />
        </p>
        <h3 className="line-clamp-2 kb-sm font-bold text-fg">{t(event.title)}</h3>
        <p className="flex items-center gap-1.5 truncate kb-xs text-fg-2">
          <SellerAvatar seller={host} size="xs" />
          {t(host.name)} · {pl("lots", event.lots)}
        </p>
        <button
          type="button"
          onClick={onRemind}
          aria-pressed={reminded}
          className={cx(
            "mt-auto inline-flex h-8 w-fit items-center gap-1.5 rounded-md px-2.5 kb-xs font-bold transition-colors",
            reminded ? "bg-accent text-on-accent" : "bg-surface-2 text-fg hover:bg-line",
          )}
        >
          <BellRing aria-hidden="true" className="size-3.5" />
          {reminded ? t(COPY.reminderOn) : ui("remindMe")}
        </button>
      </div>
    </article>
  );
}
