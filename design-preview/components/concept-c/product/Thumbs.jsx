"use client";

import { useLang } from "@/components/shared/providers/LangProvider";
import { PlateImage } from "../ui/Frame";
import { cx } from "../ui/cx";

/** Thumbnail strip shared by the gallery and the lightbox. */
export function Thumbs({ images, index, onSelect, className = "" }) {
  const { ui } = useLang();
  return (
    <div className={cx("grid grid-cols-5 gap-2 sm:grid-cols-6", className)}>
      {images.map((image, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={ui("showImage", { n: i + 1 })}
          aria-current={i === index ? "true" : undefined}
          className={cx("c-plate aspect-square rounded-sm border-2 transition-colors", i === index ? "border-primary" : "border-transparent hover:border-line-strong")}
        >
          <PlateImage image={image} alt="" sizes="96px" zoom={false} className="size-full" />
        </button>
      ))}
    </div>
  );
}
