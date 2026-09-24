"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { DEMO_USER } from "@/data/site";
import { LIVE_EVENT } from "@/data/live";
import { Money } from "@/components/shared/ui/Money";
import { LangLink } from "./LangLink";

export function UtilityBar() {
  const { t, ui, pl } = useLang();
  const { link } = useConcept();
  const { toast } = useStore();
  return (
    <div className="hidden border-b border-line md:block">
      <div className="mx-auto flex h-9 max-w-[1360px] items-center justify-between gap-6 px-6 text-[12px] text-fg-2 lg:px-10">
        <Link href={link("/live-auction")} className="group inline-flex min-w-0 items-center gap-2.5 text-fg-2 hover:text-fg">
          <span className="kz-live-dot !bg-live" aria-hidden="true" />
          <span className="a-eyebrow !text-[10.5px] !text-live rtl:!text-xs">{ui("liveNow")}</span>
          <span className="truncate">
            <span className="a-underline-hover">{t(LIVE_EVENT.title)}</span>
            <span className="text-fg-3"> · {pl("viewers", LIVE_EVENT.viewers)}</span>
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <button type="button" onClick={() => toast({ tone: "info", title: ui("sellWithKhazna") })} className="hover:text-fg">
            {ui("sellWithKhazna")}
          </button>
          <button type="button" onClick={() => toast({ tone: "info", title: ui("help") })} className="hover:text-fg">
            {ui("help")}
          </button>
          <span className="inline-flex items-center gap-1.5 text-fg">
            <Wallet aria-hidden="true" className="size-3.5 text-fg-3" />
            <span className="sr-only">{ui("walletBalance")}</span>
            <Money value={DEMO_USER.walletBalance} />
          </span>
          <LangLink className="font-medium text-fg hover:underline" />
        </div>
      </div>
    </div>
  );
}
