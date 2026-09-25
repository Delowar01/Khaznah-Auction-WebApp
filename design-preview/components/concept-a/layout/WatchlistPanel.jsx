"use client";

import { Heart } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { getProduct } from "@/data/products";
import { CompactLot } from "../cards/CompactLot";
import { buttonClass } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { SidePanel } from "../ui/Panels";
import { WatchButton } from "../ui/WatchButton";
import { BrowseLink } from "../utils/navigation";
import { COPY } from "../copy";
import { useChrome } from "./ChromeContext";

/** Watchlist drawer: every saved lot with its live price and clock. */
export function WatchlistPanel() {
  const { t, ui, pl } = useLang();
  const { panel, close } = useChrome();
  const { watched } = useStore();
  const items = [...watched].map(getProduct).filter(Boolean);

  return (
    <SidePanel open={panel === "watchlist"} onClose={close} title={ui("watchlist")} subtitle={pl("lots", items.length)}>
      {items.length ? (
        <ul className="grid gap-1 p-2">
          {items.map((product) => (
            <li key={product.slug} className="flex items-center gap-1">
              <CompactLot product={product} onNavigate={close} className="min-w-0 flex-1" />
              <WatchButton product={product} className="shrink-0 shadow-none" />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={Heart} title={t(COPY.watchlistEmptyTitle)} text={t(COPY.watchlistEmptyText)}>
          <BrowseLink href="/browse" onClick={close} className={buttonClass()}>
            {t(COPY.browseLots)}
          </BrowseLink>
        </EmptyState>
      )}
    </SidePanel>
  );
}
