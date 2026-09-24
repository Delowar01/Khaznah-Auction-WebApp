"use client";

import Link from "next/link";
import { Eye, Mic, Radio } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { Img } from "@/components/shared/ui/Img";
import { Money } from "@/components/shared/ui/Money";
import { getSeller } from "@/data/sellers";
import { formatNumber } from "@/lib/format";
import { Diamond } from "../ui/Diamond";
import { ChamferFrame } from "../ui/Frame";

/** The stream: a chamfered 16:9 frame with the poster, LIVE diamond, viewers, presenter and the latest bid. */
export function LiveStage({ live }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { event, viewers, feed } = live;
  const host = getSeller(event.host);
  const latest = feed[0];

  return (
    <ChamferFrame size="lg" gold frameClassName="relative aspect-video overflow-hidden bg-secondary">
      <Img image={event.stream} alt={`${ui("liveStream")}: ${t(event.title)}`} priority sizes="(min-width: 1024px) 62vw, 100vw" className="size-full origin-[28%_38%] scale-[1.35] object-cover" />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/35" />

      <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3 sm:inset-x-5 sm:top-5">
        <span className="c-badge c-badge--live h-7 px-2.5">
          <Diamond variant="live" />
          {ui("live")}
        </span>
        <span className="flex h-7 items-center gap-1.5 rounded-xs bg-black/55 px-2.5 text-xs font-semibold text-on-secondary backdrop-blur-sm">
          <Eye aria-hidden="true" className="size-3.5" />
          <span className="c-num">{formatNumber(viewers)}</span>
          {ui("viewers")}
        </span>
      </div>

      <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3 text-on-secondary sm:inset-x-5 sm:bottom-5">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Mic aria-hidden="true" className="size-4 text-accent" />
            {t(event.presenter)}
          </p>
          <p className="mt-1 text-xs opacity-85">
            {ui("hostedBy")}{" "}
            <Link href={link(`/seller/${host.code}`)} className="c-link font-semibold">
              {t(host.name)}
            </Link>
          </p>
        </div>
        {latest ? (
          <p key={latest.id} className="kz-fade-up hidden items-center gap-2 rounded-xs bg-black/55 px-3 py-1.5 text-xs backdrop-blur-sm sm:flex">
            <Radio aria-hidden="true" className="size-3.5 text-accent" />
            {latest.own ? ui("you") : `${ui("bidder")} ${latest.who}`}
            <Money value={latest.amount} className="c-num font-semibold" />
          </p>
        ) : null}
      </div>
    </ChamferFrame>
  );
}
