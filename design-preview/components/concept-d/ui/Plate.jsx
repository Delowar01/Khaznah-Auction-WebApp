"use client";

import { Img } from "@/components/shared/ui/Img";
import { cx } from "./cx";

/**
 * Product photo on B's light plate. Packshots are contained and multiplied
 * into the plate so their white backdrop disappears; lifestyle scenes fill
 * the frame. The plate stays light in dark mode.
 */
export function Plate({ image, alt, sizes, priority = false, fit, pad = "p-[9%]", className = "", imgClassName = "", children }) {
  const cover = fit ? fit === "cover" : image?.kind === "scene";
  return (
    <div className={cx("relative overflow-hidden bg-plate", className)}>
      <Img
        image={image}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={cx("size-full", cover ? "object-cover" : cx("kb-pack object-contain", pad), imgClassName)}
      />
      {children}
    </div>
  );
}
