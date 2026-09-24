"use client";

import Link from "next/link";
import { ArrowRight, Eye, Play } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { getSeller } from "@/data/sellers";
import { formatNumber } from "@/lib/format";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Button } from "../ui/Button";
import { COPY } from "../copy";

export function LiveBand() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const live = useLiveEvent();
  const { event, current, remaining, duration, viewers, upcoming, intermission } = live;
  const host = getSeller(event.host);
  const progress = intermission > 0 ? 0 : Math.max(0, Math.min(1, remaining / duration));

  return (
    <section className="a-stage relative overflow-hidden">
      <div className="mx-auto max-w-[1360px] px-5 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="a-eyebrow flex items-center gap-2 !text-[var(--stage-live)]">
              <span className="kz-live-dot" aria-hidden="true" />
              {ui("liveNow")}
            </p>
            <h2 className="a-display mt-4 text-[34px] text-[var(--stage-fg)] sm:text-[48px] rtl:sm:text-[42px]">{t(COPY.liveRoom)}</h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--stage-muted)] rtl:text-base rtl:leading-8">{t(COPY.liveRoomText)}</p>
          </div>
          <p className="flex items-center gap-2 text-sm text-[var(--stage-muted)]">
            <Eye aria-hidden="true" className="size-4" />
            <span className="tabular">{formatNumber(viewers)}</span> {ui("viewers")}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <Link href={link("/live-auction")} className="group relative block overflow-hidden rounded-card lg:col-span-8">
            <div className="relative aspect-video">
              <Img image={event.stream} alt={t(event.title)} sizes="(min-width: 1024px) 60vw, 100vw" className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
              <span className="absolute start-5 top-5 inline-flex items-center gap-2 rounded-xs bg-[var(--live-solid)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white rtl:tracking-normal">
                <span className="size-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />
                {ui("live")}
              </span>
              <span className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur transition-transform duration-500 group-hover:scale-110">
                <Play aria-hidden="true" className="size-6 translate-x-0.5 fill-current" />
              </span>
              <div className="absolute inset-x-5 bottom-5 text-white">
                <p className="a-serif text-[22px] leading-tight sm:text-[28px]">{t(event.title)}</p>
                <p className="mt-1 text-sm text-white/75">
                  {t(event.presenter)} · {ui("hostedBy")} {t(host?.name)}
                </p>
              </div>
            </div>
          </Link>

          <div className="flex flex-col lg:col-span-4">
            <div className="rounded-card border border-[var(--stage-line)] p-6">
              <p className="a-eyebrow !text-[var(--stage-muted)]">
                {ui("currentLot")} · {ui("lotOf", { n: current?.order ?? 0, total: event.items.length })}
              </p>
              <div className="mt-4 flex gap-4">
                <span className="relative size-20 shrink-0 overflow-hidden rounded-card bg-plate">
                  {current ? <Img image={current.image} alt="" sizes="80px" className="a-plate-img absolute inset-0 size-full object-contain p-2" /> : null}
                </span>
                <div className="min-w-0">
                  <p className="a-serif text-[20px] leading-snug text-[var(--stage-fg)]">{t(current?.title)}</p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-[var(--stage-muted)] rtl:text-xs rtl:normal-case rtl:tracking-normal">{ui("currentBid")}</p>
                  <Money key={current?.currentBid} value={current?.currentBid ?? 0} className="a-serif kz-fade-up text-[30px] leading-tight text-[var(--stage-fg)]" symbolClassName="text-[0.78em]" />
                </div>
              </div>
              <div className="mt-5 h-px w-full bg-[var(--stage-line)]">
                <div className="a-progress h-px bg-[var(--accent)]" style={{ transform: `scaleX(${progress})` }} />
              </div>
              <Button as={Link} href={link("/live-auction")} variant="stage" className="mt-6 w-full">
                {t(COPY.enterRoom)}
              </Button>
            </div>
            <div className="mt-6">
              <p className="a-eyebrow !text-[var(--stage-muted)]">{ui("upNext")}</p>
              <ul className="mt-3 divide-y divide-[var(--stage-line)]">
                {upcoming.slice(0, 3).map((item) => (
                  <li key={item.order} className="flex items-center gap-3 py-3">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-xs bg-plate">
                      <Img image={item.image} alt="" sizes="44px" className="a-plate-img absolute inset-0 size-full object-contain p-1" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[14px] text-[var(--stage-fg)]">{t(item.title)}</span>
                    <Money value={item.startingBid} className="text-[13px] text-[var(--stage-muted)]" />
                  </li>
                ))}
              </ul>
              <Link href={link("/live-auction")} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--stage-fg)]">
                <span className="a-link">{ui("lotsInSale")}</span>
                <DirIcon icon={ArrowRight} className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
