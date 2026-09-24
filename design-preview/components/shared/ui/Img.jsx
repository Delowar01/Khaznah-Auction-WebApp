"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

/**
 * Responsive image from the pre-optimised catalogue (see data/media.js).
 * Falls back to a neutral placeholder if a file fails to load.
 */
export function Img({
  image,
  alt,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  className = "",
  cutout = false,
  priority = false,
  placeholderClassName = "",
  ...rest
}) {
  const [failed, setFailed] = useState(false);
  const source = cutout && image?.cutout ? image.cutout : image;
  const sources = source?.sources || [];

  if (!sources.length || failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-surface-2 text-fg-3 ${className} ${placeholderClassName}`}
      >
        <ImageOff aria-hidden="true" className="size-6" strokeWidth={1.5} />
      </span>
    );
  }

  const fallback = sources[Math.min(1, sources.length - 1)];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fallback.src}
      srcSet={sources.map((s) => `${s.src} ${s.w}w`).join(", ")}
      sizes={sizes}
      width={fallback.w}
      height={fallback.h}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
