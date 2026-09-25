"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { DialogPanel } from "../ui/Panels";
import { Plate } from "../ui/Plate";
import { cx } from "../ui/cx";

const ARROW = "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-surface/95 text-fg shadow-raised ring-1 ring-line transition-colors hover:bg-surface";

/** Full-size image viewer sharing the gallery's index. */
export function Lightbox({ open, onClose, images, title, gallery }) {
  const { ui } = useLang();
  const image = images[gallery.index];
  return (
    <DialogPanel open={open} onClose={onClose} title={title} size="xl">
      <div onKeyDown={gallery.onKeyDown} {...gallery.swipeHandlers}>
        <div className="relative aspect-square max-h-[64dvh] w-full overflow-hidden rounded-xl bg-plate md:aspect-[4/3]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={gallery.index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <Img
                image={image}
                alt={`${title} — ${ui("imageOf", { n: gallery.index + 1, total: images.length })}`}
                sizes="(min-width: 768px) 900px, 100vw"
                className={cx("size-full", image?.kind === "scene" ? "object-cover" : "kb-pack object-contain p-[6%]")}
              />
            </motion.div>
          </AnimatePresence>
          {images.length > 1 ? (
            <>
              <button type="button" onClick={gallery.prev} aria-label={ui("previous")} className={cx(ARROW, "start-3")}>
                <DirIcon icon={ChevronLeft} className="size-5" />
              </button>
              <button type="button" onClick={gallery.next} aria-label={ui("next")} className={cx(ARROW, "end-3")}>
                <DirIcon icon={ChevronRight} className="size-5" />
              </button>
            </>
          ) : null}
          <span className="absolute bottom-3 end-3 rounded-full bg-black/60 px-2.5 py-1 kb-xs font-semibold text-white tabular" dir="ltr">
            {gallery.index + 1} / {images.length}
          </span>
        </div>
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <li key={`${img?.sources?.[0]?.src}-${i}`}>
              <button
                type="button"
                onClick={() => gallery.setIndex(i)}
                aria-label={ui("showImage", { n: i + 1 })}
                aria-current={i === gallery.index ? "true" : undefined}
                className={cx("block size-16 overflow-hidden rounded-lg border-2 transition-colors", i === gallery.index ? "border-primary" : "border-line hover:border-line-strong")}
              >
                <Plate image={img} alt="" sizes="64px" pad="p-1" className="size-full" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </DialogPanel>
  );
}
