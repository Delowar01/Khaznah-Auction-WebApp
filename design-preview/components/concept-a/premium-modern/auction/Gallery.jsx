"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { AUCTION_COPY as C } from "@/components/shared/auction/copy";
import { useHoverZoom } from "@/components/shared/auction/hooks";
import { ImageViewer } from "@/components/shared/auction/ImageViewer";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { useGallery } from "@/components/shared/ui/hooks";
import { cx } from "../ui";

const pad = (n) => String(n).padStart(2, "0");
const SQUARE = "grid size-10 place-items-center rounded-[4px] border border-[#d3cfc6] bg-white/90 text-fg transition-colors hover:bg-white";

const VIEWER = {
  panel: "rounded-t-[8px] bg-[var(--bg)] text-fg shadow-overlay md:max-w-4xl! md:rounded-[6px]",
  head: "border-b border-line px-5 py-3",
  title: "pr-lg font-semibold",
  counter: "pr-sm text-fg-2",
  close: "size-10 rounded-[4px] text-fg hover:bg-[var(--pr-stone)]",
  stage: "mx-5 mt-5 aspect-square max-h-[62dvh] rounded-[6px] bg-[var(--pr-stone)] md:aspect-[4/3]",
  image: "pr-multiply p-[6%]",
  nav: "size-11 rounded-[4px] border border-[#d3cfc6] bg-white/90 text-fg hover:bg-white",
  thumbs: "pr-rail px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3",
  thumb: "size-16 rounded-[4px] bg-[var(--pr-stone)] ring-1 ring-inset ring-transparent",
  thumbActive: "ring-2 ring-[var(--pr-charcoal)]",
  thumbImage: "pr-multiply p-1.5",
};

/**
 * Large editorial gallery: the photograph on a stone plate, numbered
 * 01 / 03, square previous / next at its foot and a slim row of thumbnails
 * underlined in charcoal. Hover zooms under the pointer, a click opens the
 * full-size viewer; arrow keys (mirrored in Arabic) and swipe move on.
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
        className="relative aspect-square overflow-hidden rounded-[6px] bg-[var(--pr-stone)] outline-offset-4 sm:aspect-[5/4]"
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
              sizes="(min-width: 1200px) 760px, 100vw"
              priority={gallery.index === 0}
              className={cx("kz-fade-up size-full", scene ? "object-cover" : "pr-multiply object-contain p-[9%]")}
            />
          </span>
        </button>
        <span aria-hidden="true" className="pointer-events-none absolute end-3 top-3 grid size-9 place-items-center rounded-[4px] bg-white/85 text-fg">
          <Maximize2 className="size-4" strokeWidth={1.8} />
        </span>
        {/* The digits run LTR; the badge itself follows the page, so it stays clear of the arrows in Arabic. */}
        <span className="pointer-events-none absolute bottom-3 start-3 rounded-[3px] bg-white/85 px-2 py-1 pr-xs font-semibold text-fg tabular">
          <span dir="ltr">
            {pad(gallery.index + 1)} / {pad(images.length)}
          </span>
        </span>
        {many ? (
          <span className="absolute bottom-3 end-3 flex gap-1.5">
            <button type="button" onClick={gallery.prev} aria-label={ui("previous")} className={SQUARE}>
              <DirIcon icon={ChevronLeft} className="size-5" strokeWidth={1.8} />
            </button>
            <button type="button" onClick={gallery.next} aria-label={ui("next")} className={SQUARE}>
              <DirIcon icon={ChevronRight} className="size-5" strokeWidth={1.8} />
            </button>
          </span>
        ) : null}
      </div>

      {many ? (
        <ul className="pr-rail mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <li key={`${img?.sources?.[0]?.src}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => gallery.setIndex(i)}
                aria-label={ui("showImage", { n: i + 1 })}
                aria-current={i === gallery.index ? "true" : undefined}
                className={cx(
                  "relative block size-[68px] overflow-hidden rounded-[4px] bg-[var(--pr-stone)] after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:content-[''] dt:size-[76px]",
                  i === gallery.index ? "after:bg-[var(--pr-charcoal)]" : "opacity-75 hover:opacity-100",
                )}
              >
                <Img image={img} cutout={img?.kind !== "scene"} alt="" sizes="76px" className={cx("absolute inset-0 size-full", img?.kind === "scene" ? "object-cover" : "pr-multiply object-contain p-2")} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <ImageViewer open={viewer} onClose={() => setViewer(false)} images={images} title={title} gallery={gallery} cutout skin={VIEWER} />
    </div>
  );
}
