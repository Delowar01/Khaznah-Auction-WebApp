"use client";

import Link from "next/link";
import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { getSeller } from "@/data/sellers";
import { moneyText } from "@/lib/format";
import { COPY } from "./copy";
import { btnClass, cx } from "./ui";

function phaseText(live, t) {
  if (live.intermission > 0) return t(COPY.between, { n: live.intermission });
  if (live.phase === "going_once") return t(COPY.goingOnce);
  if (live.phase === "going_twice") return t(COPY.goingTwice);
  if (live.phase === "closing") return t(COPY.hammer);
  return t(COPY.biddingOpen);
}

function SideLot({ kind, item }) {
  const { t } = useLang();
  if (!item) return <div className="hidden md:block" />;
  const previous = kind === "previous";
  const sold = item.status === "sold";
  return (
    <div className="flex flex-col rounded-[14px] bg-[var(--ac-stage-2)] p-3 ring-1 ring-[var(--ac-stage-line)]">
      <p className="ac-label text-[var(--ac-stage-dim)]">{previous ? t(COPY.previous) : t(COPY.upNext)}</p>
      <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-[10px] bg-[#ecebe6]">
        <Img image={item.image} alt="" sizes="(min-width: 768px) 22vw, 50vw" className={cx("size-full object-contain p-[10%] mix-blend-multiply", previous ? "opacity-70 grayscale-[35%]" : "")} />
      </div>
      <p className="mt-3 ac-xs text-[var(--ac-stage-dim)]">{t(COPY.lotShort, { n: item.order })}</p>
      <p className="line-clamp-2 ac-sm font-semibold">{t(item.title)}</p>
      <p className="mt-auto pt-2 ac-sm">
        {previous ? (
          sold ? (
            <>
              <span className="ac-label me-2 text-[var(--ac-stage-dim)]">{t(COPY.sold)}</span>
              <Money value={item.finalBid ?? item.currentBid} className="font-semibold" />
            </>
          ) : (
            <span className="ac-label text-[var(--ac-stage-dim)]">{t(COPY.notSold)}</span>
          )
        ) : (
          <span className="text-[var(--ac-stage-dim)]">{t(COPY.startsAt, { amount: moneyText(item.startingBid) })}</span>
        )}
      </p>
    </div>
  );
}

/**
 * The live stage is the homepage hero: previous · NOW · next. The stream
 * fills the centre with the lot photo inset; the current bid and "Enter the
 * room to bid" sit under it. Bidding itself happens inside the room.
 */
export function LiveStage({ live }) {
  const { t, pl } = useLang();
  const { link } = useConcept();
  const titleId = useId();
  const item = live.current;
  const previous = live.items[live.currentIndex - 1] || null;
  const next = live.nextItem;
  const host = getSeller(live.event.host);
  return (
    <section id="floor-live" tabIndex={-1} aria-labelledby={titleId} className="scroll-mt-[calc(var(--ac-bar-h)+8px)] bg-[var(--ac-stage)] text-[var(--ac-stage-fg)] outline-none max-md:scroll-mt-[104px]">
      <div className="ac-container py-6 lg:py-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="inline-flex items-center gap-2 ac-label text-[var(--ac-stage-accent)]">
              <span aria-hidden="true" className="size-2 rounded-full bg-[var(--ac-stage-accent)]" />
              {t(COPY.liveStage)}
            </p>
            <h1 id={titleId} className="mt-1.5 ac-h2">
              {t(live.event.title)}
            </h1>
            <p className="mt-0.5 ac-sm text-[var(--ac-stage-dim)]">
              {t(live.event.presenter)}
              {host ? ` · ${t(host.name)}` : null}
            </p>
          </div>
          <p className="ac-sm text-[var(--ac-stage-dim)] ac-num">{t(COPY.watching, { n: live.viewers.toLocaleString("en-US") })}</p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_2fr_1fr] lg:gap-4">
          <div className="hidden md:block">
            <SideLot kind="previous" item={previous} />
          </div>

          <div className="overflow-hidden rounded-[14px] bg-[var(--ac-stage-2)] ring-1 ring-[var(--ac-stage-line)] md:order-none">
            <div className="relative h-[220px] sm:h-[260px] lg:h-[300px]">
              <Img image={live.event.stream} alt="" priority sizes="(min-width: 768px) 50vw, 100vw" className="size-full object-cover" />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/25" />
              <span className="absolute start-3 top-3 inline-flex h-7 items-center gap-2 rounded-[6px] bg-accent px-2.5 ac-xs font-bold uppercase tracking-wide text-on-accent">
                <span aria-hidden="true" className="size-2 rounded-full bg-current" />
                {t(COPY.now)} · {t(COPY.lotOf, { n: item?.order ?? "–", total: live.items.length })}
              </span>
              {item ? (
                <span className="absolute bottom-3 start-3 flex items-center gap-3 rounded-[12px] bg-black/55 p-2 pe-4 backdrop-blur-sm">
                  <span className="size-16 overflow-hidden rounded-[8px] bg-[#ecebe6]">
                    <Img image={item.image} alt="" sizes="64px" className="size-full object-contain p-1 mix-blend-multiply" />
                  </span>
                  <span className="max-w-[260px]">
                    <span className="block ac-xs text-[var(--ac-stage-dim)]">{t(COPY.lotShort, { n: item.order })}</span>
                    <span className="line-clamp-2 block ac-sm font-semibold">{t(item.title)}</span>
                  </span>
                </span>
              ) : null}
            </div>
            <div className="flex flex-col items-center px-4 pb-5 pt-4 text-center">
              <p className="ac-label text-[var(--ac-stage-dim)]">{t(COPY.current)}</p>
              <p className="mt-1 flex items-baseline gap-2">
                <Money value={item?.currentBid ?? 0} className="ac-hero-figure" />
                <span className="ac-sm text-[var(--ac-stage-dim)]">{pl("bids", item?.bidCount ?? 0)}</span>
              </p>
              <p className="mt-1 ac-sm text-[var(--ac-stage-dim)]">
                {phaseText(live, t)}
              </p>
              <Link href={link("/live-auction")} className={btnClass("light", "lg", "mt-4")}>
                {t(COPY.enterRoom)}
                <ArrowUpRight aria-hidden="true" className="flip-rtl size-4" />
              </Link>
              <p className="mt-2 max-w-[440px] ac-xs text-[var(--ac-stage-dim)]">{t(COPY.roomNote)}</p>
            </div>
          </div>

          <div className="hidden md:block">
            <SideLot kind="next" item={next} />
          </div>
        </div>
      </div>
    </section>
  );
}
