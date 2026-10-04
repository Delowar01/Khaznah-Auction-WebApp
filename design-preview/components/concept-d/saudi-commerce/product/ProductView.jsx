"use client";

// Option 4 — Contemporary Saudi Commerce: Buy Now Product Detail. A
// straightforward retail page, the Auction Detail's sibling: a cream band
// carries the breadcrumb, Buy Now tag, title, seller and grade; below, the
// calm gallery and the item's sections run beside a framed purchase panel
// that stays in view (sage head, price and stock, quantity, green Add to
// cart); three sage blocks for condition, seller and delivery, the
// description and tables, the manifest, related items and the seller's
// other lots. Phones: the panel under the gallery and a white Add to cart
// bar.
import Link from "next/link";
import { Heart, Share2, Tag } from "lucide-react";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useShareLink } from "@/components/shared/auction/hooks";
import { moreFromSeller, relatedFor, useGradeGuide, useProductInfo, usePurchase, useToastsAwayFromPanel } from "@/components/shared/product/hooks";
import { useHomeState, useSaveToggle } from "@/components/shared/r3/home";
import { GradeGuide } from "../auction/Dialogs";
import { Gallery } from "../auction/Gallery";
import { InfoBlocks, ManifestTable } from "../auction/LotSections";
import { Arrow, GradePill } from "../ui";
import { PhoneBar, PurchasePanel } from "./Purchase";
import { AboutItem, LotList } from "./Sections";

