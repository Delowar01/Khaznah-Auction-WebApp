"use client";

import { getProduct, isBuyNow, FEATURED_PRODUCT } from "@/data/products";
import { ProductView } from "../product/ProductView";

export function ProductPage({ slug }) {
  const found = getProduct(slug);
  const product = found && isBuyNow(found) ? found : getProduct(FEATURED_PRODUCT);
  // Keyed by slug so quantity and gallery state reset between products.
  return <ProductView key={product.slug} product={product} />;
}
