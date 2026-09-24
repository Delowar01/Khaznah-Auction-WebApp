"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, CircleHelp, X } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Logo } from "@/components/shared/brand/Logo";
import { Money } from "@/components/shared/ui/Money";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { CATEGORIES } from "@/data/categories";
import { DEMO_USER } from "@/data/site";
import { withLang } from "@/lib/routes";
import { formatNumber } from "@/lib/format";
import { useCopy } from "../lib/useCopy";
import { useLive } from "../market/MarketProvider";
import { VerifiedMark } from "../ui/SellerAvatar";
import { useChrome, WithSection } from "./ChromeContext";
import { UserInitials } from "./AccountMenu";
import { SECTIONS } from "./nav";

export function MobileMenu() {
  const { menuOpen, closeMenu } = useChrome();
  const { link } = useConcept();
  const { t, ui, lang, isRTL } = useLang();
  const { toast } = useStore();
  const pathname = usePathname();
  const live = useLive();
  const c = useCopy();
  const otherLang = lang === "ar" ? "en" : "ar";

  return (
    <Drawer open={menuOpen} onClose={closeMenu} title={ui("menu")} side="start" panelClassName="bg-bg pt-[var(--pbar-h)] border-e border-line shadow-overlay">
      <div data-testid="mobile-menu" className="flex h-full flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <span className="flex items-center gap-2">
            <Logo variant="mark" decorative className="h-7 w-auto" />
            <Logo variant={isRTL ? "wordmark-ar" : "wordmark-en"} decorative className={isRTL ? "h-5 w-auto" : "h-3 w-auto"} />
          </span>
          <button type="button" onClick={closeMenu} aria-label={ui("closeMenu")} className="grid size-11 place-items-center rounded-control text-fg-2 hover:bg-surface-2 hover:text-fg">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="d-scroll flex-1 overflow-y-auto px-4 pb-6 pt-4">
          <div className="d-panel flex items-center gap-3 p-3">
            <UserInitials className="size-11 text-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">{t(DEMO_USER.name)}</p>
              <VerifiedMark label={c("verifiedBuyer")} />
            </div>
            <div className="text-end">
              <p className="text-[11px] text-fg-3">{ui("wallet")}</p>
              <Money value={DEMO_USER.walletBalance} className="d-num text-sm font-medium text-fg" />
            </div>
          </div>

          <nav aria-label={c("primaryNav")} className="mt-5">
            <WithSection>
              {(active) => (
                <ul className="space-y-1">
                  {SECTIONS.map((section) => (
                    <li key={section.key}>
                      <Link
                        href={link(section.path)}
                        onClick={closeMenu}
                        aria-current={active === section.key ? "page" : undefined}
                        className={`flex h-12 items-center gap-3 rounded-control px-3 text-[15px] font-medium transition-colors ${active === section.key ? "bg-surface-2 text-fg ring-1 ring-inset ring-line" : "text-fg-2 hover:bg-surface-2 hover:text-fg"}`}
                      >
                        <section.icon aria-hidden="true" className="size-[18px]" />
                        <span className="flex-1">{t(section.label)}</span>
                        {section.key === "live" ? (
                          <span className="flex items-center gap-1.5 text-xs text-live">
                            <span aria-hidden="true" className="kz-live-dot" />
                            <span className="d-num">{formatNumber(live?.viewers ?? 0)}</span>
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </WithSection>
          </nav>

          <p className="d-label mb-2 mt-6 px-3 text-fg-3">{ui("categories")}</p>
          <ul className="grid grid-cols-1 gap-0.5">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={link(`/browse?category=${cat.slug}`)}
                  onClick={closeMenu}
                  className="flex h-11 items-center justify-between gap-3 rounded-control px-3 text-sm text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
                >
                  <span>{t(cat.name)}</span>
                  <span className="flex items-center gap-2">
                    <span className="d-num text-xs text-fg-3">{formatNumber(cat.count)}</span>
                    <DirIcon icon={ChevronRight} className="size-4 text-fg-3" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t border-line p-4">
          <Link
            href={withLang(pathname, otherLang)}
            hrefLang={otherLang}
            lang={otherLang}
            onClick={closeMenu}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-control border border-line-strong bg-surface-2 text-sm font-medium text-fg"
          >
            {otherLang === "ar" ? ui("arabic") : "English"}
          </Link>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              toast({ tone: "info", title: ui("help"), description: c("linkElsewhere") });
            }}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-control border border-line-strong bg-surface-2 text-sm font-medium text-fg"
          >
            <CircleHelp aria-hidden="true" className="size-4" />
            {ui("help")}
          </button>
        </div>
      </div>
    </Drawer>
  );
}
