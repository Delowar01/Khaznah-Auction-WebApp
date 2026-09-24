"use client";

import { useState } from "react";
import { Menu, SlidersHorizontal } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useBrowse } from "@/lib/useBrowse";
import { COPY } from "../copy";
import { FilterDrawer } from "../browse/FilterDrawer";
import { Pagination } from "../browse/Pagination";
import { LoadMore } from "../browse/Results";
import { MobileMenu } from "../layout/MobileMenu";
import { Button } from "../ui/Button";
import { StateLabel } from "./SystemSection";

/** Filter drawer, pagination / load more and the mobile menu. */
export function NavigationBoard() {
  const { t } = useLang();
  const browse = useBrowse({ syncUrl: false });
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);

  const more = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-md border border-line bg-surface p-6">
        <StateLabel>{t(COPY.drawerDemo)}</StateLabel>
        <Button variant="outline" icon={SlidersHorizontal} onClick={() => setDrawer(true)}>
          {t(COPY.openDrawer)}
        </Button>
        <FilterDrawer open={drawer} onClose={() => setDrawer(false)} browse={browse} />
      </div>
      <div className="rounded-md border border-line bg-surface p-6">
        <StateLabel>{t(COPY.menuDemo)}</StateLabel>
        <Button variant="outline" icon={Menu} onClick={() => setMenu(true)}>
          {t(COPY.openMenuDemo)}
        </Button>
        <MobileMenu open={menu} onClose={() => setMenu(false)} />
      </div>
      <div className="rounded-md border border-line bg-surface p-6 lg:row-span-2">
        <StateLabel>{t(COPY.paginationDemo)}</StateLabel>
        <Pagination page={page} pageCount={3} onChange={setPage} />
        <div className="-mt-4">
          <LoadMore shown={12} total={29} hasMore loading={loading} onMore={more} />
        </div>
      </div>
    </div>
  );
}
