"use client";

import { Img } from "@/components/shared/ui/Img";

/**
 * One gallery frame. Packshots sit on the light plate inset in the dark
 * stage; lifestyle scenes fill the frame edge to edge.
 */
export function GalleryImage({ image, alt, priority = false, sizes = "(min-width: 1024px) 60vw, 100vw", large = false }) {
  if (image?.kind === "scene") {
    return <Img image={image} alt={alt} priority={priority} sizes={sizes} className="absolute inset-0 size-full object-cover" />;
  }
  return (
    <div className={`d-plate absolute overflow-hidden rounded-[14px] shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)] ${large ? "inset-[4%]" : "inset-[6%]"}`}>
      <Img image={image} alt={alt} priority={priority} sizes={sizes} className="absolute inset-0 size-full object-contain p-[7%] mix-blend-multiply" />
    </div>
  );
}
