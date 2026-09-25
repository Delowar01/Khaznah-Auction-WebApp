"use client";

import { BadgePercent } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { BuyNowCard } from "../cards/BuyNowCard";
import { SectionHeader } from "../ui/SectionHeader";
import { cx } from "../ui/cx";
import { dealProducts } from "../utils/lots";
import { COPY } from "../copy";

/** Four-across grid of discounted Buy Now lots — larger, boutique cards. */
export function DealsGrid() {
  const { t } = useLang();
  const deals = dealProducts(8);
  return (
    <section aria-labelledby="kb-deals">
      <SectionHeader
        id="kb-deals"
        icon={BadgePercent}
        title={t(COPY.dealsTitle)}
        subtitle={t(COPY.dealsSubtitle)}
        href="/browse?tab=buy_now&has_discount=true"
        hrefLabel={t(COPY.shopAllDeals)}
      />
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {deals.map((product, i) => (
          <li key={product.slug} className={cx(i >= 6 && "md:max-lg:hidden")}>
            <BuyNowCard product={product} sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
