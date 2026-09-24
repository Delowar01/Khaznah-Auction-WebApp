"use client";

import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Container } from "../ui/Layout";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { useCopy } from "../lib/useCopy";
import { SearchField } from "./SearchField";

const TITLE = { all: "browseTitleAll", auction: "browseTitleAuction", buy_now: "browseTitleBuy" };

/** Title band: breadcrumb, h1 (follows the sale type), live count and search. */
export function BrowseHeader({ browse }) {
  const { link } = useConcept();
  const { ui, pl } = useLang();
  const c = useCopy();
  return (
    <div className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="d-dotgrid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="d-glow pointer-events-none absolute -top-40 end-0 size-[520px]" />
      <Container className="relative flex flex-col gap-6 py-8 md:py-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Breadcrumbs items={[{ label: ui("home"), href: link("/") }, { label: ui("browse") }]} />
          <h1 className="d-tight mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-semibold text-fg md:text-4xl">
            {c(TITLE[browse.state.tab] || "browseTitleAll")}
            <span className="d-num text-base font-normal text-fg-3 md:text-lg" aria-live="polite">
              {pl("results", browse.total)}
            </span>
          </h1>
          <p className="mt-2 max-w-xl text-[15px] text-fg-2">{c("browseText")}</p>
        </div>
        <SearchField
          value={browse.state.search}
          onSearch={browse.setSearch}
          placeholder={ui("searchPlaceholder")}
          label={ui("search")}
          className="w-full lg:max-w-md"
        />
      </Container>
    </div>
  );
}
