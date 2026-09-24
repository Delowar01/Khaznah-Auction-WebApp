"use client";

import { Eye, Radio } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { formatNumber } from "@/lib/format";

/** The stream: poster frame with LIVE, audience and presenter lower-third. */
export function Stage({ event, viewers, host }) {
  const { t, ui } = useLang();
  return (
    <figure className="relative overflow-hidden rounded-card bg-black">
      <div className="relative aspect-video">
        <Img image={event.stream} alt={t(event.title)} priority sizes="(min-width: 1024px) 64vw, 100vw" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35" aria-hidden="true" />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3 sm:inset-x-5 sm:top-5">
          <span className="inline-flex items-center gap-2 rounded-xs bg-[var(--live-solid)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white rtl:text-xs rtl:normal-case rtl:tracking-normal">
            <span className="kz-live-dot !size-1.5 !bg-white" aria-hidden="true" />
            {ui("live")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1 text-[12px] font-medium text-white backdrop-blur">
            <Eye aria-hidden="true" className="size-3.5" />
            <span className="tabular" dir="ltr">
              {formatNumber(viewers)}
            </span>
            <span className="sr-only">{ui("viewers")}</span>
          </span>
        </div>
        <figcaption className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white sm:inset-x-6 sm:bottom-6">
          <div className="min-w-0">
            <p className="a-serif text-[20px] leading-tight sm:text-[26px]">{t(event.presenter)}</p>
            <p className="mt-1 text-[13px] text-white/75">
              {ui("hostedBy")} {t(host?.name)}
            </p>
          </div>
          <span className="hidden items-center gap-1.5 text-[12px] text-white/75 sm:inline-flex">
            <Radio aria-hidden="true" className="size-3.5" />
            {ui("connected")}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
