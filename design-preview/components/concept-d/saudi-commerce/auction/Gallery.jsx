"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useHoverZoom } from "@/components/shared/auction/hooks";
import { ImageViewer } from "@/components/shared/auction/ImageViewer";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { useGallery } from "@/components/shared/ui/hooks";
import { cx } from "../ui";

const SIDE = "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-[7px] border border-[var(--sc-line)] bg-white text-[var(--sc-ink)] transition-colors hover:border-[var(--sc-green)]";

const VIEWER = {
  panel: "rounded-t-[14px] bg-white text-[var(--sc-ink)] shadow-overlay md:max-w-4xl! md:rounded-[12px]",
  head: "border-b border-[var(--sc-line)] px-5 py-3",
  title: "sc-lg font-semibold",
  counter: "sc-md text-[var(--sc-muted)]",
  close: "size-10 rounded-[7px] text-[var(--sc-ink)] hover:bg-[var(--sc-soft)]",
  stage: "mx-5 mt-5 aspect-square max-h-[62dvh] rounded-[9px] bg-[var(--sc-plate)] md:aspect-[4/3]",
  image: "sc-multiply p-[6%]",
  nav: "size-11 rounded-[7px] border border-[var(--sc-line)] bg-white text-[var(--sc-ink)] hover:border-[var(--sc-green)]",
  thumbs: "sc-rail px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
  thumb: "size-16 rounded-[7px] border-2 border-[var(--sc-line)] bg-[var(--sc-plate)]",
  thumbActive: "border-[var(--sc-green)]",
  thumbImage: "sc-multiply p-1.5",
};

/**
 * Straightforward gallery: the photograph on a light plate with square
 * previous / next at its sides and a zoom hint, then a strip of thumbnails
 * framed in green when shown. Hover zooms, a click opens the viewer; arrow
 * keys (mirrored in Arabic) and swipe move between images.
 */
export function Gallery({ product, title }) {
  const { t, ui } = useLang();
  const images = product.images;
  const gallery = useGallery(images.length);
  const zoom = useHoverZoom();
  const [viewer, setViewer] = useState(false);
  const image = images[gallery.index];
  const scene = image?.kind === "scene";
  const many = images.length > 1;

  return (
    <div>
      <div
        role="group"
        aria-label={t(C.galleryLabel, { title })}
        tabIndex={0}
        onKeyDown={gallery.onKeyDown}
        {...gallery.swipeHandlers}
        className="relative aspect-square overflow-hidden rounded-[9px] border border-[var(--sc-line)] bg-[var(--sc-plate)] outline-offset-4 sm:aspect-[4/3]"
      >
        <button
          type="button"
          onClick={() => {
            zoom.reset();
            setViewer(true);
          }}
          {...zoom.handlers}
          aria-label={t(C.openViewer, { n: gallery.index + 1, total: images.length })}
          className="absolute inset-0 cursor-zoom-in"
        >
          <span className="block size-full transition-transform duration-200 ease-out" style={zoom.style}>
            <Img
              key={gallery.index}
              image={image}
              cutout={!scene}
              alt={`${title} — ${ui("imageOf", { n: gallery.index + 1, total: images.length })}`}
              sizes="(min-width: 1200px) 820px, 100vw"
              priority={gallery.index === 0}
              className={cx("kz-fade-up size-full", scene ? "object-cover" : "sc-multiply object-contain p-[8%]")}
            />
          </span>
        </button>
        {many ? (
          <>
            <button type="button" onClick={gallery.prev} aria-label={ui("previous")} className={cx(SIDE, "start-3")}>
              <DirIcon icon={ChevronLeft} className="size-5" strokeWidth={2} />
            </button>
            <button type="button" onClick={gallery.next} aria-label={ui("next")} className={cx(SIDE, "end-3")}>
              <DirIcon icon={ChevronRight} className="size-5" strokeWidth={2} />
            </button>
          </>
        ) : null}
        <span className="pointer-events-none absolute bottom-3 end-3 inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-white/90 px-2.5 sc-sm font-medium text-[var(--sc-ink)]">
          <ZoomIn aria-hidden="true" className="size-4" strokeWidth={2} />
          <span className="tabular" dir="ltr">
            {gallery.index + 1} / {images.length}
          </span>
        </span>
      </div>

      {many ? (
        <ul className="sc-rail mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <li key={`${img?.sources?.[0]?.src}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => gallery.setIndex(i)}
                aria-label={ui("showImage", { n: i + 1 })}
                aria-current={i === gallery.index ? "true" : undefined}
                className={cx("relative block size-[72px] overflow-hidden rounded-[7px] border-2 bg-[var(--sc-plate)] transition-colors dt:size-20", i === gallery.index ? "border-[var(--sc-green)]" : "border-[var(--sc-line)] hover:border-[var(--sc-sage)]")}
              >
                <Img image={img} cutout={img?.kind !== "scene"} alt="" sizes="80px" className={cx("absolute inset-0 size-full", img?.kind === "scene" ? "object-cover" : "sc-multiply object-contain p-2")} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <ImageViewer open={viewer} onClose={() => setViewer(false)} images={images} title={title} gallery={gallery} cutout skin={VIEWER} />
    </div>
  );
}
