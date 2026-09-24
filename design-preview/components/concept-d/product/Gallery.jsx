"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useGallery } from "@/components/shared/ui/hooks";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { useCopy } from "../lib/useCopy";
import { GalleryImage } from "./GalleryImage";
import { Lightbox } from "./Lightbox";

const NAV_BTN = "d-ov-chip absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full transition-colors hover:bg-black/85";

/** Stage + thumbnails; arrows, keyboard, swipe and a zoom lightbox. */
export function Gallery({ images, title, overlay, className = "" }) {
  const { ui } = useLang();
  const c = useCopy();
  const gallery = useGallery(images.length);
  const [zoom, setZoom] = useState(false);
  const { index } = gallery;
  const many = images.length > 1;

  return (
    <div className={className}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={c("imageStage")}
        tabIndex={0}
        onKeyDown={gallery.onKeyDown}
        {...gallery.swipeHandlers}
        className="d-stage group relative aspect-square overflow-hidden rounded-card border border-line outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] sm:aspect-[4/3]"
      >
        <div aria-hidden="true" className="d-dotgrid pointer-events-none absolute inset-0 opacity-70" />
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={ui("imageOf", { n: index + 1, total: images.length })}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <GalleryImage image={images[index]} alt={index === 0 ? title : `${title} — ${ui("imageOf", { n: index + 1, total: images.length })}`} priority={index === 0} />
          </motion.div>
        </AnimatePresence>

        {overlay ? <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start gap-2">{overlay}</div> : null}
        <span className="d-ov-chip d-num absolute bottom-3 start-3 z-10 rounded-md px-2 py-1 text-[11px]">
          <span dir="ltr">
            {index + 1} / {images.length}
          </span>
        </span>
        <button type="button" onClick={() => setZoom(true)} aria-label={ui("zoom")} className="d-ov-chip absolute bottom-3 end-3 z-10 grid size-10 place-items-center rounded-full transition-colors hover:bg-black/85">
          <Maximize2 aria-hidden="true" className="size-4" />
        </button>
        {many ? (
          <>
            <button type="button" onClick={gallery.prev} aria-label={ui("previous")} data-testid="gallery-prev" className={`${NAV_BTN} start-3`}>
              <DirIcon icon={ChevronLeft} className="size-5" />
            </button>
            <button type="button" onClick={gallery.next} aria-label={ui("next")} data-testid="gallery-next" className={`${NAV_BTN} end-3`}>
              <DirIcon icon={ChevronRight} className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {many ? (
        <div className="no-scrollbar relative mt-3 flex gap-2 overflow-x-auto p-0.5" role="group" aria-label={c("thumbnails")}>
          {images.map((image, i) => (
            <button
              key={image.sources[0].src}
              type="button"
              onClick={() => gallery.setIndex(i)}
              aria-label={ui("showImage", { n: i + 1 })}
              aria-current={i === index ? "true" : undefined}
              className={`d-plate relative size-16 shrink-0 overflow-hidden rounded-xl transition-[box-shadow,opacity] sm:size-[72px] ${
                i === index ? "ring-2 ring-[var(--d-ink)] ring-offset-2 ring-offset-bg" : "opacity-70 ring-1 ring-line hover:opacity-100"
              }`}
            >
              <Img
                image={image}
                alt=""
                sizes="80px"
                className={`absolute inset-0 size-full ${image.kind === "scene" ? "object-cover" : "object-contain p-1.5 mix-blend-multiply"}`}
              />
            </button>
          ))}
        </div>
      ) : null}

      <Lightbox open={zoom} onClose={() => setZoom(false)} images={images} title={title} startIndex={index} onIndex={gallery.setIndex} />
    </div>
  );
}
