"use client";

import Link from "next/link";
import { Eye, Radio } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { LIVE_EVENT, OTHER_EVENTS } from "@/data/live";
import { getSeller } from "@/data/sellers";
import { LiveBadge } from "../ui/Badge";
import { ButtonLink } from "../ui/Button";
import { GradeChip } from "../ui/GradeChip";
import { SellerAvatar } from "../ui/SellerAvatar";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { EventCard } from "../live/EventCard";
import { useEventReminders } from "../live/useEventReminders";

function LiveEventCard({ live }) {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const host = getSeller(LIVE_EVENT.host);
  const lot = live.current;
  const progress = live.intermission > 0 ? 0 : Math.max(0, Math.min(1, live.remaining / live.duration));
  return (
    <article className="grid overflow-hidden rounded-xl bg-surface ring-1 ring-line md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <Link href={link("/live-auction")} className="group relative block aspect-video overflow-hidden md:aspect-auto md:min-h-[300px]">
        <Img image={LIVE_EVENT.stream} alt={t(LIVE_EVENT.title)} sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-black/30" />
        <div className="absolute start-3 top-3 flex items-center gap-2">
          <LiveBadge size="md">{ui("liveNow")}</LiveBadge>
          <span className="inline-flex h-6 items-center gap-1.5 rounded-md bg-black/55 px-2 kb-xs font-semibold text-white backdrop-blur">
            <Eye aria-hidden="true" className="size-3.5" />
            <span className="tabular">{pl("viewers", live.viewers)}</span>
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="kb-lg font-extrabold">{t(LIVE_EVENT.title)}</p>
          <p className="mt-1 flex items-center gap-2 kb-xs text-white/80">
            <SellerAvatar seller={host} size="xs" />
            {t(LIVE_EVENT.presenter)} · {t(host.name)}
          </p>
        </div>
      </Link>
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <p className="kb-eyebrow text-accent">{t(COPY.liveSlideLot)}</p>
        {lot ? (
          <>
            <div className="flex items-center gap-3">
              <span className="size-16 shrink-0 overflow-hidden rounded-lg bg-plate">
                <Img image={lot.image} alt="" sizes="64px" className="kb-pack size-full object-contain p-1" />
              </span>
              <div className="min-w-0">
                <p className="line-clamp-2 kb-sm font-bold text-fg">{t(lot.title)}</p>
                {lot.grade ? <GradeChip grade={lot.grade} className="mt-1" /> : null}
              </div>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="kb-2xs text-fg-3">{ui("currentBid")}</p>
                <Money key={lot.currentBid} value={lot.currentBid} className="kz-flash -mx-1 rounded px-1 kb-price-lg text-fg" symbolClassName="text-[0.7em]" />
              </div>
              <p className="kb-xs text-fg-3">{pl("bids", lot.bidCount)}</p>
            </div>
            <div>
              <div className="mb-1 flex justify-between kb-2xs text-fg-3">
                <span>{t(COPY.lotClock)}</span>
                <span className="tabular">{t(COPY.secondsShort, { n: live.remaining })}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className={cx("h-full rounded-full transition-[width] duration-1000 ease-linear", live.remaining <= 10 ? "bg-live" : "bg-accent")} style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          </>
        ) : null}
        <ButtonLink href={link("/live-auction")} variant="brand" size="lg" icon={Radio} className="mt-auto">
          {ui("joinLive")}
        </ButtonLink>
      </div>
    </article>
  );
}

/** Full-bleed ink band: the live room now, then what's coming up. */
export function LiveBand({ live, className = "" }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const reminders = useEventReminders();

  return (
    <section aria-labelledby="kb-live-band" className={cx("kb-force-dark bg-bg text-fg", className)}>
      <div className="kb-container py-10 lg:py-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 id="kb-live-band" className="flex items-center gap-2.5 kb-h2">
              <span aria-hidden="true" className="kz-live-dot" />
              {ui("liveAuctions")}
            </h2>
            <p className="mt-1 kb-sm text-fg-2">{t(COPY.liveBandSubtitle)}</p>
          </div>
          <Link href={link("/live-auction")} className="hidden h-9 items-center rounded-control px-3 kb-sm font-bold text-accent hover:bg-surface sm:inline-flex">
            {ui("enterLiveRoom")}
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <LiveEventCard live={live} />
          <div className="grid content-start gap-3">
            <p className="kb-eyebrow text-fg-3">{t(COPY.comingUp)}</p>
            {OTHER_EVENTS.map((event) => (
              <EventCard key={event.slug} event={event} reminded={reminders.isOn(event)} onRemind={() => reminders.toggle(event)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
