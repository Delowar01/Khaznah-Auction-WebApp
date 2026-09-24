// Section navigation shared by the tab row, the mobile dock and the menu.
import { Compass, Gavel, Radio, ShoppingBag, Warehouse } from "lucide-react";
import { COPY } from "../copy";
import { UI } from "@/data/ui";

export const SECTIONS = [
  { key: "discover", path: "/", label: COPY.discover, icon: Compass },
  { key: "auctions", path: "/browse?tab=auction", label: UI.auctions, icon: Gavel },
  { key: "live", path: "/live-auction", label: UI.live, icon: Radio },
  { key: "buy-now", path: "/browse?tab=buy_now", label: UI.buyNow, icon: ShoppingBag },
  { key: "sellers", path: "/seller", label: UI.sellers, icon: Warehouse },
];
