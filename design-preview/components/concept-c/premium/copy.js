// Option 3 — Premium Marketplace (Round 3B): copy unique to this design.
// Shared marketplace strings live in data/ui.js; shared content (hero, trust
// points, how it works, footer, newsletter) lives in data/site.js. Business
// claims reuse Option 1's approved wording.

export const COPY = {
  skip: { en: "Skip to content", ar: "انتقل إلى المحتوى" },
  home: { en: "Khazna home", ar: "الصفحة الرئيسية لخزنة" },
  mainNav: { en: "Main", ar: "الرئيسية" },
  shop: { en: "Shop", ar: "تسوّق" },
  shopByCategory: { en: "Shop by category", ar: "تسوّق حسب الفئة" },
  waysToShop: { en: "Ways to shop", ar: "طرق التسوّق" },
  bulk: { en: "Bulk & pallets", ar: "الجملة والطبليات" },
  allCategories: { en: "All categories", ar: "كل الفئات" },
  allLots: { en: "All lots", ar: "كل المنتجات" },

  // Search
  search: { en: "Search", ar: "بحث" },
  searchLabel: { en: "Search Khazna", ar: "ابحث في خزنة" },
  searchPlaceholder: { en: "Search lots, brands and categories", ar: "ابحث عن منتجات أو علامات تجارية أو فئات" },
  closeSearch: { en: "Close search", ar: "إغلاق البحث" },
  popularSearches: { en: "Popular searches", ar: "عمليات بحث شائعة" },
  resultsLots: { en: "Lots", ar: "المنتجات" },
  resultsCategories: { en: "Categories", ar: "الفئات" },
  resultsSellers: { en: "Sellers", ar: "البائعون" },
  noMatch: { en: "No lots match “{q}” yet — try another word.", ar: "لا توجد منتجات تطابق «{q}» — جرّب كلمة أخرى." },
  seeAllResults: { en: "See all results for “{q}”", ar: "عرض كل نتائج «{q}»" },

  // Account, saved, bag, menu
  account: { en: "Account", ar: "الحساب" },
  accountMenu: { en: "Account menu", ar: "قائمة الحساب" },
  hello: { en: "Hello, {name}", ar: "مرحباً، {name}" },
  walletBalance: { en: "Wallet balance", ar: "رصيد المحفظة" },
  walletText: { en: "Covers the bidding deposit.", ar: "يغطي تأمين المزايدة." },
  myBids: { en: "My bids", ar: "مزايداتي" },
  myBidsText: { en: "Bids you place appear here with their live status.", ar: "تظهر هنا مزايداتك مع حالتها المباشرة." },
  orders: { en: "Orders", ar: "الطلبات" },
  ordersText: { en: "You have no orders yet.", ar: "لا توجد لديك طلبات بعد." },
  saved: { en: "Saved", ar: "المحفوظات" },
  savedCount: { en: "Saved lots, {n}", ar: "المنتجات المحفوظة، {n}" },
  savedEmpty: { en: "Tap the heart on any lot to follow its price and closing time.", ar: "اضغط على القلب في أي منتج لمتابعة سعره ووقت إغلاقه." },
  bag: { en: "Bag", ar: "الحقيبة" },
  bagCount: { en: "Bag, {n} items", ar: "الحقيبة، {n} منتج" },
  yourBag: { en: "Your bag", ar: "حقيبتك" },
  bagEmpty: { en: "Your bag is empty", ar: "حقيبتك فارغة" },
  bagEmptyText: { en: "Fixed-price lots you add appear here.", ar: "تظهر هنا المنتجات ذات السعر الثابت التي تضيفها." },
  subtotal: { en: "Subtotal", ar: "المجموع الفرعي" },
  remove: { en: "Remove", ar: "إزالة" },
  removed: { en: "Removed from your bag", ar: "أُزيلت من حقيبتك" },
  continueShopping: { en: "Continue shopping", ar: "متابعة التسوّق" },
  addedToBag: { en: "Added to your bag", ar: "أُضيف إلى حقيبتك" },
  addNamed: { en: "Add {title} to bag", ar: "أضف {title} إلى الحقيبة" },
  menu: { en: "Menu", ar: "القائمة" },
  openMenu: { en: "Open menu", ar: "فتح القائمة" },
  closeMenu: { en: "Close menu", ar: "إغلاق القائمة" },
  close: { en: "Close", ar: "إغلاق" },
  switchLanguage: { en: "العربية", ar: "English" },
  switchLanguageLabel: { en: "Switch to Arabic", ar: "التبديل إلى الإنجليزية" },

  // Hero
  featuredLot: { en: "Featured lot", ar: "منتج مميز" },
  shopDepartments: { en: "Shop departments", ar: "تسوّق الأقسام" },
  heroPhoto: { en: "The featured lot in a living room", ar: "المنتج المميز في غرفة معيشة" },

  // Categories
  departments: { en: "Departments", ar: "الأقسام" },
  categoriesSub: { en: "Graded stock across eight departments", ar: "مخزون مصنّف في ثماني فئات" },

  // Buy Now edit
  buyNowEyebrow: { en: "Buy Now", ar: "الشراء الفوري" },
  buyNowTitle: { en: "The Buy Now edit", ar: "مختارات الشراء الفوري" },
  buyNowSub: { en: "Fixed prices and disclosed grades, ready to ship or collect", ar: "أسعار ثابتة ودرجات معلنة، جاهزة للشحن أو الاستلام" },
  buyNowView: { en: "Buy Now lots to show", ar: "منتجات الشراء الفوري المعروضة" },
  tabBestValue: { en: "Best value", ar: "الأفضل قيمة" },
  tabNew: { en: "New arrivals", ar: "وصل حديثاً" },
  tabAll: { en: "All", ar: "الكل" },
  shopAllBuyNow: { en: "Shop all {n} Buy Now lots", ar: "تسوّق كل منتجات الشراء الفوري ({n})" },
  soldOut: { en: "Sold out", ar: "نفدت الكمية" },
  newTag: { en: "New", ar: "جديد" },

  // Auctions
  auctionsEyebrow: { en: "Timed auctions", ar: "مزادات محددة المدة" },
  closingTitle: { en: "Closing soon", ar: "تُغلق قريباً" },
  auctionsView: { en: "Auctions to show", ar: "المزادات المعروضة" },
  tabClosing: { en: "Closing soon", ar: "تُغلق قريباً" },
  tabMostBid: { en: "Most bid", ar: "الأكثر مزايدة" },
  closingNext: { en: "Closing next", ar: "التالي في الإغلاق" },
  mostBidLead: { en: "Most bid right now", ar: "الأكثر مزايدة الآن" },
  allAuctions: { en: "All {n} auctions", ar: "كل المزادات ({n})" },
  closesIn: { en: "Closes in {time}", ar: "يُغلق خلال {time}" },

  // Sellers
  sellersEyebrow: { en: "Sellers", ar: "البائعون" },
  sellersTitle: { en: "Featured sellers", ar: "بائعون مميزون" },
  sellersSub: { en: "Saudi warehouses and outlets on Khazna", ar: "مستودعات ومنافذ سعودية على خزنة" },
  allSellers: { en: "All sellers", ar: "كل البائعين" },
  prevSellers: { en: "Previous sellers", ar: "البائعون السابقون" },
  nextSellers: { en: "More sellers", ar: "مزيد من البائعين" },
  hosting: { en: "Hosting a live sale now", ar: "يستضيف مزاداً مباشراً الآن" },
  visitStorefront: { en: "Visit storefront", ar: "زيارة المتجر" },
  sellerCounts: { en: "{auctions} auctions · {buyNow} Buy Now", ar: "{auctions} مزادات · {buyNow} شراء فوري" },
  inNumbers: { en: "Khazna in numbers", ar: "خزنة بالأرقام" },
  statMillion: { en: "{value} million Saudi riyals", ar: "{value} مليون ريال سعودي" },

  // Live salon
  liveEyebrow: { en: "Live auctions", ar: "المزادات المباشرة" },
  liveSub: { en: "Presenter-led sales streamed from Saudi warehouses", ar: "مزادات يقدّمها مقدّمون ببث مباشر من مستودعات سعودية" },
  onTheBlock: { en: "On the block now", ar: "المعروض الآن" },
  lotClock: { en: "Lot closes in", ar: "يُغلق المنتج خلال" },
  secondsShort: { en: "{n}s", ar: "{n} ث" },
  betweenLots: { en: "Next lot in {n}s", ar: "المنتج التالي خلال {n} ث" },
  roomNote: { en: "Bidding happens inside the live room.", ar: "تتم المزايدة داخل غرفة المزاد المباشر." },
  upcomingTitle: { en: "Upcoming live sales", ar: "مزادات مباشرة قادمة" },
  startsIn: { en: "Starts in {time}", ar: "يبدأ خلال {time}" },
  hostedBy: { en: "Hosted by {name}", ar: "يستضيفه {name}" },
  remindMe: { en: "Remind me", ar: "ذكّرني" },
  reminderOn: { en: "Reminder on", ar: "التذكير مفعّل" },
  concept: { en: "Concept", ar: "مفهوم" },

  // Trade
  tradeEyebrow: { en: "For trade buyers", ar: "لمشتري الجملة" },
  palletsTitle: { en: "Bulk pallets, sold as one lot", ar: "طبليات بالجملة تُباع كدفعة واحدة" },
  palletsFrom: { en: "From", ar: "ابتداءً من" },
  palletsBody: {
    en: "Full pallets and sealed cartons with line-by-line manifests — built for resellers, workshops and offices.",
    ar: "طبليات كاملة وكراتين مختومة مع بيان تفصيلي لكل بند — مناسبة لتجار التجزئة والورش والمكاتب.",
  },
  palletsPoints: [
    { en: "Line-by-line manifest", ar: "بيان تفصيلي لكل بند" },
    { en: "Condition grade shown", ar: "درجة الحالة ظاهرة" },
    { en: "Pickup or delivery", ar: "استلام أو توصيل" },
  ],
  manifestLine: { en: "{units} · {lines} product lines", ar: "{units} · {lines} بنود" },
  fullLot: { en: "Full lot", ar: "دفعة كاملة" },
  shopPallets: { en: "Shop bulk & pallets", ar: "تسوّق الجملة والطبليات" },

  // Buying on Khazna
  buyingTitle: { en: "Buying on Khazna", ar: "الشراء عبر خزنة" },
  buyingSub: { en: "What to know before you bid or buy", ar: "ما تحتاج معرفته قبل أن تزايد أو تشتري" },
  whyTitle: { en: "Why buy on Khazna", ar: "لماذا الشراء عبر خزنة" },
  howTitle: { en: "How it works", ar: "كيف تعمل خزنة" },
  gradesTitle: { en: "Condition grades", ar: "درجات الحالة" },
  gradesText: { en: "Every lot is listed with a condition grade, from New to F.", ar: "يُعرض كل منتج بدرجة حالة، من «جديد» حتى F." },
  depositLine: { en: "Bidding deposit", ar: "تأمين المزايدة" },
  step: { en: "Step {n}", ar: "الخطوة {n}" },

  // Footer
  newsletterEyebrow: { en: "Newsletter", ar: "النشرة البريدية" },
  emailLabel: { en: "Email address", ar: "البريد الإلكتروني" },
  footerTag: { en: "Graded returns, surplus and pallets from Saudi warehouses.", ar: "مرتجعات وفائض مخزون وطبليات مصنّفة من مستودعات سعودية." },
  weAccept: { en: "We accept", ar: "نقبل" },
  country: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
};
