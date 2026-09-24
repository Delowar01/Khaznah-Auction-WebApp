"use client";

import { Img } from "@/components/shared/ui/Img";

/**
 * Catalogue photo on the light plate. White-backdrop packshots are
 * multiplied into the plate so every product sits on the same studio grey;
 * lifestyle scenes fill the frame instead. `fill` stretches the plate over
 * a positioned parent (cards, stages); otherwise size it with className.
 */
export function LotImage({ image, alt, sizes, priority = false, fill = false, className = "", imgClassName = "", inset = "p-[8%]", cutout = false, gradient = false }) {
  const scene = image?.kind === "scene" && !cutout;
  const fit = scene ? "object-cover" : `object-contain ${inset} ${cutout ? "" : "mix-blend-multiply"}`;
  return (
    <div className={`${gradient ? "d-plate-grad" : "d-plate"} ${fill ? "absolute inset-0" : "relative"} overflow-hidden ${className}`}>
      <Img
        image={image}
        alt={alt}
        sizes={sizes}
        priority={priority}
        cutout={cutout}
        className={`absolute inset-0 size-full ${fit} ${imgClassName}`}
      />
    </div>
  );
}
