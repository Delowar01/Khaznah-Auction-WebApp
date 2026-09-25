"use client";

import { useState } from "react";
import { House, LayoutGrid, Menu, Radio, ShoppingCart, UserRound } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useBrowse } from "@/lib/useBrowse";
import { CompactLot } from "../cards/CompactLot";
import { useChrome } from "../layout/ChromeContext";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { Panel, Specimen } from "./SystemSection";

function TabBarPreview() {
  const { ui } = useLang();
  const items = [
    { key: "home", icon: House, label: ui("home"), active: true },
    { key: "cats", icon: LayoutGrid, label: ui("categories") },
    { key: "live", icon: Radio, label: ui("live"), dot: true },
    { key: "cart", icon: ShoppingCart, label: ui("cart") },
    { key: "account", icon: UserRound, label: ui("account") },
  ];
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-[360px] overflow-hidden rounded-[28px] border-[6px] border-line-strong bg-bg">
      <div className="grid grid-cols-2 gap-2 p-3">
        <span className="block aspect-[4/3] rounded-lg bg-surface-2 ring-1 ring-line" />
        <span className="block aspect-[4/3] rounded-lg bg-surface-2 ring-1 ring-line" />
      </div>
      <div className="grid h-[60px] grid-cols-5 border-t border-line bg-surface">
        {items.map((item) => (
          <span key={item.key} className={cx("flex flex-col items-center justify-center gap-1 kb-2xs font-semibold", item.active ? "text-primary" : "text-fg-3")}>
            <span className="relative">
              <item.icon className="size-5" strokeWidth={1.75} />
              {item.dot ? <span className="kz-live-dot absolute! -end-0.5 -top-0.5 ring-2 ring-surface" /> : null}
            </span>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Pagination, progressive loading, breadcrumbs and the mobile menu / tab bar. */
export function NavigationDemos() {
  const { t, ui } = useLang();
  const { open } = useChrome();
  const [page, setPage] = useState(2);
  const browse = useBrowse({ pageSize: 3, syncUrl: false, initial: { tab: "buy_now" } });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel className="grid content-start gap-6">
        <Specimen label={t(COPY.pagination)}>
          <Pagination page={page} pageCount={4} onChange={setPage} className="justify-start" />
        </Specimen>
        <Specimen label={ui("breadcrumb")}>
          <Breadcrumbs items={[{ label: ui("home"), href: "#" }, { label: ui("browse"), href: "#" }, { label: ui("allLots") }]} />
        </Specimen>
        <Specimen label={t(COPY.loadMoreDemo)}>
          <ul className="grid gap-1 rounded-xl border border-line p-2">
            {browse.shownItems.map((product) => (
              <li key={product.slug}>
                <CompactLot product={product} />
              </li>
            ))}
          </ul>
          <p className="kb-xs text-fg-3">{ui("showingOf", { shown: browse.shownItems.length, total: browse.total })}</p>
          <Button variant="outline" block loading={browse.loadingMore} disabled={!browse.hasMore} onClick={browse.loadMore}>
            {ui("loadMore")}
          </Button>
        </Specimen>
      </Panel>
      <Panel className="grid content-start gap-6">
        <Specimen label={t(COPY.openMobileMenu)}>
          <Button icon={Menu} variant="soft" onClick={() => open("menu")} className="w-fit">
            {t(COPY.openMobileMenu)}
          </Button>
        </Specimen>
        <Specimen label={t(COPY.mobileTabBar)}>
          <TabBarPreview />
        </Specimen>
      </Panel>
    </div>
  );
}
