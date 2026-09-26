"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { R3Root } from "@/components/shared/r3/R3Root";
import { useLiveEvent } from "@/lib/useLiveEvent";
import { COPY } from "./copy";
import { CartDrawer, MyBidsDrawer } from "./Drawers";
import { ActiveAuctions, BuyNowFloor, EndingSoon, FloorCategories, HowBidding, Hosts, Upcoming } from "./Floor";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileBar, MobileSearch, MyBidsPill } from "./Mobile";
import { LiveStage } from "./Stage";
import { FloorProvider, useFloor } from "./state";
import { BidConfirm } from "./Tickets";

function Floor() {
  const { bids } = useFloor();
  // One live-event simulation feeds the switcher, the stage and the live strip.
  const live = useLiveEvent();
  const hasBids = Object.keys(bids).length > 0;
  return (
    <>
      <Header live={live} />
      <MobileBar live={live} />
      <main id="main" tabIndex={-1} className={hasBids ? "pb-20 outline-none md:pb-0" : "outline-none"}>
        <LiveStage live={live} />
        <EndingSoon />
        <ActiveAuctions />
        <Upcoming />
        <BuyNowFloor />
        <FloorCategories />
        <Hosts />
        <HowBidding />
      </main>
      <Footer />
      <MyBidsPill />
      <MobileSearch />
      <MyBidsDrawer />
      <CartDrawer />
      <BidConfirm />
    </>
  );
}

/**
 * Option 4 — Auction Commerce home (Round 3A).
 * One bar with the floor switcher (Live · Ending · Upcoming · Buy Now); the
 * live stage is the hero (previous · now · next); then the ending-soon
 * timeline with bid tickets, active auctions, upcoming, Buy Now (after
 * Upcoming), categories on the floor, hosts on a shared time axis, how
 * bidding works and grades. Phones: sticky switcher + live strip, time
 * buckets and a My bids pill.
 */
export function AuctionHome() {
  const { t } = useLang();
  return (
    <R3Root>
      <FloorProvider>
        <a
          href="#main"
          className="fixed start-3 top-[calc(var(--pbar-h)+8px)] z-[70] -translate-y-[200%] rounded-[8px] bg-primary px-4 py-2.5 ac-sm font-semibold text-on-primary shadow-raised transition-transform focus:translate-y-0"
        >
          {t(COPY.skip)}
        </a>
        <Floor />
      </FloorProvider>
    </R3Root>
  );
}
