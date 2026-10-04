"use client";

import { resolveProduct } from "@/components/shared/product/hooks";
import { ProductView } from "../product/ProductView";

export function ProductPage({ slug }) {
  const product = resolveProduct(slug);
  // Keyed by slug so quantity and gallery state reset between products.
  return <ProductView key={product.slug} product={product} />;
}
