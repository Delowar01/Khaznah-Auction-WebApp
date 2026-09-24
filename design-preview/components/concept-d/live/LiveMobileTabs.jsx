"use client";

import { useId, useState } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Tabs, TabPanel } from "../ui/Tabs";
import { useCopy } from "../lib/useCopy";
import { LotQueue } from "./LotQueue";
import { ActivityFeed } from "./ActivityFeed";

/** Phones and tablets: Queue / Activity under the stage. */
export function LiveMobileTabs({ live, className = "" }) {
  const { ui } = useLang();
  const c = useCopy();
  const baseId = `live-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [tab, setTab] = useState("activity");
  const tabs = [
    { key: "activity", label: ui("activity"), count: live.feed.length || null },
    { key: "queue", label: c("lotQueue"), count: live.items.length },
  ];
  return (
    <div className={className}>
      <Tabs baseId={baseId} tabs={tabs} value={tab} onChange={setTab} label={c("liveRoom")} fill />
      <div className="pt-4">
        <TabPanel baseId={baseId} tabKey="activity" active={tab === "activity"}>
          <ActivityFeed feed={live.feed} limit={10} />
        </TabPanel>
        <TabPanel baseId={baseId} tabKey="queue" active={tab === "queue"}>
          <LotQueue live={live} />
        </TabPanel>
      </div>
    </div>
  );
}
