// Buy Now Product Detail wording shared by the four options (EN / AR). Each
// option decides how the page looks; the words stay the same so the pages
// compare like for like. Marketplace words that already exist (Price, Was,
// Save, Add to cart, Buy it now, Only {n} left …) come from data/ui.js; the
// lines below reuse Option 1's existing product copy where it had one.
export const PRODUCT_COPY = {
  // Identity
  fixedPrice: { en: "Fixed price", ar: "سعر ثابت" },
  aboutItem: { en: "About this item", ar: "عن هذا المنتج" },
  itemDetails: { en: "Item details", ar: "تفاصيل المنتج" },
  purchase: { en: "Buy this item", ar: "اشترِ هذا المنتج" },

  // Stock
  lowStock: { en: "Low stock", ar: "كمية محدودة" },
  veryLowStock: { en: "Very low stock", ar: "كمية قليلة جداً" },
  stockCount: { en: "Stock", ar: "المخزون" },

  // Quantity and total
  fullLot: { en: "Full lot", ar: "دفعة كاملة" },
  maxQty: { en: "Maximum available: {n}", ar: "الحد الأقصى المتاح: {n}" },
  totalFor: { en: "Total for {n}", ar: "الإجمالي لـ {n}" },
  inCart: { en: "In your cart: {n}", ar: "في سلتك: {n}" },

  // Information
  highlights: { en: "Highlights", ar: "أبرز المزايا" },
  deliveryReturns: { en: "Delivery & returns", ar: "التوصيل والإرجاع" },
  paymentTitle: { en: "Payment", ar: "الدفع" },
};
