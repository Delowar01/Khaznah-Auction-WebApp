"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { Img } from "@/components/shared/ui/Img";
import { Modal } from "@/components/shared/ui/Modal";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { useGallery } from "@/components/shared/ui/hooks";

const pad = (n) => String(n).padStart(2, "0");

function Picture({ image, alt, priority, sizes, className = "" }) {
  const scene = image?.kind === "scene";
  return (
    <Img
      image={image}
      alt={alt}
      priority={priority}
      sizes={sizes}
      className={`absolute inset-0 size-full ${scene ? "object-cover" : "a-plate-img object-contain p-[9%]"} ${className}`}
    />
  );
}

function ArrowButton({ onClick, label, icon, testId, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-testid={testId}
      className={`grid size-11 place-items-center rounded-full border border-line bg-surface/95 text-fg shadow-card backdrop-blur transition-[border-color,transform] hover:border-fg active:scale-95 ${className}`}
    >
      <DirIcon icon={icon} className="size-5" />
    </button>
  );
}

/**
 * Catalogue gallery: large plate, thumbnail rail (vertical on desktop),
 * keyboard arrows, swipe and a lightbox.
 */
export function Gallery({ images, title, badge }) {
  const { ui } = useLang();
  const g = useGallery(images.length);
  const [zoomed, setZoomed] = useState(false);
  const total = images.length;
  const label = (n) => ui("imageOf", { n, total });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[72px_minmax(0,1fr)] lg:gap-5">
      <div className="order-2 min-w-0 lg:order-1">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label={title}>
          {images.map((image, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => g.setIndex(i)}
                aria-label={ui("showImage", { n: i + 1 })}
                aria-current={i === g.index ? "true" : undefined}
                className={`relative block size-16 overflow-hidden rounded-card bg-plate transition-[opacity,box-shadow] lg:size-[72px] ${
                  i === g.index ? "opacity-100 ring-1 ring-inset ring-fg" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Picture image={image} alt="" sizes="72px" className="!p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-1 min-w-0 lg:order-2">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={`${title} — ${label(g.index + 1)}`}
          tabIndex={0}
          onKeyDown={g.onKeyDown}
          {...g.swipeHandlers}
          className="group relative aspect-square overflow-hidden rounded-card bg-plate outline-none focus-visible:ring-2 focus-visible:ring-focus sm:aspect-[5/4] lg:aspect-square"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={g.index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Picture image={images[g.index]} alt={`${title} — ${label(g.index + 1)}`} priority={g.index === 0} sizes="(min-width: 1024px) 50vw, 100vw" />
            </motion.div>
          </AnimatePresence>

          {badge ? <div className="absolute start-4 top-4 z-10">{badge}</div> : null}

          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={ui("zoom")}
            className="absolute end-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-line bg-surface/95 text-fg shadow-card backdrop-blur transition-colors hover:border-fg"
          >
            <Expand aria-hidden="true" className="size-[18px]" />
          </button>

          <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between">
            <span dir="ltr" className="rounded-full bg-surface/95 px-3 py-1.5 text-[12px] font-semibold tabular text-fg-2 shadow-card backdrop-blur">
              {pad(g.index + 1)} / {pad(total)}
            </span>
            <div className="flex gap-2">
              <ArrowButton onClick={g.prev} label={ui("previous")} icon={ChevronLeft} testId="gallery-prev" />
              <ArrowButton onClick={g.next} label={ui("next")} icon={ChevronRight} testId="gallery-next" />
            </div>
          </div>
        </div>
      </div>

      <Modal open={zoomed} onClose={() => setZoomed(false)} title={title} panelClassName="!max-w-5xl rounded-xl bg-plate shadow-overlay">
        <div className="relative aspect-square max-h-[86dvh] w-full" onKeyDown={g.onKeyDown} {...g.swipeHandlers}>
          <Picture image={images[g.index]} alt={`${title} — ${label(g.index + 1)}`} sizes="90vw" />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label={ui("close")}
            className="absolute end-4 top-4 grid size-11 place-items-center rounded-full bg-surface text-fg shadow-card hover:bg-surface-2"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            <span dir="ltr" className="rounded-full bg-surface px-3 py-1.5 text-[12px] font-semibold tabular text-fg-2 shadow-card">
              {pad(g.index + 1)} / {pad(total)}
            </span>
            <div className="flex gap-2">
              <ArrowButton onClick={g.prev} label={ui("previous")} icon={ChevronLeft} />
              <ArrowButton onClick={g.next} label={ui("next")} icon={ChevronRight} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
