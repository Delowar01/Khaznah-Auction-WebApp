// Seller storefront copy: production's (browse/page.js seller hero,
// seller/[code]/error.js, LiveAuctionsGrid.jsx) as written; copyNew marks the
// labels of the lookup fields production returns but does not display
// (city, member since, counts, live now — inventory B.6), see flags.js.
import { copyNew } from "./flags";

export const SELLER_COPY = {
  marketplace: { en: "Khaznah marketplace", ar: "سوق خزنة" },
  headline: { en: "Verified stock, straight from the seller.", ar: "بضاعة موثّقة، مباشرة من البائع." },
  sellerChip: { en: "Seller", ar: "البائع" },
  facts: copyNew("Storefront facts", "معلومات المتجر"),
  city: copyNew("Based in {city}", "مقرّه {city}"),
  since: copyNew("Selling since {date}", "يبيع منذ {date}"),
  auctions: copyNew("Active auctions", "مزادات نشطة"),
  buyNow: copyNew("Buy Now items", "منتجات الشراء الفوري"),
  liveNow: copyNew("Live now", "مباشر الآن"),
  liveTitle: copyNew("Live auctions", "المزادات المباشرة"),
  noLive: { en: "No live auctions right now", ar: "لا توجد مزادات مباشرة حاليًا" },
  joinLive: copyNew("Join live", "انضم للمباشر"),
  listings: copyNew("Listings from {name}", "معروضات {name}"),
  // Error boundary (seller/[code]/error.js)
  errorTitle: { en: "We couldn’t load this seller catalogue", ar: "تعذر تحميل متجر البائع" },
  errorText: { en: "We did not fall back to unfiltered results. Retry to continue to the correct seller catalogue.", ar: "لم نعرض نتائج غير مفلترة. أعد المحاولة للمتابعة إلى متجر البائع الصحيح." },
  retry: { en: "Try again", ar: "إعادة المحاولة" },
  browseAll: { en: "Browse all listings", ar: "تصفح جميع المنتجات" },
};
