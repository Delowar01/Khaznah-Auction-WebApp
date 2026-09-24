"use client";

import Link from "next/link";
import { Eye, Mic, Radio } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { getSeller } from "@/data/sellers";
import { formatNumber } from "@/lib/format";
import { COPY } from "../copy";
import { BiHeading } from "../ui/Bi";
import { ButtonLink } from "../ui/Button";
import { Diamond } from "../ui/Diamond";
import { ChamferFrame } from "../ui/Frame";
import { Reveal } from "@/components/shared/ui/Reveal";
import { LotStrip } from "../live/LotStrip";

function Fact({ label, children }) {
  return (
    <div className="bg-bg px-4 py-3.5">
      <dt className="text-xs text-fg-3">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-fg">{children}</dd>
    </div>
  );
}

/** Deep indigo band with the live sale: poster, facts and the lot timeline. */
export function LiveBand({ live }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { event, current, viewers, items, currentIndex } = live;
  const host = getSeller(event.host);

  return (
    <section aria-labelledby="live-title" className="c-night relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <span className="c-gridlines" style={{ "--grid": "4.5rem", "--grid-mask": "radial-gradient(90% 80% at 50% 40%, black 30%, transparent 80%)" }} />
      <Reveal className="c-container relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-4">
              <span className="c-eyebrow text-live">
                <Diamond variant="live" size={8} />
                {ui("liveNow")}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            </div>
            <BiHeading id="live-title" content={event.title} titleClassName="text-[1.625rem] sm:text-[2rem] lg:text-[2.25rem]" />
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-fg-2">
              <Mic aria-hidden="true" className="size-4 text-accent" />
              {t(event.presenter)}
            </p>
            <p className="c-prose mt-4 max-w-lg">{t(COPY.liveBandText)}</p>
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line">
              <Fact label={ui("hostedBy")}>
                <Link href={link(`/seller/${host.code}`)} className="c-link">
                  {t(host.name)}
                </Link>
              </Fact>
              <Fact label={ui("currentLot")}>{ui("lotOf", { n: currentIndex + 1, total: items.length })}</Fact>
              <Fact label={ui("viewers")}>
                <span className="c-num">{formatNumber(viewers)}</span>
              </Fact>
              <Fact label={ui("depositAmount")}>
                <Money value={event.depositAmount} className="c-num" />
              </Fact>
            </dl>
            <ButtonLink href={link("/live-auction")} variant="gold" size="lg" arrow className="mt-8">
              {ui("enterLiveRoom")}
            </ButtonLink>
          </div>

          <div className="lg:col-span-7">
            <ChamferFrame size="lg" gold frameClassName="relative aspect-video bg-bg">
              <Img image={event.stream} alt={`${ui("liveStream")}: ${t(event.title)}`} sizes="(min-width: 1024px) 55vw, 100vw" className="size-full origin-[28%_38%] scale-[1.45] object-cover" />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />
              <div className="absolute end-4 top-4 flex items-center gap-2">
                <span className="c-badge c-badge--live">
                  <Diamond variant="live" />
                  {ui("live")}
                </span>
                <span className="flex h-[1.625rem] items-center gap-1.5 rounded-xs bg-black/55 px-2 text-xs font-semibold text-on-secondary">
                  <Eye aria-hidden="true" className="size-3.5" />
                  <span className="c-num">{formatNumber(viewers)}</span>
                </span>
              </div>
              {current ? (
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-on-secondary">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs opacity-85">
                      <Radio aria-hidden="true" className="size-3.5" />
                      {ui("currentLot")}
                    </p>
                    <p className="mt-1 line-clamp-1 font-semibold">{t(current.title)}</p>
                  </div>
                  <Money value={current.currentBid} className="c-num shrink-0 text-2xl font-semibold" />
                </div>
              ) : null}
            </ChamferFrame>
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="c-caps mb-6 text-fg-2">{ui("lotsInSale")}</p>
          <LotStrip items={items} label={ui("lotsInSale")} />
        </div>
      </Reveal>
    </section>
  );
}
