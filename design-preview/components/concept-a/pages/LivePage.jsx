"use client";

import { useRef } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { getSeller } from "@/data/sellers";
import { OTHER_EVENTS } from "@/data/live";
import { formatNumber } from "@/lib/format";
import { Money } from "@/components/shared/ui/Money";
import { SectionHead } from "../ui/Type";
import { Button } from "../ui/Button";
import { StickyBar, useOffscreen } from "../ui/StickyBar";
import { Stage } from "../live/Stage";
import { LotConsole } from "../live/LotConsole";
import { LotSequence } from "../live/LotSequence";
import { ActivityFeed } from "../live/ActivityFeed";
import { ComingUp } from "../live/ComingUp";
import { COPY } from "../copy";

export function LivePage() {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const live = useLiveEvent();
  const { event, items, currentIndex, current, viewers, feed, minNext, intermission, placeBid, completed } = live;
  const host = getSeller(event.host);
  const consoleRef = useRef(null);
  const consoleOffscreen = useOffscreen(consoleRef);

  return (
    <div className="pb-24 lg:pb-0">
      <section className="a-stage">
        <div className="mx-auto max-w-[1360px] px-5 pb-12 pt-8 sm:px-6 lg:px-10 lg:pb-16 lg:pt-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="a-eyebrow flex items-center gap-2 !text-[var(--stage-live)]">
                <span className="kz-live-dot" aria-hidden="true" />
                {ui("liveAuction")} · {t(COPY.liveTitle)}
              </p>
              <h1 className="a-display mt-4 text-[34px] text-[var(--stage-fg)] sm:text-[52px] rtl:sm:text-[44px]">{t(event.title)}</h1>
              <p className="mt-3 text-sm text-[var(--stage-muted)] rtl:text-[15px]">
                {t(event.presenter)} · {ui("hostedBy")}{" "}
                <Link href={link(`/seller/${host.code}`)} className="font-medium text-[var(--stage-fg)] underline-offset-4 hover:underline">
                  {t(host.name)}
                </Link>
              </p>
            </div>
            <dl className="flex gap-10 text-[var(--stage-fg)]">
              <div>
                <dt className="a-eyebrow !text-[var(--stage-muted)]">{ui("viewers")}</dt>
                <dd className="a-serif mt-1 flex items-center gap-2 text-[34px] leading-none tabular">
                  <Eye aria-hidden="true" className="size-5 text-[var(--stage-muted)]" />
                  {formatNumber(viewers)}
                </dd>
              </div>
              <div>
                <dt className="a-eyebrow !text-[var(--stage-muted)]">{ui("completedLots")}</dt>
                <dd dir="ltr" className="a-serif mt-1 text-[34px] leading-none tabular rtl:text-end">
                  {completed.length}/{items.length}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <Stage event={event} viewers={viewers} host={host} />
            </div>
            <div ref={consoleRef} className="min-w-0 lg:col-span-4">
              <LotConsole live={live} deposit={event.depositAmount} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1360px] grid-cols-1 gap-14 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-24">
        <div className="min-w-0 lg:col-span-7">
          <SectionHead eyebrow={pl("lots", items.length)} title={t(COPY.lotsInSale)} />
          <div className="mt-8">
            <LotSequence items={items} currentIndex={currentIndex} />
          </div>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <SectionHead eyebrow={ui("activity")} title={t(COPY.inTheRoom)} />
          <div className="mt-8">
            <ActivityFeed feed={feed} />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-6 lg:px-10 lg:py-24">
          <SectionHead eyebrow={ui("moreLive")} title={t(COPY.otherEvents)} />
          <div className="mt-10">
            <ComingUp events={OTHER_EVENTS} />
          </div>
        </div>
      </section>

      <StickyBar show={consoleOffscreen}>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] text-fg-3">{t(current?.title)}</p>
          <p key={current?.currentBid} className="a-serif kz-fade-up text-[24px] leading-tight text-fg">
            <Money value={current?.currentBid ?? 0} symbolClassName="text-[0.8em]" />
          </p>
        </div>
        <Button disabled={intermission > 0} onClick={() => placeBid(minNext)}>
          {ui("bidNow")} · <Money value={minNext} />
        </Button>
      </StickyBar>
    </div>
  );
}
