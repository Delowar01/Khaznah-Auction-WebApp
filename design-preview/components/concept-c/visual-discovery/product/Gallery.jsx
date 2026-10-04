"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand, ShoppingBag } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY } from "@/components/shared/auction/copy";
import { useHoverZoom } from "@/components/shared/auction/hooks";
import { ImageViewer } from "@/components/shared/auction/ImageViewer";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { useGallery } from "@/components/shared/ui/hooks";
import { toneOf } from "../browse/Cards";
import { HeartDisk, cx } from "../ui";

const DISK = "grid size-11 place-items-center rounded-full bg-white text-[var(--vd-indigo)] shadow-[0_2px_8px_rgb(7_27_82/0.14)] transition-transform hover:scale-105";

// The full-size viewer in this option's skin (the Auction Detail's).
const VIEWER = {
  panel: "rounded-t-[24px] bg-white text-[var(--vd-ink)] shadow-overlay md:max-w-4xl! md:rounded-[20px]",
  head: "px-5 pb-2 pt-4",
  title: "vd-h3",
  counter: "rounded-full bg-[var(--vd-bluegray)] px-3 py-1 vd-sm font-semibold text-[var(--vd-indigo)]",
  close: "size-10 rounded-full bg-[var(--vd-bluegray)] text-[var(--vd-indigo)] hover:bg-[#dfe7f3]",
  stage: "mx-4 aspect-square max-h-[62dvh] rounded-[20px] bg-[var(--vd-bluegray)] md:aspect-[4/3]",
  image: "vd-multiply p-[6%]",
  nav: "size-11 rounded-full bg-white text-[var(--vd-indigo)] shadow-[0_2px_8px_rgb(7_27_82/0.14)]",
  thumbs: "vd-rail px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
  thumb: "size-16 rounded-[14px] bg-[var(--vd-bluegray)]",
  thumbActive: "ring-2 ring-[var(--vd-indigo)] ring-offset-2",
  thumbImage: "vd-multiply p-1.5",
};

/**
 * Expressive product gallery, the Auction Detail's without the clock: the
 * photograph large on the item's own tinted plate, Buy Now and the discount
 * as pills on it with the save disk, round previous / next and a row of
 * rounded tinted thumbnails. Hover zooms, a click opens the viewer; arrow
 * keys (mirrored in Arabic) and swipe move between images.
 */
export function Gallery({ product, title, purchase }) {
  const { t, ui } = useLang();
  const images = product.images;
  const gallery = useGallery(images.length);
  const zoom = useHoverZoom();
  const [viewer, setViewer] = useState(false);
  const image = images[gallery.index];
  const scene = image?.kind === "scene";
  const many = images.length > 1;
  const tone = toneOf(product.slug);

  return (
    <div>
      <div
        role="group"
        aria-label={t(AUCTION_COPY.galleryLabel, { title })}
        tabIndex={0}
        onKeyDown={gallery.onKeyDown}
        {...gallery.swipeHandlers}
        className="relative aspect-square overflow-hidden rounded-[20px] outline-offset-4 dt:rounded-[24px]"
        style={{ background: tone }}
      >
        <button
          type="button"
          onClick={() => {
            zoom.reset();
            setViewer(true);
          }}
          {...zoom.handlers}
          aria-label={t(AUCTION_COPY.openViewer, { n: gallery.index + 1, total: images.length })}
          className="absolute inset-0 cursor-zoom-in"
        >
          <span className="block size-full transition-transform duration-200 ease-out" style={zoom.style}>
            <Img
              key={gallery.index}
              image={image}
              cutout={!scene}
              alt={`${title} — ${ui("imageOf", { n: gallery.index + 1, total: images.length })}`}
              sizes="(min-width: 1200px) 720px, 100vw"
              priority={gallery.index === 0}
              className={cx("kz-fade-up size-full", scene ? "object-cover" : "vd-multiply object-contain px-[12%] pb-[14%] pt-[12%]")}
            />
          </span>
        </button>
        <HeartDisk product={product} className="absolute end-3 top-3 dt:end-4 dt:top-4" />
        <div className="pointer-events-none absolute start-3 top-3 flex flex-wrap gap-2 dt:start-4 dt:top-4">
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 vd-sm font-bold text-[var(--vd-indigo)]">
            <ShoppingBag aria-hidden="true" className="size-4" strokeWidth={2.2} />
            {ui("buyNow")}
          </span>
          {purchase.soldOut ? (
            <span className="inline-flex h-9 items-center rounded-full bg-[var(--vd-ink)]/80 px-3.5 vd-sm font-bold text-white">{ui("outOfStock")}</span>
          ) : purchase.pct ? (
            <span className="inline-flex h-9 items-center rounded-full bg-[var(--vd-gold)] px-3.5 vd-sm font-extrabold text-[var(--vd-ink)]">
              <span dir="ltr">{purchase.text.pct}</span>
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-3 end-3 flex items-center gap-2 dt:bottom-4 dt:end-4">
          <span className="pointer-events-none hidden h-8 items-center gap-1.5 rounded-full bg-white/90 px-3 vd-sm font-semibold text-[var(--vd-ink)] sm:inline-flex">
            <Expand aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
            <span className="tabular" dir="ltr">
              {gallery.index + 1}/{images.length}
            </span>
          </span>
          {many ? (
            <>
              <button type="button" onClick={gallery.prev} aria-label={ui("previous")} className={DISK}>
                <DirIcon icon={ChevronLeft} className="size-5" strokeWidth={2.2} />
              </button>
              <button type="button" onClick={gallery.next} aria-label={ui("next")} className={DISK}>
                <DirIcon icon={ChevronRight} className="size-5" strokeWidth={2.2} />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {many ? (
        <ul className="vd-rail mt-3 flex gap-2.5 overflow-x-auto p-1">
          {images.map((img, i) => (
            <li key={`${img?.sources?.[0]?.src}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => gallery.setIndex(i)}
                aria-label={ui("showImage", { n: i + 1 })}
                aria-current={i === gallery.index ? "true" : undefined}
                className={cx("relative block size-[72px] overflow-hidden rounded-[16px] transition-shadow dt:size-[84px]", i === gallery.index ? "ring-2 ring-[var(--vd-indigo)] ring-offset-2" : "hover:ring-2 hover:ring-[#c3d2ea]")}
                style={{ background: tone }}
              >
                <Img image={img} cutout={img?.kind !== "scene"} alt="" sizes="84px" className={cx("absolute inset-0 size-full", img?.kind === "scene" ? "object-cover" : "vd-multiply object-contain p-2")} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <ImageViewer open={viewer} onClose={() => setViewer(false)} images={images} title={title} gallery={gallery} cutout skin={VIEWER} />
    </div>
  );
}
