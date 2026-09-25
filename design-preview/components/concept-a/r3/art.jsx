"use client";

import { Img } from "@/components/shared/ui/Img";
import { photo } from "@/data/media";
import { CATEGORY_ART } from "./lots";
import { cx } from "./ui";

/**
 * Category artwork: a lifestyle photo that fills the tile, or a cut-out
 * composition standing on a neutral tone. Always decorative — the tile's
 * label carries the name.
 */
export function CategoryArt({ slug, sizes = "(min-width: 1024px) 25vw, 50vw", className = "", priority = false }) {
  const art = CATEGORY_ART[slug];
  if (!art) return null;
  if (art.scene) {
    return (
      <Img
        image={art.scene}
        alt=""
        sizes={sizes}
        priority={priority}
        style={{ objectPosition: art.position }}
        className={cx("absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]", className)}
      />
    );
  }
  return (
    <div className={cx("absolute inset-0", className)} style={{ background: `var(--vm-tone-${art.tone})` }}>
      <div className="absolute inset-x-[8%] bottom-[24%] top-[12%] flex items-end justify-center gap-[3%] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]">
        {art.cutouts.map((key, i) => (
          <Img
            key={key}
            image={photo(key, 0)}
            cutout
            alt=""
            sizes="(min-width: 1024px) 18vw, 40vw"
            className="vm-floor w-auto max-w-[62%] object-contain"
            style={{ height: i === 0 ? "100%" : "64%" }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * A single cut-out standing on the hero's field (purely decorative).
 * `height` is px (width follows the cut-out's ratio) or a CSS length.
 */
export function Cutout({ image, height, className = "", style, sizes = "240px", priority = false }) {
  const ratio = image?.cutout?.ratio || 1;
  const fixed = typeof height === "number";
  return (
    <Img
      image={image}
      cutout
      alt=""
      sizes={sizes}
      priority={priority}
      className={cx("vm-floor pointer-events-none max-w-none select-none object-contain", className)}
      style={{ height, width: fixed ? Math.round(height * ratio) : "auto", aspectRatio: fixed ? undefined : String(ratio), ...style }}
    />
  );
}
