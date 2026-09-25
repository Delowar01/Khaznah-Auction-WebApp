"use client";

import { BadgeCheck, CreditCard, ShieldCheck } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { TRUST_POINTS } from "@/data/site";
import { COPY } from "../copy";
import { DeliverTo } from "./DeliverTo";
import { LanguageLink } from "./ChromeBits";

const TICKER = [
  { key: "deposit", icon: ShieldCheck },
  { key: "graded", icon: BadgeCheck },
  { key: "payments", icon: CreditCard },
];

const LINK = "rounded-md px-2 py-1 font-medium opacity-85 transition-[opacity,background-color] hover:bg-white/10 hover:opacity-100";

/** Tier 1 of the desktop header: delivery city, trust ticker, utility links. */
export function UtilityStrip() {
  const { t, ui } = useLang();
  const { toast } = useStore();
  const trust = TICKER.map((item) => ({ ...item, point: TRUST_POINTS.find((p) => p.key === item.key) }));

  return (
    <div className="kb-on-dark hidden bg-secondary text-on-secondary lg:block">
      <div className="kb-container flex h-9 items-center justify-between gap-6 kb-xs">
        <DeliverTo />
        <ul aria-label={t(COPY.trustNotes)} className="flex min-w-0 items-center gap-5 opacity-85">
          {trust.map(({ key, icon: Icon, point }) => (
            <li key={key} className="flex items-center gap-1.5 whitespace-nowrap">
              <Icon aria-hidden="true" className="size-3.5 text-accent" />
              {t(point.title)}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={LINK}
            onClick={() => toast({ tone: "info", title: ui("sellWithKhazna"), description: t(COPY.sellText) })}
          >
            {ui("sellWithKhazna")}
          </button>
          <button type="button" className={LINK} onClick={() => toast({ tone: "info", title: ui("help"), description: t(COPY.helpText) })}>
            {ui("help")}
          </button>
          <span aria-hidden="true" className="mx-1 h-3.5 w-px bg-white/20" />
          <LanguageLink className={`${LINK} font-bold`} />
        </div>
      </div>
    </div>
  );
}
