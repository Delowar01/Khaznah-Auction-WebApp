"use client";

import { useState } from "react";
import { useBrowse } from "@/lib/useBrowse";
import { LiveTicker } from "../layout/LiveTicker";
import { Container } from "../ui/Layout";
import { BrowseHeader } from "../browse/BrowseHeader";
import { BrowseToolbar } from "../browse/BrowseToolbar";
import { ActiveFilters } from "../browse/ActiveFilters";
import { FilterPanel } from "../browse/FilterPanel";
import { FilterDrawer } from "../browse/FilterDrawer";
import { Results } from "../browse/Results";
import { UrlSync } from "../browse/UrlSync";
import { useLang } from "@/components/shared/providers/LangProvider";

export function BrowsePage() {
  const browse = useBrowse({ pageSize: 12 });
  const { ui } = useLang();
  const [view, setView] = useState("grid");
  const [panelOpen, setPanelOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <UrlSync browse={browse} />
      <LiveTicker />
      <BrowseHeader browse={browse} />
      <Container className={`grid gap-8 py-8 md:py-10 ${panelOpen ? "lg:grid-cols-[264px_minmax(0,1fr)]" : ""}`}>
        {panelOpen ? (
          <aside aria-label={ui("filters")} className="hidden lg:block">
            <div className="d-scroll sticky top-[calc(var(--pbar-h)+124px)] max-h-[calc(100dvh-var(--pbar-h)-140px)] overflow-y-auto pe-1">
              <FilterPanel browse={browse} header />
            </div>
          </aside>
        ) : null}
        <div className="min-w-0">
          <BrowseToolbar
            browse={browse}
            view={view}
            onView={setView}
            panelOpen={panelOpen}
            onTogglePanel={() => setPanelOpen((v) => !v)}
            onOpenDrawer={() => setDrawerOpen(true)}
          />
          <h2 className="sr-only">{ui("results")}</h2>
          <ActiveFilters browse={browse} />
          <Results browse={browse} view={view} dense={!panelOpen} caption={ui("results")} />
        </div>
      </Container>
      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} browse={browse} />
    </>
  );
}
