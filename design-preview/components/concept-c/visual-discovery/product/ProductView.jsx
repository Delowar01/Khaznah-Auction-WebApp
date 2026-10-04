"use client";

// Option 3 — Visual Discovery: Buy Now Product Detail. Image-forward and
// bright, the Auction Detail's sibling: the photograph large on its tinted
// plate (Buy Now and the discount on it) beside chips, a display title, the
// seller and the rounded price card with the indigo Add to cart pill; then
// the item's story with fact chips and highlight tiles, condition and
// specifications, the seller on navy with delivery tiles, the manifest as
// photo tiles and two discovery lists. Phones: a floating navy pill bar.
import Link from "next/link";
import { Share2 } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useShareLink } from "@/components/shared/auction/hooks";
import { moreFromSeller, relatedFor, useGradeGuide, useProductInfo, usePurchase, useToastsAwayFromPanel } from "@/components/shared/product/hooks";
import { useHomeState } from "@/components/shared/r3/home";
import { GradeGuide } from "../auction/Dialogs";
import { ManifestTiles, SellerDelivery } from "../auction/LotSections";
import { GradePill, cx } from "../ui";
import { Gallery } from "./Gallery";
import { PhoneBar, PriceCard } from "./PriceCard";
import { AboutItem, DiscoveryList, useDiscoveryChips } from "./Story";

// The seller's avatar colour a touch deeper (10 %), so the white initials
// keep 4.5:1 on every seller's tone; the Auction Detail's seller panel reads
// the same field, so it is passed the deeper colour too.
function deeper(hex, by = 0.1) {
  const n = parseInt(hex.slice(1), 16);
  return `#${[16, 8, 0].map((shift) => Math.round(((n >> shift) & 255) * (1 - by)).toString(16).padStart(2, "0")).join("")}`;
}

function Breadcrumbs({ info }) {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 vd-sm text-[var(--vd-muted)]">
        {info.crumbs.map((crumb, i) => (
          <li key={crumb.key} className={cx("flex min-w-0 items-center gap-2", !crumb.href && "max-w-[18rem]")}>
            {i > 0 ? <span aria-hidden="true">·</span> : null}
            {crumb.href ? (
              <Link href={link(crumb.href)} className="vd-link hover:text-[var(--vd-indigo)]">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate font-semibold text-[var(--vd-ink)]">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Sale and lot chips, the display title, the seller, watchers and Share, grade and type. */
function Identity({ product, info, onGradeGuide }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const share = useShareLink();
  return (
    <div className="min-w-0">
      <ul className="flex flex-wrap items-center gap-2">
        <li className="inline-flex h-8 items-center rounded-full bg-[var(--vd-bluegray)] px-3 vd-sm font-semibold text-[var(--vd-indigo)]">{ui("buyNow")}</li>
        {info.quantity ? <li className="inline-flex h-8 items-center rounded-full bg-[var(--vd-ivory)] px-3 vd-sm font-semibold text-[var(--vd-ink)]">{info.quantity}</li> : null}
        <li className="inline-flex h-8 items-center rounded-full border border-[var(--vd-line)] px-3 vd-sm text-[var(--vd-muted)]">
          {ui("lotNumber")}&nbsp;
          <span dir="ltr" className="font-semibold text-[var(--vd-ink)] tabular">
            {info.lot}
          </span>
        </li>
      </ul>
      <h1 className="mt-4 vd-lot-title text-[var(--vd-ink)] text-balance">{info.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5">
        {info.seller ? (
          <Link href={link(info.sellerHref)} className="group inline-flex items-center gap-2.5">
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: info.seller.tone }}>
              {info.seller.monogram}
            </span>
            <span className="vd-md">
              <span className="block vd-xs text-[var(--vd-muted)]">{ui("soldBy")}</span>
              <span className="font-bold text-[var(--vd-ink)] group-hover:underline">{info.sellerName}</span>
            </span>
          </Link>
        ) : null}
        <span className="vd-sm text-[var(--vd-muted)]">{info.watchers}</span>
        <button type="button" onClick={share} className="ms-auto inline-flex h-10 items-center gap-2 rounded-full border border-[var(--vd-line)] bg-white px-4 vd-md font-semibold text-[var(--vd-indigo)] transition-colors hover:bg-[var(--vd-bluegray)]" data-testid="share-button">
          <Share2 aria-hidden="true" className="size-4" strokeWidth={2.2} />
          {ui("share")}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <GradePill grade={product.grade} />
        <button type="button" onClick={onGradeGuide} className="vd-link vd-md font-semibold text-[var(--vd-indigo)]">
          {ui("whatGradeMeans")}
        </button>
        <span className="vd-sm text-[var(--vd-muted)]">{info.typeLine}</span>
      </div>
    </div>
  );
}

export function ProductView({ product }) {
  const { ui } = useLang();
  const { open } = useHomeState();
  const facts = useProductInfo(product);
  const info = facts.seller ? { ...facts, seller: { ...facts.seller, tone: deeper(facts.seller.tone) } } : facts;
  const purchase = usePurchase(product, { openCart: () => open("cart") });
  const detail = useGradeGuide(product);
  useToastsAwayFromPanel();
  const chips = useDiscoveryChips(info);

  return (
    <>
      <div className="vd-container pt-5 dt:pt-7">
        <Breadcrumbs info={info} />
      </div>

      {/* phone: gallery · identity · price card · tablet and desktop: [gallery | identity, price card] */}
      <div className="vd-container mt-5 grid gap-x-8 gap-y-6 [grid-template-areas:'gallery'_'identity'_'buy'] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:[grid-template-areas:'gallery_identity'_'gallery_buy'] dt:mt-6 dt:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] dt:gap-x-12">
        <div className="min-w-0 [grid-area:gallery]">
          <Gallery product={product} title={info.title} purchase={purchase} />
        </div>
        <div className="min-w-0 [grid-area:identity]">
          <Identity product={product} info={info} onGradeGuide={detail.guide.show} />
        </div>
        <div className="min-w-0 [grid-area:buy]">
          <PriceCard info={info} purchase={purchase} />
        </div>
      </div>

      <AboutItem product={product} info={info} purchase={purchase} onGradeGuide={detail.guide.show} />
      <SellerDelivery detail={{ product }} info={info} />
      {product.palletContents ? <ManifestTiles product={product} /> : null}
      <DiscoveryList id="vd-related" title={ui("relatedItems")} href={info.categoryHref} lots={relatedFor(product, 4)} chips={chips} className="mt-14 dt:mt-20" />
      <DiscoveryList id="vd-seller-lots" title={ui("moreFromSeller")} sub={info.sellerName} href={info.sellerHref} lots={moreFromSeller(product, 8)} className="mt-14 pb-14 dt:mt-16 dt:pb-20" />

      <PhoneBar purchase={purchase} />
      <GradeGuide detail={detail} />
    </>
  );
}
