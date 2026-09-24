"use client";

import { LiveTicker } from "../layout/LiveTicker";
import { Hero } from "../home/Hero";
import { ClosingBoard } from "../home/ClosingBoard";
import { LiveEvents } from "../home/LiveEvents";
import { Trending } from "../home/Trending";
import { CategoryTiles } from "../home/CategoryTiles";
import { InstantBuy } from "../home/InstantBuy";
import { BulkPallets } from "../home/BulkPallets";
import { Warehouses } from "../home/Warehouses";
import { Platform } from "../home/Platform";
import { Newsletter } from "../home/Newsletter";

export function HomePage() {
  return (
    <>
      <LiveTicker />
      <Hero />
      <ClosingBoard />
      <LiveEvents />
      <Trending />
      <CategoryTiles />
      <InstantBuy />
      <BulkPallets />
      <Warehouses />
      <Platform />
      <Newsletter />
    </>
  );
}
