"use client";

import { X } from "lucide-react";
import { Drawer } from "@/components/shared/ui/Drawer";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Button } from "../ui/Button";
import { FilterPanel } from "./FilterPanel";

/** Bottom-sheet filters for phones and tablets. */
export function FilterDrawer({ open, onClose, browse, sellerMode = false }) {
  const { ui } = useLang();
  return (
    <Drawer open={open} onClose={onClose} title={ui("filters")} side="bottom" panelClassName="rounded-t-2xl border-t border-line-strong bg-elevated shadow-overlay">
      <div data-testid="filter-drawer" className="flex max-h-[88dvh] flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-2">
          <span aria-hidden="true" className="absolute inset-x-0 top-2 mx-auto h-1 w-10 rounded-full bg-line-strong" />
          <p className="pt-2 text-base font-semibold text-fg">{ui("filters")}</p>
          <button type="button" onClick={onClose} aria-label={ui("close")} className="grid size-11 place-items-center rounded-control text-fg-2 hover:bg-surface-2 hover:text-fg">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="d-scroll min-h-0 flex-1 overflow-y-auto px-4">
          <FilterPanel browse={browse} sellerMode={sellerMode} />
        </div>
        <div className="grid shrink-0 grid-cols-[auto_1fr] gap-2 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="secondary" size="lg" onClick={browse.clearAll} disabled={!browse.active.length}>
            {ui("clearAll")}
          </Button>
          <Button variant="primary" size="lg" onClick={onClose}>
            {ui("showResults", { n: browse.total })}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
