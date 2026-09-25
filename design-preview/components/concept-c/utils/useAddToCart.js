"use client";

import { useCallback } from "react";
import { useLang } from "@/components/shared/providers/LangProvider";
import { useStore } from "@/components/shared/providers/PreviewStore";
import { COPY } from "../copy";

/** Adds a Buy Now lot to the cart, respecting stock and full-lot rules. */
export function useAddToCart() {
  const { cart, addToCart, toast } = useStore();
  const { ui, t } = useLang();
  return useCallback(
    (product, qty = 1) => {
      const inCart = cart.find((item) => item.slug === product.slug)?.qty || 0;
      const max = product.fullStockRequired ? 1 : product.stock;
      if (max <= 0) return false;
      if (inCart + qty > max) {
        toast({ tone: "warning", title: t(COPY.maxQty, { n: max }), description: t(product.title) });
        return false;
      }
      addToCart(product.slug, qty);
      toast({ tone: "success", title: ui("addedToCart"), description: t(product.title) });
      return true;
    },
    [cart, addToCart, toast, ui, t],
  );
}
