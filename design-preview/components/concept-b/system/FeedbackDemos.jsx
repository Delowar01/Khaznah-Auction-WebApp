"use client";

import { useState } from "react";
import { Bell, CircleCheck, Info, SlidersHorizontal, TriangleAlert } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { getProduct } from "@/data/products";
import { DEMO_USER } from "@/data/site";
import { useBrowse } from "@/lib/useBrowse";
import { ConfirmBidModal } from "../auction/AuctionDialogs";
import { FacetPanel } from "../browse/FacetPanel";
import { SortListbox } from "../browse/SortControls";
import { Button } from "../ui/Button";
import { SidePanel } from "../ui/Panels";
import { COPY } from "../copy";
import { Panel, Specimen } from "./SystemSection";

const TV = getProduct("tv-43");
const DEMO_AUCTION = { remaining: 2 * 3600, deposit: { walletBalance: DEMO_USER.walletBalance } };

/** Toast triggers, confirmation modal, dropdown and filter drawer. */
export function FeedbackDemos() {
  const { t, ui, money } = useLang();
  const { toast } = useStore();
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [sort, setSort] = useState("recommended");
  const browse = useBrowse({ pageSize: 8, syncUrl: false });
  const title = t(TV.title);

  const toasts = [
    { key: "success", icon: CircleCheck, copy: COPY.toastSuccess, payload: { tone: "success", title: ui("bidPlaced"), description: money(TV.currentBid + TV.increment) } },
    { key: "warning", icon: TriangleAlert, copy: COPY.toastWarning, payload: { tone: "warning", title: ui("youAreOutbid"), description: ui("outbidToast", { amount: money(TV.currentBid + TV.increment * 2) }) } },
    { key: "info", icon: Info, copy: COPY.toastInfo, payload: { tone: "info", title: ui("timeExtended"), description: ui("antiSnipe") } },
    { key: "neutral", icon: Bell, copy: COPY.toastNeutral, payload: { tone: "neutral", title: ui("addedToWatchlist"), description: title } },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      <Panel>
        <Specimen label={t(COPY.sysToasts)}>
          <div className="grid gap-2 sm:grid-cols-2">
            {toasts.map((item) => (
              <Button key={item.key} variant="outline" icon={item.icon} onClick={() => toast(item.payload)} className="justify-start">
                {t(item.copy)}
              </Button>
            ))}
          </div>
        </Specimen>
      </Panel>
      <Panel className="flex flex-wrap content-start gap-x-10 gap-y-6">
        <Specimen label={ui("confirmYourBid")}>
          <Button onClick={() => setModal(true)} className="w-fit">
            {t(COPY.openModal)}
          </Button>
        </Specimen>
        <Specimen label={ui("filters")}>
          <Button variant="soft" icon={SlidersHorizontal} onClick={() => setDrawer(true)} className="w-fit">
            {t(COPY.openDrawer)}
          </Button>
        </Specimen>
        <Specimen label={ui("sortBy")}>
          <SortListbox value={sort} onChange={setSort} className="w-fit" />
        </Specimen>
      </Panel>

      <ConfirmBidModal
        open={modal}
        amount={TV.currentBid + TV.increment}
        product={TV}
        auction={DEMO_AUCTION}
        onCancel={() => setModal(false)}
        onConfirm={() => {
          setModal(false);
          toast({ tone: "success", title: ui("bidPlaced"), description: money(TV.currentBid + TV.increment) });
        }}
      />
      <SidePanel open={drawer} onClose={() => setDrawer(false)} title={ui("filters")} subtitle={ui("showResults", { n: browse.total })}>
        <div className="px-3 pb-6">
          <FacetPanel browse={browse} name="system" />
        </div>
      </SidePanel>
    </div>
  );
}
