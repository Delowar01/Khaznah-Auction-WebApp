"use client";

const STICKY = "md:sticky md:top-[calc(var(--pbar-h)+var(--kb-head)+16px)] md:transition-[top] md:duration-300";

/**
 * Detail page grid shared by Product and Auction.
 *   phone:   gallery → head → box → details (box right under the title)
 *   tablet+: [gallery | head | details] beside a sticky box
 *   desktop: gallery · head + details · sticky box (three columns)
 */
export function DetailLayout({ gallery, head, details, box }) {
  return (
    <div className="mt-4 grid gap-6 [grid-template-areas:'gallery'_'head'_'box'_'details'] md:grid-cols-[minmax(0,1fr)_320px] md:gap-x-6 md:[grid-template-areas:'gallery_box'_'head_box'_'details_box'] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-x-8 xl:grid-cols-[minmax(0,5fr)_minmax(0,4.1fr)_minmax(340px,3.3fr)] xl:grid-rows-[auto_1fr] xl:[grid-template-areas:'gallery_head_box'_'gallery_details_box']">
      <div className="min-w-0 [grid-area:gallery]">
        <div className="xl:sticky xl:top-[calc(var(--pbar-h)+var(--kb-head)+16px)] xl:transition-[top] xl:duration-300">{gallery}</div>
      </div>
      <div className="min-w-0 [grid-area:head]">{head}</div>
      <div className="min-w-0 [grid-area:details]">{details}</div>
      <aside className="min-w-0 [grid-area:box]">
        <div className={STICKY}>{box}</div>
      </aside>
    </div>
  );
}
