"use client";

import { Img } from "@/components/shared/ui/Img";
import { cx } from "./cx";

const SIZE = { sm: "--sm", md: "", lg: "--lg", xl: "--xl" };

/**
 * A frame with the 62° chamfer on its inline-start top corner (mirrors in
 * Arabic) and a hairline parallel to the cut that turns gold on hover.
 */
export function ChamferFrame({ size = "md", className = "", frameClassName = "", cutline = true, gold = false, children }) {
  const s = SIZE[size] ?? "";
  return (
    <div className={cx("relative", className)}>
      <div className={cx("c-chamfer", s && `c-chamfer${s}`, frameClassName)}>{children}</div>
      {cutline ? <span aria-hidden="true" className={cx("c-cutline", s && `c-cutline${s}`, gold && "c-cutline--gold")} /> : null}
    </div>
  );
}

/**
 * Catalogue photo on the warm plate. Packshots sit on the plate with a
 * multiply blend (their white backdrop becomes the plate); lifestyle scenes
 * fill the frame.
 */
export function PlateImage({ image, alt, sizes, priority = false, zoom = true, fit, className = "", imgClassName = "" }) {
  const scene = fit ? fit === "cover" : image?.kind === "scene";
  return (
    <div className={cx("c-plate", className)}>
      <Img
        image={image}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={cx("c-plate-img", scene ? "c-plate-img--scene" : "p-[9%]", zoom && "c-plate-img--zoom", imgClassName)}
        placeholderClassName="size-full"
      />
    </div>
  );
}
