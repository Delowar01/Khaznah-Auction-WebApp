"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { useGallery, useMediaQuery } from "@/components/shared/ui/hooks";
import { Plate } from "../ui/Plate";
import { cx } from "../ui/cx";
import { COPY } from "../copy";
import { Lightbox } from "./Lightbox";

const NAV = "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-surface/95 text-fg shadow-raised ring-1 ring-line backdrop-blur transition-[opacity,background-color] hover:bg-surface";

/**
 * Detail gallery: vertical thumbnails beside the main image on desktop, a
 * thumbnail strip below on phones. Hover zooms under the pointer, click
 * opens the lightbox, arrows / swipe / keyboard move between images.
 */
export function Gallery({ product, badges, className = "" }) {
  const { t, ui } = useLang();
  const images = product.images;
  const gallery = useGallery(images.length);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(null);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const title = t(product.title);
  const image = images[gallery.index];

  const onMove = (event) => {
    if (!canHover || image?.kind === "scene") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div className={cx("flex flex-col-reverse gap-3 lg:flex-row", className)}>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto p-0.5 lg:max-h-[560px] lg:w-[76px] lg:shrink-0 lg:flex-col lg:overflow-y-auto">
        {images.map((img, i) => (
          <li key={`${img?.sources?.[0]?.src}-${i}`} className="shrink-0">
            <button
              type="button"
              onClick={() => gallery.setIndex(i)}
              aria-label={ui("showImage", { n: i + 1 })}
              aria-current={i === gallery.index ? "true" : undefined}
              className={cx(
                "block size-16 overflow-hidden rounded-lg border-2 transition-colors lg:size-[72px]",
                i === gallery.index ? "border-primary" : "border-line hover:border-line-strong",
              )}
            >
              <Plate image={img} alt="" sizes="72px" pad="p-1" className="size-full" />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative min-w-0 flex-1">
        <div
          role="group"
          aria-roledescription="gallery"
          aria-label={t(COPY.galleryLabel, { title })}
          tabIndex={0}
          onKeyDown={gallery.onKeyDown}
          {...gallery.swipeHandlers}
          className="relative aspect-square overflow-hidden rounded-xl border border-line bg-plate outline-offset-4"
        >
          <button
            type="button"
            onClick={() => setLightbox(true)}
            onMouseMove={onMove}
            onMouseLeave={() => setZoom(null)}
            aria-label={ui("zoom")}
            className="absolute inset-0 cursor-zoom-in"
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={gallery.index}
                className="absolute inset-0 block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span
                  className="block size-full transition-transform duration-200 ease-out"
                  style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                >
                  <Plate
                    image={image}
                    alt={`${title} — ${ui("imageOf", { n: gallery.index + 1, total: images.length })}`}
                    sizes="(min-width: 1280px) 40vw, (min-width: 1024px) 55vw, 100vw"
                    priority={gallery.index === 0}
                    pad="p-[7%]"
                    className="size-full"
                  />
                </span>
              </motion.span>
            </AnimatePresence>
          </button>

          {badges ? <div className="pointer-events-none absolute start-3 top-3 z-10 flex flex-wrap gap-1.5">{badges}</div> : null}

          {images.length > 1 ? (
            <>
              <button type="button" data-testid="gallery-prev" onClick={gallery.prev} aria-label={ui("previous")} className={cx(NAV, "start-3")}>
                <DirIcon icon={ChevronLeft} className="size-5" />
              </button>
              <button type="button" data-testid="gallery-next" onClick={gallery.next} aria-label={ui("next")} className={cx(NAV, "end-3")}>
                <DirIcon icon={ChevronRight} className="size-5" />
              </button>
            </>
          ) : null}

          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-center justify-between">
            <span className="rounded-full bg-black/60 px-2.5 py-1 kb-xs font-semibold text-white tabular" dir="ltr">
              {gallery.index + 1} / {images.length}
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-surface/95 text-fg shadow-card ring-1 ring-line">
              <Expand aria-hidden="true" className="size-4" />
            </span>
          </div>
        </div>
      </div>

      <Lightbox open={lightbox} onClose={() => setLightbox(false)} images={images} title={title} gallery={gallery} />
    </div>
  );
}
