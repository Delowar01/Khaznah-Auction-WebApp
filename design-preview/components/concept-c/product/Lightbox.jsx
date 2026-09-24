"use client";

import { useId } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { PlateImage } from "../ui/Frame";
import { DIALOG_PANEL } from "../ui/Dialog";
import { Thumbs } from "./Thumbs";

/** Full-size image viewer that shares the gallery's position. */
export function Lightbox({ open, onClose, images, title, gallery }) {
  const { ui } = useLang();
  const titleId = useId();
  const count = images.length;
  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} panelClassName={`max-w-5xl! ${DIALOG_PANEL}`}>
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-6">
        <h2 id={titleId} className="line-clamp-1 font-semibold">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="c-num text-sm text-fg-3">
            {gallery.index + 1} / {count}
          </span>
          <button type="button" onClick={onClose} aria-label={ui("close")} className="c-iconbtn -me-2 text-fg-2">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6" onKeyDown={gallery.onKeyDown} {...gallery.swipeHandlers}>
        <div className="relative">
          <PlateImage
            image={images[gallery.index]}
            alt={`${title} — ${ui("imageOf", { n: gallery.index + 1, total: count })}`}
            sizes="(min-width: 1024px) 64rem, 100vw"
            zoom={false}
            className="mx-auto aspect-square max-h-[62dvh] w-full rounded-sm"
          />
          {count > 1 ? (
            <>
              <button type="button" onClick={gallery.prev} aria-label={ui("previous")} className="c-btn c-btn--outline c-btn--icon absolute start-2 top-1/2 -translate-y-1/2 bg-surface">
                <DirIcon icon={ChevronLeft} className="size-5" />
              </button>
              <button type="button" onClick={gallery.next} aria-label={ui("next")} className="c-btn c-btn--outline c-btn--icon absolute end-2 top-1/2 -translate-y-1/2 bg-surface">
                <DirIcon icon={ChevronRight} className="size-5" />
              </button>
            </>
          ) : null}
        </div>
        {count > 1 ? <Thumbs images={images} index={gallery.index} onSelect={gallery.setIndex} className="mx-auto mt-4 max-w-md sm:grid-cols-7" /> : null}
      </div>
    </Modal>
  );
}
