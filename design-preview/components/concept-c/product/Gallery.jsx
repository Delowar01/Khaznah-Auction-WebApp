"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { useGallery } from "@/components/shared/ui/hooks";
import { ChamferFrame, PlateImage } from "../ui/Frame";
import { cx } from "../ui/cx";
import { Lightbox } from "./Lightbox";
import { Thumbs } from "./Thumbs";

const NAV_BTN = "grid size-11 place-items-center rounded-control border border-line bg-surface/90 text-fg backdrop-blur-sm transition-colors hover:border-fg";

/** Detail gallery: chamfered main image on the warm plate, arrows, swipe, keyboard, thumbnails and a lightbox. */
export function Gallery({ images, title, overlay = null }) {
  const { ui } = useLang();
  const count = images.length;
  const gallery = useGallery(count);
  const [zoom, setZoom] = useState(false);

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
        onKeyDown={gallery.onKeyDown}
        {...gallery.swipeHandlers}
        className="group relative rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
      >
        <ChamferFrame size="lg" frameClassName="c-plate relative aspect-square">
          <AnimatePresence initial={false}>
            <motion.div key={gallery.index} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <PlateImage
                image={images[gallery.index]}
                alt={`${title} — ${ui("imageOf", { n: gallery.index + 1, total: count })}`}
                priority={gallery.index === 0}
                sizes="(min-width: 1024px) 55vw, 100vw"
                zoom={false}
                className="size-full"
              />
            </motion.div>
          </AnimatePresence>
          {overlay}
        </ChamferFrame>
        {count > 1 ? (
          <>
            <button type="button" data-testid="gallery-prev" onClick={gallery.prev} aria-label={ui("previous")} className={cx(NAV_BTN, "absolute start-3 top-1/2 -translate-y-1/2 sm:start-4")}>
              <DirIcon icon={ChevronLeft} className="size-5" />
            </button>
            <button type="button" data-testid="gallery-next" onClick={gallery.next} aria-label={ui("next")} className={cx(NAV_BTN, "absolute end-3 top-1/2 -translate-y-1/2 sm:end-4")}>
              <DirIcon icon={ChevronRight} className="size-5" />
            </button>
          </>
        ) : null}
        <button type="button" onClick={() => setZoom(true)} aria-label={ui("zoom")} className={cx(NAV_BTN, "absolute bottom-3 end-3 sm:bottom-4 sm:end-4")}>
          <Maximize2 aria-hidden="true" className="size-4" />
        </button>
        <span className="c-num absolute bottom-4 start-4 rounded-xs bg-surface/90 px-2 py-1 text-xs font-semibold text-fg-2 sm:bottom-5 sm:start-5" aria-hidden="true">
          <span dir="ltr">
            {gallery.index + 1} / {count}
          </span>
        </span>
      </div>
      {count > 1 ? <Thumbs images={images} index={gallery.index} onSelect={gallery.setIndex} className="mt-3" /> : null}
      <Lightbox open={zoom} onClose={() => setZoom(false)} images={images} title={title} gallery={gallery} />
    </div>
  );
}
