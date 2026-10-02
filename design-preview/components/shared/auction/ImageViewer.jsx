"use client";

// Full-size image viewer for an auction gallery. It shares the gallery's
// index (useGallery), so closing it leaves the gallery on the image last
// shown. Previous / next, the counter and thumbnails; arrow keys (mirrored in
// Arabic) and swipe move between images. Each option passes its own classes
// in `skin`; nothing here sets a colour, radius or font.
import { useId } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { Img } from "@/components/shared/ui/Img";
import { Modal } from "@/components/shared/ui/Modal";

const cx = (...parts) => parts.filter(Boolean).join(" ");

export function ImageViewer({ open, onClose, images, title, gallery, cutout = false, skin = {} }) {
  const { ui } = useLang();
  const titleId = useId();
  const image = images[gallery.index];
  const many = images.length > 1;
  return (
    <Modal open={open} onClose={onClose} variant="sheet" labelledBy={titleId} panelClassName={skin.panel}>
      {/* Arrow keys move between images wherever focus is in the viewer. */}
      <div onKeyDown={gallery.onKeyDown}>
        <div className={cx("flex items-center gap-3", skin.head)}>
          <h2 id={titleId} className={cx("min-w-0 flex-1 truncate", skin.title)}>
            {title}
          </h2>
          <span className={cx("shrink-0 tabular", skin.counter)} dir="ltr">
            {gallery.index + 1} / {images.length}
          </span>
          <button type="button" onClick={onClose} aria-label={ui("close")} className={cx("grid shrink-0 place-items-center", skin.close)}>
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div
          role="group"
          aria-label={ui("imageOf", { n: gallery.index + 1, total: images.length })}
          tabIndex={0}
          {...gallery.swipeHandlers}
          className={cx("relative overflow-hidden", skin.stage)}
        >
          <Img
            key={gallery.index}
            image={image}
            cutout={cutout}
            alt={`${title} — ${ui("imageOf", { n: gallery.index + 1, total: images.length })}`}
            sizes="(min-width: 768px) 960px, 100vw"
            className={cx("absolute inset-0 size-full kz-fade-up", image?.kind === "scene" ? "object-cover" : cx("object-contain", skin.image))}
          />
          {many ? (
            <>
              <button type="button" onClick={gallery.prev} aria-label={ui("previous")} className={cx("absolute top-1/2 start-3 z-10 grid -translate-y-1/2 place-items-center", skin.nav)}>
                <DirIcon icon={ChevronLeft} className="size-5" />
              </button>
              <button type="button" onClick={gallery.next} aria-label={ui("next")} className={cx("absolute top-1/2 end-3 z-10 grid -translate-y-1/2 place-items-center", skin.nav)}>
                <DirIcon icon={ChevronRight} className="size-5" />
              </button>
            </>
          ) : null}
        </div>
        {many ? (
          <ul className={cx("flex gap-2 overflow-x-auto", skin.thumbs)}>
            {images.map((img, i) => (
              <li key={`${img?.sources?.[0]?.src}-${i}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => gallery.setIndex(i)}
                  aria-label={ui("showImage", { n: i + 1 })}
                  aria-current={i === gallery.index ? "true" : undefined}
                  className={cx("relative block overflow-hidden", skin.thumb, i === gallery.index && skin.thumbActive)}
                >
                  <Img image={img} cutout={cutout} alt="" sizes="64px" className={cx("absolute inset-0 size-full", img?.kind === "scene" ? "object-cover" : cx("object-contain", skin.thumbImage))} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Modal>
  );
}
