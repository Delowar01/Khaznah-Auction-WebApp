"use client";

import Link from "next/link";
import { useId } from "react";
import { Bookmark } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { Money } from "@/components/shared/ui/Money";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { UI } from "@/data/ui";
import { detailPath, getProduct, isAuction } from "@/lib/catalog";
import { COPY } from "../copy";
import { PlateImage } from "../ui/Frame";
import { CountdownText } from "../ui/Time";
import { useLotClock } from "../cards/lotState";
import { DRAWER_PANEL, DrawerPanel } from "./DrawerPanel";

function WatchRow({ product, onNavigate }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  const { toggleWatch } = useStore();
  const { open, remaining, urgency } = useLotClock(product);
  const auction = isAuction(product);
  return (
    <li className="flex gap-4 py-4 first:pt-0">
      <PlateImage image={product.images[0]} alt="" sizes="80px" className="size-20 shrink-0" />
      <div className="min-w-0 flex-1">
        <Link href={link(detailPath(product))} onClick={onNavigate} className="c-link line-clamp-2 font-medium text-fg">
          {t(product.title)}
        </Link>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-fg-3">{ui(auction ? "currentBid" : "price")}</p>
            <Money value={auction ? product.currentBid : product.price} className="c-num font-semibold" />
          </div>
          {auction && open ? <CountdownText seconds={remaining} urgency={urgency} className="c-num text-sm font-semibold" /> : null}
        </div>
        <button type="button" onClick={() => toggleWatch(product.slug)} className="c-link mt-2 text-sm text-fg-2 hover:text-danger">
          {ui("removeFromWatchlist")}
        </button>
      </div>
    </li>
  );
}

/** Watchlist drawer — the lots the customer follows. */
export function WatchlistDrawer({ open, onClose }) {
  const { t } = useLang();
  const { watched } = useStore();
  const titleId = useId();
  const products = [...watched].map(getProduct).filter(Boolean);

  return (
    <Drawer open={open} onClose={onClose} side="end" labelledBy={titleId} panelClassName={DRAWER_PANEL}>
      <DrawerPanel titleId={titleId} title={UI.watchlist} count={products.length || null} onClose={onClose}>
        {products.length ? (
          <ul className="divide-y divide-line">
            {products.map((product) => (
              <WatchRow key={product.slug} product={product} onNavigate={onClose} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="grid size-16 place-items-center rounded-md border border-line bg-surface-2 text-fg-3">
              <Bookmark aria-hidden="true" className="size-7" strokeWidth={1.5} />
            </span>
            <p className="mt-5 font-semibold text-fg">{t(COPY.watchEmpty)}</p>
            <p className="mt-1 max-w-64 text-sm text-fg-2">{t(COPY.watchEmptyText)}</p>
          </div>
        )}
      </DrawerPanel>
    </Drawer>
  );
}
