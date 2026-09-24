"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Modal } from "@/components/shared/ui/Modal";
import { DirIcon } from "@/components/shared/ui/DirIcon";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useCopy } from "../lib/useCopy";
import { GalleryImage } from "./GalleryImage";

function LightboxBody({ images, title, startIndex, onIndex, onClose }) {
  const { ui, isRTL } = useLang();
  const c = useCopy();
  const [index, setIndex] = useState(startIndex || 0);
  const touch = useRef(null);
  const count = images.length;

  const go = (i) => {
    const next = ((i % count) + count) % count;
    setIndex(next);
    onIndex?.(next);
  };
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowRight") goRef.current(index + (isRTL ? -1 : 1));
      if (event.key === "ArrowLeft") goRef.current(index + (isRTL ? 1 : -1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, isRTL]);

  return (
    <div className="d-stage relative flex h-[min(86dvh,860px)] flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <p className="truncate text-sm font-medium text-fg">{title}</p>
        <div className="flex items-center gap-2">
          <span className="d-num text-xs text-fg-3" dir="ltr">
            {index + 1} / {count}
          </span>
          <button type="button" onClick={onClose} aria-label={c("closeViewer")} className="grid size-10 place-items-center rounded-full text-fg-2 hover:bg-surface-2 hover:text-fg">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
      <div
        className="relative flex-1"
        onTouchStart={(e) => {
          touch.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          touch.current = null;
          if (Math.abs(dx) < 40) return;
          go(index + ((isRTL ? dx > 0 : dx < 0) ? 1 : -1));
        }}
      >
        <GalleryImage image={images[index]} alt={`${title} — ${ui("imageOf", { n: index + 1, total: count })}`} sizes="90vw" large />
        {count > 1 ? (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label={ui("previous")} className="d-ov-chip absolute start-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full">
              <DirIcon icon={ChevronLeft} className="size-5" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label={ui("next")} className="d-ov-chip absolute end-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full">
              <DirIcon icon={ChevronRight} className="size-5" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

/** Full-size image viewer (Modal). */
export function Lightbox({ open, onClose, images, title, startIndex, onIndex }) {
  const { ui } = useLang();
  return (
    <Modal open={open} onClose={onClose} title={ui("zoom")} panelClassName="max-w-5xl overflow-hidden rounded-t-2xl border border-line-strong bg-elevated shadow-overlay md:rounded-2xl">
      <LightboxBody images={images} title={title} startIndex={startIndex} onIndex={onIndex} onClose={onClose} />
    </Modal>
  );
}
