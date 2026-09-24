// Normalises the generated image manifest (scripts/process-images.py) into
// objects the UI can render responsively. Every concept reads imagery through
// this module so all four designs show exactly the same photographs.
import manifest from "./catalog-manifest.json";

const BASE = "/images/catalog/";

function toSources(files) {
  return files.map((file) => ({ src: BASE + file.file, w: file.w, h: file.h }));
}

function normalise(entry) {
  if (!entry) return null;
  return {
    kind: entry.kind, // "product" (square, white backdrop) | "scene" (lifestyle)
    ratio: entry.ratio,
    sources: toSources(entry.files),
    cutout: entry.cutout
      ? { ratio: entry.cutout.ratio, sources: toSources(entry.cutout.files) }
      : null,
  };
}

/** All images for a photo set (see data/catalog-manifest.json keys). */
export function photoSet(key) {
  const set = manifest[key];
  if (!set) throw new Error(`Unknown photo set: ${key}`);
  return set.images.map(normalise);
}

/** A single image from a photo set. */
export function photo(key, index = 0) {
  return photoSet(key)[index] || null;
}

/** Transparent cut-out of the main product shot, when available. */
export function cutout(key) {
  const first = photo(key, 0);
  return first?.cutout ? { kind: "cutout", ratio: first.cutout.ratio, sources: first.cutout.sources } : null;
}

/** Shared brand photography reused from the current Khazna site. */
export const BRAND_PHOTOS = {
  warehouseRiyadh: {
    kind: "scene",
    ratio: 1.5,
    sources: [
      { src: "/images/brand/warehouse-riyadh-800.webp", w: 800, h: 533 },
      { src: "/images/brand/warehouse-riyadh-1536.webp", w: 1536, h: 1024 },
    ],
  },
  warehouseFloor: {
    kind: "scene",
    ratio: 1.7699,
    sources: [
      { src: "/images/brand/warehouse-floor-1200.webp", w: 1200, h: 678 },
      { src: "/images/brand/warehouse-floor-2400.webp", w: 2400, h: 1356 },
    ],
  },
};
