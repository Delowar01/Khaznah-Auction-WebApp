"use client";

import Link from "next/link";
import { Suspense, useId } from "react";
import { usePathname } from "next/navigation";
import { Globe, X } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Img } from "@/components/shared/ui/Img";
import { Logo } from "@/components/shared/brand/Logo";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { CATEGORIES } from "@/data/categories";
import { BRAND, NAV } from "@/data/site";
import { withLang } from "@/lib/routes";
import { COPY } from "../copy";
import { Echo } from "../ui/Bi";
import { Diamond } from "../ui/Diamond";
import { cx } from "../ui/cx";
import { AccountSummary } from "./AccountMenu";
import { DRAWER_PANEL } from "./DrawerPanel";
import { useActiveNav, useSiteLink } from "./nav";

function MenuNav({ active, onClose }) {
  const { t } = useLang();
  const { resolve, onNavigate } = useSiteLink();
  return (
    <ul className="border-t border-line">
      {NAV.map((item) => {
        const isActive = item.key === active;
        return (
          <li key={item.key} className="border-b border-line">
            <Link
              href={resolve(item.href)}
              onClick={onNavigate(item.href, onClose)}
              aria-current={isActive ? "page" : undefined}
              className="flex min-h-16 items-center gap-4 py-3"
            >
              <span className="grid w-3 place-items-center">
                {item.key === "live" ? <Diamond variant="live" size={8} /> : <Diamond size={7} className={cx("text-accent transition-opacity", isActive ? "opacity-100" : "opacity-0")} />}
              </span>
              <span className={cx("flex-1 text-[1.375rem] font-bold leading-tight", isActive ? "text-fg" : "text-fg-2")}>{t(item.label)}</span>
              <Echo content={item.label} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ActiveMenuNav(props) {
  return <MenuNav active={useActiveNav()} {...props} />;
}

/** Full-height menu from the inline-start: large nav, categories, account and language. */
export function MobileMenu({ open, onClose, onWatchlist }) {
  const { t, ui, lang } = useLang();
  const { toast } = useStore();
  const { resolve, onNavigate } = useSiteLink();
  const pathname = usePathname();
  const titleId = useId();
  const other = lang === "ar" ? "en" : "ar";

  return (
    <Drawer open={open} onClose={onClose} side="start" labelledBy={titleId} panelClassName={`w-[min(92vw,420px)]! ${DRAWER_PANEL}`}>
      <div data-testid="mobile-menu" className="flex h-full flex-col bg-bg text-fg">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <Logo variant="lockup" className="c-logo h-9 w-auto" title={t(BRAND.name)} />
          <h2 id={titleId} className="sr-only">
            {ui("menu")}
          </h2>
          <button type="button" onClick={onClose} aria-label={ui("closeMenu")} className="c-iconbtn -me-2 text-fg-2">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <nav aria-label={t(COPY.mainNav)} className="mt-2">
            <Suspense fallback={<MenuNav active={null} onClose={onClose} />}>
              <ActiveMenuNav onClose={onClose} />
            </Suspense>
          </nav>

          <p className="c-caps mb-3 mt-8 text-fg-3">{ui("categories")}</p>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line">
            {CATEGORIES.map((category) => {
              const href = `/browse?category=${category.slug}`;
              return (
                <li key={category.slug}>
                  <Link href={resolve(href)} onClick={onNavigate(href, onClose)} className="flex h-full min-h-16 items-center gap-3 bg-surface p-2.5 hover:bg-surface-2">
                    <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-plate">
                      <Img image={category.cutout} alt="" sizes="44px" className="size-9 object-contain" />
                    </span>
                    <span className="text-sm font-medium leading-snug">{t(category.name)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="c-caps mb-3 mt-8 text-fg-3">{t(COPY.menuAccount)}</p>
          <AccountSummary
            onItem={onClose}
            onWatchlist={() => {
              onClose();
              onWatchlist?.();
            }}
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-sm">
            <Link href={withLang(pathname, other)} hrefLang={other} lang={other} onClick={onClose} className="flex min-h-11 items-center gap-2 font-semibold text-fg">
              <Globe aria-hidden="true" className="size-4" />
              {other === "ar" ? "العربية" : "English"}
            </Link>
            <button type="button" onClick={() => toast({ tone: "info", title: ui("sellWithKhazna"), description: t(COPY.sellText) })} className="min-h-11 text-fg-2 hover:text-fg">
              {ui("sellWithKhazna")}
            </button>
            <button type="button" onClick={() => toast({ tone: "info", title: ui("help"), description: t(COPY.helpText) })} className="min-h-11 text-fg-2 hover:text-fg">
              {ui("help")}
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
