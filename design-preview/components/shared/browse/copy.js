// Browse wording shared by the four options (EN / AR). Each option decides
// how it looks; the words stay the same so the pages compare like for like.
// Marketplace words that already exist (Current bid, Bid now, Filters, sort
// names …) come from data/ui.js.
export const BROWSE_COPY = {
  // Page context
  marketplace: { en: "Marketplace", ar: "السوق" },
  allLots: { en: "All lots", ar: "كل المنتجات" },
  timedAuctions: { en: "Timed auctions", ar: "المزادات المحددة بوقت" },
  buyNow: { en: "Buy Now", ar: "الشراء الفوري" },
  resultsFor: { en: "Results for “{q}”", ar: "نتائج البحث عن «{q}»" },
  quoted: { en: "“{q}”", ar: "«{q}»" },
  intro: {
    en: "Timed auctions first, then Buy Now. Every lot is graded.",
    ar: "المزادات المحددة بوقت أولاً، ثم الشراء الفوري. وكل منتج مصنَّف بدرجة حالته.",
  },
  auctionsIntro: { en: "Bid before the clock runs out. Closing soonest first.", ar: "زايد قبل انتهاء الوقت. الأقرب انتهاءً أولاً." },
  buyNowIntro: { en: "Fixed prices, ready to order today.", ar: "أسعار ثابتة وجاهزة للطلب اليوم." },
  resultsLabel: { en: "Results", ar: "النتائج" },
  showingRange: { en: "{from}–{to} of {total}", ar: "{from}–{to} من {total}" },
  showingRangeLong: { en: "Showing {from}–{to} of {total}", ar: "عرض {from}–{to} من {total}" },

  // Sale mode
  saleType: { en: "Sale type", ar: "نوع البيع" },
  all: { en: "All", ar: "الكل" },
  auctions: { en: "Auctions", ar: "المزادات" },
  auctionAndBuyNow: { en: "Auction + Buy Now", ar: "مزاد + شراء فوري" },
  timedAuction: { en: "Timed auction", ar: "مزاد بوقت محدد" },

  // Live auction destination
  liveNow: { en: "Live now", ar: "مباشر الآن" },
  joinLive: { en: "Join live auction", ar: "انضم إلى المزاد المباشر" },
  joinShort: { en: "Join", ar: "انضم" },
  watchingNow: { en: "{n} watching", ar: "{n} يشاهدون" },
  liveDestination: { en: "Live auction", ar: "المزاد المباشر" },

  // Auction pulse (counts from the catalogue)
  liveAuctionsCount: { en: "Auctions open", ar: "مزادات مفتوحة" },
  closingHour: { en: "Closing within an hour", ar: "تُغلق خلال ساعة" },
  closingToday: { en: "Closing today", ar: "تُغلق اليوم" },

  // Filters
  filters: { en: "Filters", ar: "عوامل التصفية" },
  moreFilters: { en: "All filters", ar: "كل عوامل التصفية" },
  activeFilters: { en: "Active filters", ar: "عوامل التصفية النشطة" },
  removeFilter: { en: "Remove filter: {label}", ar: "إزالة عامل التصفية: {label}" },
  endsWithin: { en: "Ends within {window}", ar: "ينتهي خلال {window}" },
  endingUnderHour: { en: "Ending within 1 hour", ar: "ينتهي خلال ساعة" },
  endingUnderHourShort: { en: "Ending < 1h", ar: "ينتهي خلال ساعة" },
  priceUpTo: { en: "Up to {price}", ar: "حتى {price}" },
  anyCategory: { en: "All categories", ar: "كل الفئات" },
  filterCount: { en: "{n} active", ar: "{n} نشط" },
  quickFilters: { en: "Quick filters", ar: "عوامل تصفية سريعة" },
  categoriesLabel: { en: "Categories", ar: "الفئات" },
  saleAndTime: { en: "Auction timing", ar: "توقيت المزاد" },

  // Sort and view
  sortSheet: { en: "Sort lots", ar: "ترتيب المنتجات" },
  viewAs: { en: "View", ar: "طريقة العرض" },
  done: { en: "Done", ar: "تم" },
  close: { en: "Close", ar: "إغلاق" },

  // Search inside Browse
  searchLabel: { en: "Search lots", ar: "ابحث في المنتجات" },
  searchPlaceholder: { en: "Search products, categories and sellers", ar: "ابحث عن منتجات وفئات وبائعين" },
  searchPlaceholderShort: { en: "Search lots", ar: "ابحث في المنتجات" },
  search: { en: "Search", ar: "بحث" },
  searchScope: { en: "Search in", ar: "البحث في" },
  clearSearch: { en: "Clear search", ar: "مسح البحث" },

  // Results
  groupAuctions: { en: "Auctions closing first", ar: "المزادات الأقرب انتهاءً أولاً" },
  groupBuyNow: { en: "Buy Now", ar: "الشراء الفوري" },
  groupUpcoming: { en: "Coming up and closed", ar: "مزادات قادمة ومنتهية" },
  bidNamed: { en: "Bid now on {title}", ar: "زايد الآن على {title}" },
  viewNamed: { en: "View {title}", ar: "عرض {title}" },
  addNamed: { en: "Add {title} to cart", ar: "أضف {title} إلى السلة" },
  addedToCart: { en: "Added to cart", ar: "أُضيف إلى السلة" },
  timeLeft: { en: "Time left", ar: "الوقت المتبقي" },
  viewLot: { en: "View lot", ar: "عرض المنتج" },
  viewResult: { en: "View result", ar: "عرض النتيجة" },
  buyNowFor: { en: "or buy now", ar: "أو اشترِه الآن" },
  fullPallet: { en: "Full pallet · {units}", ar: "طبلية كاملة · {units}" },
  carton: { en: "Carton · {units}", ar: "كرتونة · {units}" },
  wasPrice: { en: "Was", ar: "كان" },

  // Empty states
  emptySearchTitle: { en: "No lots match “{q}”", ar: "لا توجد منتجات تطابق «{q}»" },
  emptySearchText: {
    en: "Check the spelling, try a broader word or clear the search to see every lot.",
    ar: "تحقّق من الكتابة أو جرّب كلمة أعم أو امسح البحث لعرض كل المنتجات.",
  },
  emptyFilterTitle: { en: "No lots match these filters", ar: "لا توجد منتجات تطابق عوامل التصفية هذه" },
  emptyFilterText: {
    en: "Remove a filter or two, or clear them all to see the whole marketplace.",
    ar: "أزل عاملاً أو اثنين، أو امسحها كلها لعرض السوق بأكمله.",
  },
  browseAll: { en: "Browse all lots", ar: "تصفّح كل المنتجات" },
  backHome: { en: "Back to home", ar: "العودة إلى الرئيسية" },
  tryThese: { en: "Popular searches", ar: "عمليات بحث شائعة" },

  // Pagination
  pageOf: { en: "Page {n} of {total}", ar: "الصفحة {n} من {total}" },
  goToPage: { en: "Go to page {n}", ar: "انتقل إلى الصفحة {n}" },
};
