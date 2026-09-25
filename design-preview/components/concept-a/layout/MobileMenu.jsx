"use client";

import Link from "next/link";
import { ChevronRight, CircleHelp, Gavel, Globe, LifeBuoy, Package, ShoppingBag, Store, Timer, Warehouse } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { Logo } from "@/components/shared/brand/Logo";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { CATEGORIES } from "@/data/categories";
import { Button } from "../ui/Button";
import { SidePanel } from "../ui/Panels";
import { Plate } from "../ui/Plate";
import { BrowseLink } from "../utils/navigation";
import { COPY } from "../copy";
import { AccountSummary } from "./AccountMenu";
import { LanguageLink } from "./ChromeBits";
import { useChrome } from "./ChromeContext";
import { CityPicker } from "./DeliverTo";

const ROW = "flex h-12 items-center gap-3 rounded-lg px-3 kb-md font-semibold text-fg transition-colors hover:bg-surface-2";

function Section({ title, children }) {
  return (
    <section className="border-t border-line px-3 py-4">
      <h3 className="mb-2 px-3 kb-eyebrow text-fg-3">{title}</h3>
      {children}
    </section>
  );
}

/** Off-canvas menu for phones and tablets (opens from the start edge). */
export function MobileMenu() {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { toast } = useStore();
  const { panel, close, signedIn, open } = useChrome();

  const nav = [
    { key: "live", href: "/live-auction", label: ui("liveNow"), live: true },
    { key: "auctions", href: "/browse?tab=auction", label: ui("auctions"), icon: Gavel },
    { key: "buy", href: "/browse?tab=buy_now", label: ui("buyNow"), icon: ShoppingBag },
    { key: "ending", href: "/browse?ending=1h", label: ui("endingSoon"), icon: Timer },
    { key: "bulk", href: "/browse?category=bulk-pallets", label: ui("bulkLots"), icon: Package },
    { key: "sellers", href: "/seller", label: ui("sellers"), icon: Store },
  ];

  return (
    <SidePanel
      open={panel === "menu"}
      onClose={close}
      side="start"
      title={ui("menu")}
      testId="mobile-menu"
      headerStart={<Logo variant="mark" decorative className="h-7 w-auto" />}
    >
      <div className="p-4">
        {signedIn ? (
          <AccountSummary className="rounded-xl border border-line bg-surface-2 p-3" />
        ) : (
          <Button block onClick={() => open("signin")}>
            {ui("signIn")}
          </Button>
        )}
      </div>

      <nav aria-label={t(COPY.mainNav)} className="px-3 pb-4">
        <ul className="grid gap-0.5">
          {nav.map((item) => {
            const content = (
              <>
                {item.live ? (
                  <span className="grid size-5 place-items-center">
                    <span aria-hidden="true" className="kz-live-dot" />
                  </span>
                ) : (
                  <item.icon aria-hidden="true" className="size-5 text-primary" />
                )}
                <span className="flex-1">{item.label}</span>
                <DirIcon icon={ChevronRight} className="size-4 text-fg-3" />
              </>
            );
            return (
              <li key={item.key}>
                {item.href.startsWith("/browse") ? (
                  <BrowseLink href={item.href} onClick={close} className={ROW}>
                    {content}
                  </BrowseLink>
                ) : (
                  <Link href={link(item.href)} onClick={close} className={ROW}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
          <li>
            <Link href={`${link("/")}#how-it-works`} onClick={close} className={ROW}>
              <CircleHelp aria-hidden="true" className="size-5 text-primary" />
              <span className="flex-1">{ui("howItWorks")}</span>
              <DirIcon icon={ChevronRight} className="size-4 text-fg-3" />
            </Link>
          </li>
        </ul>
      </nav>

      <Section title={ui("categories")}>
        <ul className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <BrowseLink
                href={`/browse?category=${category.slug}`}
                onClick={close}
                className="flex h-14 items-center gap-2.5 rounded-lg border border-line p-1.5 pe-2 transition-colors hover:border-line-strong"
              >
                <Plate image={category.image} alt="" sizes="44px" pad="p-1" className="size-10 shrink-0 rounded-md" />
                <span className="line-clamp-2 kb-xs font-semibold text-fg">{t(category.name)}</span>
              </BrowseLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={ui("deliverTo")}>
        <div className="px-1.5">
          <CityPicker name="kb-city-mobile" />
        </div>
      </Section>

      <Section title={ui("help")}>
        <div className="grid gap-0.5">
          <button type="button" className={ROW} onClick={() => toast({ tone: "info", title: ui("sellWithKhazna"), description: t(COPY.sellText) })}>
            <Warehouse aria-hidden="true" className="size-5 text-fg-3" />
            {ui("sellWithKhazna")}
          </button>
          <button type="button" className={ROW} onClick={() => toast({ tone: "info", title: ui("help"), description: t(COPY.helpText) })}>
            <LifeBuoy aria-hidden="true" className="size-5 text-fg-3" />
            {ui("help")}
          </button>
          <LanguageLink className={ROW} onNavigate={close}>
            <Globe aria-hidden="true" className="size-5 text-fg-3" />
          </LanguageLink>
        </div>
      </Section>
    </SidePanel>
  );
}
