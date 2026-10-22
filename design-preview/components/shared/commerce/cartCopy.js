// Cart copy. Production's cart page (frontend/src/app/(main)/cart/page.js)
// words as written; arNew marks lines production shows in English only,
// copyNew presentation copy production does not have (see flags.js).
import { arNew, copyNew } from "./flags";

export const CART_COPY = {
  kicker: { en: "Shopping cart", ar: "سلة التسوق" },
  title: { en: "Review your cart", ar: "راجع سلة التسوق" },
  intro: { en: "Update quantities and continue to checkout.", ar: "حدّث الكميات وتابع إلى الدفع." },

  itemsTitle: { en: "Cart items", ar: "المنتجات" },
  soldBy: copyNew("Sold by {name}", "يبيعه {name}"),
  soldByLead: copyNew("Sold by", "يبيعه"),
  sellersNote: copyNew("Items from {n} sellers — checkout places one order per seller.", "منتجات من {n} بائعين — يُنشئ إتمام الشراء طلباً لكل بائع."),

  // Line
  removeItem: { en: "Remove item", ar: "حذف المنتج" },
  removeConfirm: { en: "Remove Item?", ar: "هل تريد حذف المنتج؟" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  remove: { en: "Remove", ar: "حذف" },
  quantity: { en: "Quantity", ar: "الكمية" },
  decrease: copyNew("Decrease quantity of {title}", "إنقاص كمية {title}"),
  increase: copyNew("Increase quantity of {title}", "زيادة كمية {title}"),
  quantityOf: copyNew("Quantity of {title}", "كمية {title}"),
  palletLocked: { en: "Packed pallet · full lot required", ar: "منصة نقالة مغلقة · يجب شراء كامل الكمية" },
  auctionLocked: { en: "Full stock required to close the auction", ar: "يجب شراء كامل المخزون لإغلاق المزاد" },
  lockedShort: copyNew("Full lot", "الدفعة كاملة"),
  outOfStock: arNew("Out of stock", "نفدت الكمية"),
  onlyLeft: arNew("Only {n} left", "متبقٍ {n} فقط"),
  overStock: copyNew("More than the {n} available — lower the quantity.", "أكثر من المتاح ({n}) — خفّض الكمية."),
  unit: { en: "Unit", ar: "الوحدة" },
  total: { en: "Total", ar: "الإجمالي" },

  // Summary
  summary: { en: "Order Summary", ar: "ملخص الطلب" },
  products: { en: "Products", ar: "المنتجات" },
  discountApplied: { en: "Discount applied", ar: "تم تطبيق الخصم" },
  vatIncluded: copyNew("Prices include VAT. Delivery is priced at checkout.", "الأسعار تشمل ضريبة القيمة المضافة. يُحسب التوصيل عند إتمام الشراء."),
  proceed: { en: "Proceed to Checkout", ar: "المتابعة إلى الدفع" },
  blocked: arNew("Update unavailable items before checkout", "حدّث المنتجات غير المتاحة قبل إتمام الشراء"),
  secureNote: { en: "Your payment information is encrypted and secure.", ar: "معلومات الدفع الخاصة بك مشفرة وآمنة." },
  guestNote: copyNew("You're shopping as a guest. Sign in at checkout — your cart stays with you.", "أنت تتسوق كزائر. سجّل الدخول عند إتمام الشراء — تبقى سلتك كما هي."),

  // Empty
  emptyTitle: { en: "Your cart is empty", ar: "سلة التسوق فارغة" },
  emptyText: { en: "Browse our auctions and buy-now items to start shopping.", ar: "تصفح مزاداتنا ومنتجات الشراء الفوري لبدء التسوق." },
  browseNow: { en: "Browse Now", ar: "تصفح الآن" },

  // Feedback
  removed: { en: "Item removed from cart", ar: "تم حذف المنتج من السلة" },
  updateFailed: { en: "The cart could not be updated", ar: "تعذر تحديث السلة" },
  removeFailed: { en: "The item could not be removed", ar: "تعذر حذف المنتج" },
  loading: copyNew("Loading your cart", "جارٍ تحميل سلتك"),
  loadFailed: copyNew("We couldn't load your cart", "تعذّر تحميل سلتك"),
  loadFailedText: copyNew("Check your connection and try again. Nothing in your cart has changed.", "تحقق من اتصالك وحاول مرة أخرى. لم يتغيّر شيء في سلتك."),
};