function Breadcrumbs({ info }) {
  const { ui } = useLang();
  const { link } = useConcept();
  return (
    <nav aria-label={ui("breadcrumb")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 sc-sm text-[var(--sc-muted)]">
        {info.crumbs.map((crumb, i) => (
          <li key={crumb.key} className="flex min-w-0 items-center gap-2">
            {i > 0 ? (
              <span aria-hidden="true">
                <Arrow className="size-3.5" />
              </span>
            ) : null}
            {crumb.href ? (
              <Link href={link(crumb.href)} className="sc-link text-[var(--sc-link)]">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="max-w-[18rem] truncate text-[var(--sc-ink)]">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const FRAMED = "inline-flex h-11 items-center justify-center gap-2 rounded-[7px] border border-[var(--sc-line)] bg-white px-4 sc-md font-semibold text-[var(--sc-ink)] transition-colors hover:border-[var(--sc-green)]";

/** Save to the watchlist (heart), framed like Share beside it. */
function SaveButton({ product }) {
  const { ui } = useLang();
  const { saved, toggle, label } = useSaveToggle(product);
  return (
    <button type="button" onClick={toggle} aria-pressed={saved} aria-label={label} className={FRAMED} data-testid="watch-button">
      <Heart aria-hidden="true" className={saved ? "size-5 fill-[var(--sc-green)] text-[var(--sc-green)]" : "size-5"} strokeWidth={1.8} />
      <span className="hidden sm:inline">{saved ? ui("watching") : ui("watch")}</span>
    </button>
  );
}

/** Cream band: breadcrumb, Buy Now tag and lot number, title, seller and grade, Save and Share. */
function ProductBand({ product, info, onGradeGuide }) {
  const { ui } = useLang();
  const { link } = useConcept();
  const share = useShareLink();
  return (
    <section aria-labelledby="sc-product-title" className="border-b border-[var(--sc-line)] bg-[var(--sc-cream)]/55">
      <div className="sc-container pb-6 pt-5 dt:pb-7 dt:pt-6">
        <Breadcrumbs info={info} />
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sc-md text-[var(--sc-muted)]">
              <span className="inline-flex h-[26px] items-center gap-1.5 rounded-[6px] bg-[var(--sc-soft)] px-2.5 sc-sm font-semibold text-[var(--sc-green)] ring-1 ring-inset ring-[var(--sc-sage)]">
                <Tag aria-hidden="true" className="size-3.5" strokeWidth={2} />
                {ui("buyNow")}
              </span>
              {info.quantity ? <span className="inline-flex h-[26px] items-center rounded-[6px] bg-white px-2.5 sc-sm font-semibold text-[var(--sc-ink)]">{info.quantity}</span> : null}
              <span>
                {ui("lotNumber")}{" "}
                <span dir="ltr" className="font-semibold text-[var(--sc-ink)] tabular">
                  {info.lot}
                </span>
              </span>
            </p>
            <h1 id="sc-product-title" className="mt-3 sc-lot-title text-[var(--sc-ink)] text-balance">
              {info.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sc-md text-[var(--sc-muted)]">
              {info.seller ? (
                <span>
                  {ui("soldBy")}{" "}
                  <Link href={link(info.sellerHref)} className="sc-link font-medium text-[var(--sc-link)]">
                    {info.sellerName}
                  </Link>
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2">
                <GradePill grade={product.grade} />
                <button type="button" onClick={onGradeGuide} className="sc-link font-medium text-[var(--sc-link)]">
                  {ui("whatGradeMeans")}
                </button>
              </span>
              <span>{info.typeLine}</span>
              <span>{info.watchers}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SaveButton product={product} />
            <button type="button" onClick={share} className={FRAMED} data-testid="share-button">
              <Share2 aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
              {ui("share")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The discount, or Out of stock, as a tag on the photograph (over the Auction Detail's gallery). */
function ImageTag({ purchase }) {
  const { ui } = useLang();
  if (purchase.soldOut) {
    return <span className="pointer-events-none absolute start-3 top-3 z-10 inline-flex h-[26px] items-center rounded-[6px] bg-[var(--sc-ink)] px-2.5 sc-sm font-semibold text-white">{ui("outOfStock")}</span>;
  }
  if (!purchase.pct) return null;
  return (
    <span className="pointer-events-none absolute start-3 top-3 z-10 inline-flex h-[26px] items-center rounded-[6px] bg-white px-2.5 sc-sm font-semibold text-[var(--sc-green)] ring-1 ring-inset ring-[var(--sc-line)]">
      <span dir="ltr">{purchase.text.pct}</span>
    </span>
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
      <ProductBand product={product} info={info} onGradeGuide={detail.guide.show} />

      <div className="sc-container pt-6 dt:pt-8">
        {/* phone: gallery · panel · sections · tablet and desktop: [gallery, sections | panel in view] */}
        <div className="grid gap-x-8 gap-y-8 [grid-template-areas:'gallery'_'panel'_'sections'] md:grid-cols-[minmax(0,1fr)_330px] md:[grid-template-areas:'gallery_panel'_'sections_panel'] dt:grid-cols-[minmax(0,1fr)_400px] dt:gap-x-10">
          <div className="relative min-w-0 [grid-area:gallery]">
            <Gallery product={product} title={info.title} />
            <ImageTag purchase={purchase} />
          </div>
          <div className="min-w-0 [grid-area:panel]">
            <div className="md:sticky md:top-[calc(var(--pbar-h)+20px)]">
              <PurchasePanel info={info} purchase={purchase} />
            </div>
          </div>
          <div className="grid min-w-0 content-start gap-10 [grid-area:sections]">
            <InfoBlocks detail={detail} info={info} />
            <AboutItem info={info} purchase={purchase} />
            {product.palletContents ? <ManifestTable product={product} /> : null}
          </div>
        </div>
      </div>

      <div className="pb-12 dt:pb-16">
        <LotList id="sc-related" title={ui("relatedItems")} href={info.categoryHref} lots={relatedFor(product, 4)} className="pt-12 dt:pt-16" />
        <LotList id="sc-seller-lots" title={ui("moreFromSeller")} text={info.sellerName} href={info.sellerHref} lots={moreFromSeller(product, 4)} className="pt-12 dt:pt-14" />
      </div>

      <PhoneBar info={info} purchase={purchase} />
      <GradeGuide detail={detail} />
    </>
  );
}
