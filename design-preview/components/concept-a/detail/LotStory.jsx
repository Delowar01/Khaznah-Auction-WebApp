"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { getSeller } from "@/lib/catalog";
import { ITEM_TYPES, SOURCE_TYPES } from "@/data/grades";
import { Eyebrow } from "../ui/Type";
import { GradeChip } from "../ui/GradeChip";
import { Specs } from "./Specs";
import { Manifest } from "./Manifest";
import { SellerCard } from "./SellerCard";
import { COPY } from "../copy";

export function StoryBlock({ title, children }) {
  return (
    <div>
      <h3 className="a-eyebrow mb-5 !text-fg">{title}</h3>
      {children}
    </div>
  );
}

/** "About this lot": the catalogue essay — description, highlights, condition, specs, manifest. */
export function LotStory({ product, onGradeGuide, children }) {
  const { t, ui } = useLang();
  const seller = getSeller(product.seller);
  const extraSpecs = [
    { k: ui("lotNumber"), v: product.lot },
    { k: ui("source"), v: t(SOURCE_TYPES[product.source]) },
    { k: ui("itemType"), v: t(ITEM_TYPES[product.itemType]) },
  ];

  return (
    <section aria-labelledby="about-lot" className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-10 px-5 py-16 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-10 lg:py-24">
        <div className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--pbar-h)+120px)]">
            <Eyebrow>{product.lot}</Eyebrow>
            <h2 id="about-lot" className="a-display mt-3 text-[38px] text-fg sm:text-[44px] rtl:text-[36px]">
              {t(COPY.aboutLot)}
            </h2>
            <div className="mt-8 hidden lg:block">
              <SellerCard seller={seller} />
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-14 lg:col-span-8">
          <p className="a-serif text-[22px] leading-[1.5] text-fg sm:text-[25px] rtl:text-[23px] rtl:leading-[1.75]">{t(product.description)}</p>

          {product.highlights?.length ? (
            <StoryBlock title={t(COPY.highlights)}>
              <ol className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
                {product.highlights.map((item, i) => (
                  <li key={i} className="bg-bg p-5">
                    <span dir="ltr" className="a-serif block text-[28px] leading-none text-auction tabular">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-4 block text-[15px] leading-snug text-fg rtl:leading-7">{t(item)}</span>
                  </li>
                ))}
              </ol>
            </StoryBlock>
          ) : null}

          <StoryBlock title={ui("conditionReport")}>
            <div className="flex flex-col gap-5 rounded-card border border-line bg-bg p-6 sm:flex-row sm:items-start">
              <GradeChip grade={product.grade} onClick={onGradeGuide} className="self-start" />
              <div className="min-w-0">
                <p className="text-[15px] leading-relaxed text-fg rtl:leading-8">{t(product.conditionNote)}</p>
                <button type="button" onClick={onGradeGuide} className="mt-3 text-[13px] font-semibold text-fg">
                  <span className="a-link">{ui("whatGradeMeans")}</span>
                </button>
              </div>
            </div>
          </StoryBlock>

          <StoryBlock title={ui("specifications")}>
            <Specs specs={product.specs} extra={extraSpecs} />
          </StoryBlock>

          {product.palletContents ? (
            <StoryBlock title={ui("palletContents")}>
              <Manifest lines={product.palletContents} note={product.saleType === "buy_now" ? ui("fullLotOnly") : undefined} />
            </StoryBlock>
          ) : null}

          {children}

          <div className="lg:hidden">
            <SellerCard seller={seller} />
          </div>
        </div>
      </div>
    </section>
  );
}
