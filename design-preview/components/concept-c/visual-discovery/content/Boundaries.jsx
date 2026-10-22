"use client";

// Option 3's loading and error screens: production's (main)/loading.js,
// auction/[slug]/loading.js, auction/[slug]/error.js and
// seller/[code]/error.js, and the preview's general error page. Each keeps
// production's semantics: the loading screens are busy placeholders with
// production's labels; the error pages offer production's retry (Next's
// reset()) and the same way out (/browse?tab=auction, /browse). Every screen
// keeps the Option 3 masthead and footer, as production keeps its navbar
// and footer around them. The error pages are wired as route boundaries
// (error.js). The loading screens are shown on /system only: as route
// loading.js files they would make Next pre-render every Option 3 page —
// the approved five included — loading-first, with the page held back until
// a script swaps it in; production integration places them as loading.js.
// The bodies are exported for /system.
import Link from "next/link";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useConcept } from "@/components/shared/providers/ConceptProvider";
import { BOUNDARY_COPY as B, NOT_FOUND_COPY as N } from "@/components/shared/commerce/contentCopy";
import { SELLER_COPY } from "@/components/shared/commerce/sellerCopy";
import { ErrorState, Placeholder, Spinner } from "../kit/Blocks";
import { VDPage } from "../kit/Page";
import { btn, cx } from "../ui";

/** (main)/loading.js: a hero block and eight listing cards, busy. `container`: false inside a preview frame. */
export function MainLoadingBody({ container = true }) {
  const { t } = useLang();
  return (
    <div aria-busy="true" className={cx(container && "vd-container py-6 dt:py-8")} data-testid="main-loading">
      <Spinner label={t(B.loading)} />
      <span aria-hidden="true" className="mt-1 block h-[220px] animate-pulse rounded-[24px] bg-[var(--vd-bluegray)] motion-reduce:animate-none md:h-[300px] dt:h-[360px]" />
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 dt:grid-cols-4 dt:gap-5">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="rounded-[20px] border border-[var(--vd-line)] bg-white p-3">
            <span aria-hidden="true" className="block aspect-square animate-pulse rounded-[16px] bg-[var(--vd-bluegray)] motion-reduce:animate-none" />
            <Placeholder className="mt-3 h-4 w-3/4" />
            <Placeholder className="mt-2 h-3 w-1/2" />
            <Placeholder className="mt-4 h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** auction/[slug]/loading.js: the gallery with four thumbnails and the bid card, busy. */
export function AuctionLoadingBody({ container = true }) {
  const { t } = useLang();
  return (
    <div aria-busy="true" className={cx(container && "vd-container py-6 dt:py-8")} data-testid="auction-loading">
      <Spinner label={t(B.loadingAuction)} />
      <div className="mt-1 grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(340px,2fr)] dt:gap-8">
        <div>
          <span aria-hidden="true" className="block aspect-[4/3] animate-pulse rounded-[24px] bg-[var(--vd-bluegray)] motion-reduce:animate-none" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} aria-hidden="true" className="block aspect-square animate-pulse rounded-[16px] bg-[var(--vd-bluegray)] motion-reduce:animate-none" />
            ))}
          </div>
        </div>
        <div className="h-fit rounded-[24px] border border-[var(--vd-line)] bg-white p-6">
          <Placeholder className="h-6 w-3/4" />
          <Placeholder className="mt-4 h-4 w-1/2" />
          <Placeholder className="mt-6 h-16 w-full !rounded-[20px]" />
          <Placeholder className="mt-4 h-12 w-full" />
          <Placeholder className="mt-3 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

/** An error page's body: the kit's error panel, centred. */
export function BoundaryError({ kicker, title, text, onRetry, retryLabel, actions, headingLevel = 1, container = true }) {
  return (
    <div className={cx(container && "vd-container py-14 dt:py-20")}>
      <ErrorState kicker={kicker} headingLevel={headingLevel} title={title} text={text} onRetry={onRetry} retryLabel={retryLabel} actions={actions} className="mx-auto max-w-3xl" />
    </div>
  );
}

/** A page that failed to render: try again, or go home. */
export function PageErrorBody({ reset, headingLevel = 1, container = true }) {
  const { t, ui } = useLang();
  const { link } = useConcept();
  return (
    <BoundaryError
      container={container}
      headingLevel={headingLevel}
      title={ui("somethingWrong")}
      text={t(B.errorText)}
      onRetry={reset}
      actions={
        <Link href={link("/")} className={btn("outline", "lg")}>
          {t(N.home)}
        </Link>
      }
    />
  );
}

/** auction/[slug]/error.js: production's words (English only there), retry and the auctions list. */
export function AuctionErrorBody({ reset, headingLevel = 1, container = true }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <BoundaryError
      container={container}
      headingLevel={headingLevel}
      kicker={t(B.auctionKicker)}
      title={t(B.auctionTitle)}
      text={t(B.auctionText)}
      onRetry={reset}
      retryLabel={t(B.auctionRetry)}
      actions={
        <Link href={link("/browse?tab=auction")} className={btn("outline", "lg")}>
          {t(B.auctionBrowse)}
        </Link>
      }
    />
  );
}

/** seller/[code]/error.js: production's bilingual words; no unfiltered fallback. */
export function SellerErrorBody({ reset, headingLevel = 1, container = true }) {
  const { t } = useLang();
  const { link } = useConcept();
  return (
    <BoundaryError
      container={container}
      headingLevel={headingLevel}
      title={t(SELLER_COPY.errorTitle)}
      text={t(SELLER_COPY.errorText)}
      onRetry={reset}
      retryLabel={t(SELLER_COPY.retry)}
      actions={
        <Link href={link("/browse")} className={btn("outline", "lg")}>
          {t(SELLER_COPY.browseAll)}
        </Link>
      }
    />
  );
}

export function PageError({ reset }) {
  return (
    <VDPage>
      <PageErrorBody reset={reset} />
    </VDPage>
  );
}

export function AuctionError({ reset }) {
  return (
    <VDPage active="timed">
      <AuctionErrorBody reset={reset} />
    </VDPage>
  );
}

export function SellerError({ reset }) {
  return (
    <VDPage active="sellers">
      <SellerErrorBody reset={reset} />
    </VDPage>
  );
}
