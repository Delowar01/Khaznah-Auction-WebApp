"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, MapPin } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { useHydrated } from "@/components/shared/ui/hooks";
import { CITIES } from "@/data/sellers";
import { formatDualDate } from "@/lib/format";
import { withLang } from "@/lib/routes";
import { COPY } from "../copy";
import { Diamond } from "../ui/Diamond";

/** Today's date in the Hijri and Gregorian calendars (client only, avoids hydration drift). */
function TodayLine() {
  const { lang } = useLang();
  const hydrated = useHydrated();
  if (!hydrated) return <span className="inline-block h-4 w-56" aria-hidden="true" />;
  const { hijri, gregorian } = formatDualDate(new Date(), lang);
  return (
    <span className="flex items-center gap-2.5">
      <span>{hijri}</span>
      <Diamond size={3} className="text-fg-3" />
      <span>{gregorian}</span>
    </span>
  );
}

/** Slim service line above the main header (desktop and tablet). */
export function UtilityBar() {
  const { t, ui, lang } = useLang();
  const { toast } = useStore();
  const pathname = usePathname();
  const other = lang === "ar" ? "en" : "ar";

  const service = (title, description) => () => toast({ tone: "info", title, description });

  return (
    <div className="hidden border-b border-line bg-surface-2 text-[0.8125rem] text-fg-2 md:block">
      <div className="c-container flex h-[2.125rem] items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <TodayLine />
          <span aria-hidden="true" className="h-3.5 w-px bg-line-strong" />
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-3.5 text-fg-3" />
            {t(CITIES.riyadh)}
          </span>
        </div>
        <nav aria-label={t(COPY.utilityNav)} className="flex items-center gap-5">
          <button type="button" onClick={service(ui("sellWithKhazna"), t(COPY.sellText))} className="c-link py-1 hover:text-fg">
            {ui("sellWithKhazna")}
          </button>
          <button type="button" onClick={service(ui("help"), t(COPY.helpText))} className="c-link py-1 hover:text-fg">
            {ui("help")}
          </button>
          <Link href={withLang(pathname, other)} hrefLang={other} lang={other} className="flex items-center gap-1.5 py-1 font-semibold text-fg hover:text-primary">
            <Globe aria-hidden="true" className="size-3.5" />
            {other === "ar" ? "العربية" : "English"}
          </Link>
        </nav>
      </div>
    </div>
  );
}
