"use client";

import { Hero } from "../home/Hero";
import { NumbersBand } from "../home/NumbersBand";
import { ClosingSoon } from "../home/ClosingSoon";
import { Departments } from "../home/Departments";
import { LiveBand } from "../home/LiveBand";
import { ReadyToOwn } from "../home/ReadyToOwn";
import { GradeFeature } from "../home/GradeFeature";
import { PalletsFeature } from "../home/PalletsFeature";
import { SellersFeature } from "../home/SellersFeature";
import { HowItWorks } from "../home/HowItWorks";
import { Newsletter } from "../home/Newsletter";

export function HomePage() {
  return (
    <>
      <Hero />
      <NumbersBand />
      <ClosingSoon />
      <Departments />
      <LiveBand />
      <ReadyToOwn />
      <GradeFeature />
      <PalletsFeature />
      <SellersFeature />
      <HowItWorks />
      <Newsletter />
    </>
  );
}
