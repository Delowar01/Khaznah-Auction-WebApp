"use client";

import { BadgeCheck, Lock } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { COPY } from "../copy";
import { EyebrowRule } from "../ui/Section";
import { InfoRows } from "./DetailBlocks";

/** Delivery, pickup and returns, with the two trust promises beneath. */
export function DeliveryBlock({ product }) {
  const { t, ui } = useLang();
  return (
    <section aria-labelledby="delivery-title">
      <EyebrowRule content={COPY.deliveryTitle} className="mb-2" />
      <h2 id="delivery-title" className="sr-only">
        {t(COPY.deliveryTitle)}
      </h2>
      <InfoRows product={product} />
      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-fg">
        <span className="flex items-center gap-2">
          <BadgeCheck aria-hidden="true" className="size-4 text-success" />
          {ui("inspected")}
        </span>
        <span className="flex items-center gap-2">
          <Lock aria-hidden="true" className="size-4 text-primary" />
          {ui("securePayment")}
        </span>
      </div>
    </section>
  );
}
