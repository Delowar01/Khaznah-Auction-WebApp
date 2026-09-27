// Option 4 — Discovery Commerce (Round 3B): copy unique to this design.
// Shared marketplace strings live in data/ui.js; shared content (hero, trust
// points, how it works, footer, newsletter) lives in data/site.js. Business
// claims reuse Option 1's approved wording.

export const COPY = {
  skip: { en: "Skip to content", ar: "انتقل إلى المحتوى" },
  home: { en: "Khazna home", ar: "الصفحة الرئيسية لخزنة" },

  // Header
  discover: { en: "Discover", ar: "اكتشف" },
  discoverTitle: { en: "Discover Khazna", ar: "اكتشف خزنة" },
  shortcuts: { en: "Shortcuts", ar: "اختصارات" },
  searchLabel: { en: "Search Khazna", ar: "ابحث في خزنة" },
  searchPlaceholder: { en: "Search lots, brands and categories", ar: "ابحث عن منتجات أو علامات تجارية أو فئات" },
  searchButton: { en: "Search", ar: "بحث" },
  popularSearches: { en: "Popular searches", ar: "عمليات بحث شائعة" },
  resultsLots: { en: "Lots", ar: "المنتجات" },
  resultsCategories: { en: "Categories", ar: "الفئات" },
  noMatch: { en: "No lots match “{q}” yet — try another word.", ar: "لا توجد منتجات تطابق «{q}» — جرّب كلمة أخرى." },
  seeAllResults: { en: "See all results for “{q}”", ar: "عرض كل نتائج «{q}»" },
  deliverTo: { en: "Deliver to", ar: "التوصيل إلى" },
  chooseCity: { en: "Choose your delivery city", ar: "اختر مدينة التوصيل" },
  deliveryText: { en: "Delivery is priced for your address at checkout.", ar: "تُحسب تكلفة التوصيل لعنوانك عند إتمام الشراء." },
  saved: { en: "Saved", ar: "المحفوظات" },
  savedCount: { en: "Saved lots, {n}", ar: "المنتجات المحفوظة، {n}" },
  savedEmpty: { en: "Tap the heart on any lot to follow its price and closing time.", ar: "اضغط على القلب في أي منتج لمتابعة سعره ووقت إغلاقه." },
  cart: { en: "Cart", ar: "السلة" },
  cartCount: { en: "Cart, {n} items", ar: "السلة، {n} منتج" },
  account: { en: "Account", ar: "الحساب" },
  hello: { en: "Hello, {name}", ar: "مرحباً، {name}" },
  walletBalance: { en: "Wallet balance", ar: "رصيد المحفظة" },
  myBids: { en: "My bids", ar: "مزايداتي" },
  myBidsText: { en: "Bids you place appear here with their live status.", ar: "تظهر هنا مزايداتك مع حالتها المباشرة." },
  orders: { en: "Orders", ar: "الطلبات" },
  ordersText: { en: "You have no orders yet.", ar: "لا توجد لديك طلبات بعد." },
  openMenu: { en: "Open the Discover menu", ar: "فتح قائمة الاكتشاف" },
  close: { en: "Close", ar: "إغلاق" },
  switchLanguage: { en: "العربية", ar: "English" },
  switchLanguageLabel: { en: "Switch to Arabic", ar: "التبديل إلى الإنجليزية" },

  // Shortcut chips
  chipDeals: { en: "Deals", ar: "العروض" },
  chipNew: { en: "New in", ar: "وصل حديثاً" },
  chipEnding: { en: "Ending soon", ar: "تنتهي قريباً" },
  chipLive: { en: "Live now", ar: "مباشر الآن" },
  chipPallets: { en: "Pallets & bulk", ar: "طبليات وجملة" },
  chipUnder: { en: "Under {amount}", ar: "أقل من {amount}" },
  chipGrade: { en: "New & Grade A", ar: "جديد والدرجة A" },
  chipSellers: { en: "Sellers", ar: "البائعون" },

  // Discovery board
  boardTitle: { en: "What will you discover today?", ar: "ماذا ستكتشف اليوم؟" },
  boardSub: { en: "Graded stock from Saudi warehouses — buy it now or bid on it.", ar: "مخزون مصنّف من مستودعات سعودية — اشترِه فوراً أو زايد عليه." },
  collectionOf: { en: "Collection", ar: "مجموعة" },
  collectionCount: { en: "{n} lots · from {amount}", ar: "{n} منتجات · ابتداءً من {amount}" },
  exploreCollection: { en: "Explore the collection", ar: "استكشف المجموعة" },
  dealOfDay: { en: "Deal of the day", ar: "عرض اليوم" },
  newIn: { en: "New in", ar: "وصل حديثاً" },
  listedAgo: { en: "Listed {time}", ar: "أُدرج {time}" },
  liveNow: { en: "Live now", ar: "مباشر الآن" },
  endingSoon: { en: "Ending soon", ar: "ينتهي قريباً" },
  closesIn: { en: "Closes in {time}", ar: "يُغلق خلال {time}" },
  join: { en: "Join", ar: "انضم" },

  // Category explorer
  categoriesTitle: { en: "Explore categories", ar: "استكشف الفئات" },
  categoriesSub: { en: "Graded stock across eight departments", ar: "مخزون مصنّف في ثماني فئات" },
  quickFinds: { en: "Quick finds", ar: "اختيارات سريعة" },
  allCategories: { en: "All categories", ar: "كل الفئات" },
  prev: { en: "Scroll back", ar: "التمرير للخلف" },
  next: { en: "Scroll forward", ar: "التمرير للأمام" },

  // Price drops
  dropsTitle: { en: "Price drops", ar: "انخفاض الأسعار" },
  dropsSub: { en: "Fixed prices and disclosed grades, ready to ship or collect", ar: "أسعار ثابتة ودرجات معلنة، جاهزة للشحن أو الاستلام" },
  seeAllDeals: { en: "See all deals", ar: "عرض كل العروض" },
  save: { en: "Save {amount}", ar: "وفّر {amount}" },

  // Auctions
  auctionsTitle: { en: "Auctions, live and timed", ar: "المزادات المباشرة والمحددة بوقت" },
  auctionsSub: { en: "Prices update live — a bid in the final 5 minutes extends the clock.", ar: "الأسعار تتحدّث مباشرة — والمزايدة في آخر 5 دقائق تمدّد الوقت." },
  seeAllAuctions: { en: "See all {n} auctions", ar: "عرض كل المزادات ({n})" },
  endingRail: { en: "Ending soon", ar: "تنتهي قريباً" },
  onTheBlock: { en: "On the block now", ar: "المعروض الآن" },
  lotClock: { en: "Lot closes in {n}s", ar: "يُغلق المنتج خلال {n} ث" },
  betweenLots: { en: "Next lot in {n}s", ar: "المنتج التالي خلال {n} ث" },
  joinLive: { en: "Join the live sale", ar: "انضم إلى المزاد المباشر" },
  upcomingLive: { en: "Upcoming live sales", ar: "مزادات مباشرة قادمة" },
  startsIn: { en: "Starts in {time}", ar: "يبدأ خلال {time}" },
  remindMe: { en: "Remind me", ar: "ذكّرني" },
  reminderOn: { en: "Reminder on", ar: "التذكير مفعّل" },
  concept: { en: "Concept", ar: "مفهوم" },
  bidNow: { en: "Bid", ar: "زايد" },

  // Collections
  collectionsTitle: { en: "Collections", ar: "مجموعات" },
  collectionsSub: { en: "Themed sets of lots from across the catalogue", ar: "مجموعات موضوعية من منتجات الكتالوج" },
  shopCollection: { en: "Shop the collection", ar: "تسوّق المجموعة" },

  // Sellers
  sellersTitle: { en: "Shop by seller", ar: "تسوّق حسب البائع" },
  sellersSub: { en: "Saudi warehouses and outlets on Khazna", ar: "مستودعات ومنافذ سعودية على خزنة" },
  visitShop: { en: "Visit shop", ar: "زيارة المتجر" },
  hosting: { en: "Live now", ar: "مباشر الآن" },
  sellerLine: { en: "{lots} · {city}", ar: "{lots} · {city}" },
  allSellers: { en: "All sellers", ar: "كل البائعين" },

  // New in
  newInTitle: { en: "New in", ar: "وصل حديثاً" },
  newInSub: { en: "The latest lots, Buy Now and auctions together", ar: "أحدث المنتجات، شراء فوري ومزادات معاً" },
  showMore: { en: "Show more", ar: "عرض المزيد" },
  showLess: { en: "Show fewer", ar: "عرض أقل" },
  opensIn: { en: "Opens in {time}", ar: "يفتح خلال {time}" },
  palletUnits: { en: "{units} inside", ar: "{units} بالداخل" },

  // Why Khazna
  whyTitle: { en: "Why buy on Khazna", ar: "لماذا الشراء عبر خزنة" },
  howTitle: { en: "How it works", ar: "كيف تعمل خزنة" },
  gradesTitle: { en: "Condition grades", ar: "درجات الحالة" },
  gradesShow: { en: "What the grades mean", ar: "معنى الدرجات" },
  depositLine: { en: "Bidding deposit", ar: "تأمين المزايدة" },
  step: { en: "Step {n}", ar: "الخطوة {n}" },

  // Cart & footer
  addedToCart: { en: "Added to your cart", ar: "أُضيف إلى سلتك" },
  addNamed: { en: "Add {title} to cart", ar: "أضف {title} إلى السلة" },
  yourCart: { en: "Your cart", ar: "سلتك" },
  cartEmpty: { en: "Your cart is empty", ar: "سلتك فارغة" },
  cartEmptyText: { en: "Fixed-price lots you add appear here.", ar: "تظهر هنا المنتجات ذات السعر الثابت التي تضيفها." },
  subtotal: { en: "Subtotal", ar: "المجموع الفرعي" },
  remove: { en: "Remove", ar: "إزالة" },
  removed: { en: "Removed from your cart", ar: "أُزيل من سلتك" },
  keepExploring: { en: "Keep exploring", ar: "واصل الاستكشاف" },
  emailLabel: { en: "Email address", ar: "البريد الإلكتروني" },
  footerTag: { en: "Graded returns, surplus and pallets from Saudi warehouses.", ar: "مرتجعات وفائض مخزون وطبليات مصنّفة من مستودعات سعودية." },
  weAccept: { en: "We accept", ar: "نقبل" },
  country: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
  soldOut: { en: "Sold out", ar: "نفدت الكمية" },
};
