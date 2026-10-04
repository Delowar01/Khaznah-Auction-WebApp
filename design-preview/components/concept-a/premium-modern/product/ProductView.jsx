"use client";

// Option 2 — Premium Modern: Buy Now Product Detail. Editorial and warm,
// the Auction Detail's sibling: a large gallery on stone beside a brass-dash
// eyebrow, the title, a hairline status row (stock, watchers, Save, Share)
// and the charcoal purchase console; then a stone band about the item,
// the seller beside delivery and payment, the manifest of a pallet, and
// two lists of lots. Phones: gallery, title, status, the console, and an
// ivory Add to cart bar.
import Link from "next/link";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { moreFromSeller, relatedFor, useGradeGuide, useProductInfo, usePurchase, useToastsAwayFromPanel } from "@/components/shared/product/hooks";
import { useHomeState } from "@/components/shared/r3/home";
import { GradeGuide } from "../auction/Dialogs";
import { Gallery } from "../auction/Gallery";
import { Manifest } from "../auction/LotSections";
import { GradePill, cx } from "../ui";
import { Console, PhoneBar, StatusRow } from "./Purchase";
import { AboutBand, LotList, SellerNotes } from "./Sections";

function Breadcrumbs({ info }) {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-xs text-fg-2">
        {info.crumbs.map((crumb, i) => (
          <li key={crumb.key} className={cx("flex min-w-0 items-center gap-2", !crumb.href && "max-w-[18rem]")}>
            {i > 0 ? (
              <span aria-hidden="true" className="text-[#b9b4aa]">
                /
              </span>
            ) : null}
            {crumb.href ? (
              <Link href={link(crumb.href)} className="pr-link">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate text-fg">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Eyebrow (Buy Now and the lot number), the H1, seller, type and grade. */
function Identity({ product, info, onGradeGuide }) {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <div className="min-w-0">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span aria-hidden="true" className="pr-dash" />
        <span className="pr-eyebrow text-[#4a4d57]">{ui("buyNow")}</span>
        <span className="pr-xs text-fg-2">
          {ui("lotNumber")}{" "}
          <span dir="ltr" className="tabular">
            {info.lot}
          </span>
        </span>
      </p>
      <h1 className="mt-3 pr-lot-title text-fg text-balance">{info.title}</h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 pr-md text-fg-2">
        {info.seller ? (
          <span>
            {ui("soldBy")}{" "}
            <Link href={link(info.sellerHref)} className="pr-link font-medium text-[var(--pr-bronze)]">
              {info.sellerName}
            </Link>
          </span>
        ) : null}
        <span>{info.quantity || info.typeLine}</span>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <GradePill grade={product.grade} />
        <button type="button" onClick={onGradeGuide} className="pr-link pr-md font-medium text-[var(--pr-bronze)]">
          {ui("whatGradeMeans")}
        </button>
      </div>
    </div>
  );
}

export function ProductView({ product }) {
  const { ui } = useLang();
  const { open } = useHomeState();
  const info = useProductInfo(product);
  const purchase = usePurchase(product, { openCart: () => open("cart") });
  const detail = useGradeGuide(product);
  useToastsAwayFromPanel();

  return (
    <>
      <div className="pr-container pt-5 dt:pt-7">
        <Breadcrumbs info={info} />
      </div>

      {/* phone: gallery · identity · status · console
          tablet: identity over [gallery | status + console]
          desktop: [gallery | identity, status, console] */}
      <div className="pr-container mt-5 grid gap-x-8 gap-y-6 [grid-template-areas:'gallery'_'identity'_'buy'] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:[grid-template-areas:'identity_identity'_'gallery_buy'] dt:mt-7 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:grid-rows-[auto_1fr] dt:gap-x-14 dt:[grid-template-areas:'gallery_identity'_'gallery_buy']">
        <div className="min-w-0 [grid-area:gallery]">
          <Gallery product={product} title={info.title} />
        </div>
        <div className="min-w-0 [grid-area:identity]">
          <Identity product={product} info={info} onGradeGuide={detail.guide.show} />
        </div>
        <div className="grid min-w-0 content-start gap-5 [grid-area:buy]">
          <StatusRow product={product} info={info} purchase={purchase} />
          <Console info={info} purchase={purchase} />
        </div>
      </div>

      <AboutBand product={product} info={info} purchase={purchase} onGradeGuide={detail.guide.show} />
      <SellerNotes product={product} info={info} />
      {product.palletContents ? <Manifest product={product} /> : null}
      <LotList id="pr-related" title={ui("relatedItems")} href={info.categoryHref} lots={relatedFor(product, 4)} />
      <LotList id="pr-seller-lots" title={ui("moreFromSeller")} sub={info.sellerName} href={info.sellerHref} lots={moreFromSeller(product, 8)} />

      <PhoneBar info={info} purchase={purchase} />
      <GradeGuide detail={detail} />
    </>
  );
}
