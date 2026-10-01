// Option 3 — Visual Discovery Marketplace: interface copy (EN / AR).
// English follows the approved design's copy; Arabic is written for this
// design. Shared marketplace words come from data/ui.js and data/grades.js.
export const COPY = {
  // Header
  home: { en: "Khaznah home", ar: "الصفحة الرئيسية لخزنة" },
  modes: { en: "Ways to shop", ar: "طرق التسوّق" },
  discover: { en: "Discover", ar: "اكتشف" },
  navBuyNow: { en: "Buy Now", ar: "الشراء الفوري" },
  navTimed: { en: "Timed Auctions", ar: "المزادات المحددة بوقت" },
  navLive: { en: "Live Auction", ar: "المزاد المباشر" },
  navSellers: { en: "Sellers", ar: "البائعون" },
  navBulk: { en: "Bulk & Pallets", ar: "الجملة والطبليات" },
  searchLabel: { en: "Search Khaznah", ar: "ابحث في خزنة" },
  searchPlaceholder: { en: "Search products, categories and sellers", ar: "ابحث عن المنتجات والفئات والبائعين" },
  popularSearches: { en: "Popular searches", ar: "عمليات بحث شائعة" },
  resultsLots: { en: "Lots", ar: "المنتجات" },
  resultsCategories: { en: "Categories", ar: "الفئات" },
  resultsSellers: { en: "Sellers", ar: "البائعون" },
  noMatch: { en: "No lots match “{q}”.", ar: "لا توجد منتجات تطابق «{q}»." },
  seeAllResults: { en: "See all results for “{q}”", ar: "عرض كل النتائج لـ «{q}»" },
  location: { en: "Delivery location", ar: "موقع التوصيل" },
  chooseCity: { en: "Choose your city", ar: "اختر مدينتك" },
  cityText: { en: "Delivery and pickup options are shown on each listing.", ar: "تظهر خيارات التوصيل والاستلام في كل منتج." },
  language: { en: "Language", ar: "اللغة" },
  account: { en: "My account", ar: "حسابي" },
  hello: { en: "Hello, {name}", ar: "مرحباً، {name}" },
  walletBalance: { en: "Wallet balance", ar: "رصيد المحفظة" },
  myBids: { en: "My bids", ar: "مزايداتي" },
  myBidsText: { en: "Your bids appear here in the full site.", ar: "تظهر مزايداتك هنا في الموقع الكامل." },
  saved: { en: "Saved lots", ar: "المنتجات المحفوظة" },
  savedEmpty: { en: "Save lots with the heart to find them here.", ar: "احفظ المنتجات بالقلب لتجدها هنا." },
  cart: { en: "Cart", ar: "السلة" },
  cartCount: { en: "Cart, {n} items", ar: "السلة، {n} منتج" },
  openMenu: { en: "Open menu", ar: "فتح القائمة" },
  menu: { en: "Menu", ar: "القائمة" },
  skip: { en: "Skip to content", ar: "انتقل إلى المحتوى" },

  // Hero mosaic
  heroTitle: [
    { en: "Find your", ar: "اعثر على" },
    { en: "next great", ar: "صفقتك" },
    { en: "find.", ar: "القادمة." },
  ],
  heroSub: { en: "Bid, buy now or discover something unexpected.", ar: "زايد أو اشترِ فوراً أو اكتشف ما لم تتوقعه." },
  shopBuyNow: { en: "Shop Buy Now", ar: "تسوّق الشراء الفوري" },
  exploreAuctions: { en: "Explore auctions", ar: "تصفّح المزادات" },
  handwritten: [
    { en: "Good things", ar: "الأشياء الجميلة" },
    { en: "find new homes.", ar: "تجد بيوتاً جديدة." },
  ],
  furniture: { en: "Furniture", ar: "الأثاث" },
  furnitureText: { en: "Stylish picks for every space", ar: "اختيارات أنيقة لكل مساحة" },
  explore: { en: "Explore", ar: "استكشف" },
  exploreNamed: { en: "Explore {name}", ar: "استكشف {name}" },
  electronicsText: { en: "Top brands, great finds", ar: "علامات معروفة وصفقات رائعة" },
  kitchenText: { en: "Everything for your home.", ar: "كل ما يحتاجه منزلك." },

  // Categories
  categoriesLabel: { en: "Shop by category", ar: "تسوّق حسب الفئة" },

  // Product wall
  wallTitle: { en: "Finds worth a closer look", ar: "منتجات تستحق نظرة أقرب" },
  wallView: { en: "Products to show", ar: "المنتجات المعروضة" },
  tabBuyNow: { en: "Buy Now", ar: "الشراء الفوري" },
  tabRecommended: { en: "Recommended", ar: "مقترحة" },
  recommended: { en: "Recommended", ar: "مقترح" },
  viewAllProducts: { en: "View all products", ar: "عرض كل المنتجات" },
  addNamed: { en: "Add {title} to cart", ar: "أضف {title} إلى السلة" },
  addedToCart: { en: "Added to cart", ar: "أُضيف إلى السلة" },

  // Live
  liveNow: { en: "Live now", ar: "مباشر الآن" },
  hostedBy: { en: "Hosted by {name}", ar: "يستضيفه {name}" },
  joinLive: { en: "Join live auction", ar: "انضم إلى المزاد المباشر" },
  playPreview: { en: "Watch the live auction", ar: "شاهد المزاد المباشر" },
  currentLot: { en: "On the block now", ar: "المنتج المعروض الآن" },

  // Ending soon
  endingTitle: { en: "Ending soon", ar: "تنتهي قريباً" },
  viewAllAuctions: { en: "View all auctions", ar: "عرض كل المزادات" },
  timeLeft: { en: "Time left", ar: "الوقت المتبقي" },
  bidNamed: { en: "Bid now on {title}", ar: "زايد الآن على {title}" },

  // Featured Items: auction lots first, then a few Buy Now finds
  featuredTitle: { en: "Featured Items", ar: "منتجات مميزة" },
  featuredSub: { en: "Standout auction lots to bid on, plus a few Buy Now finds.", ar: "منتجات مزاد لافتة للمزايدة عليها، مع بعض منتجات الشراء الفوري." },
  featuredAuction: { en: "Auction", ar: "مزاد" },
  featuredBuyNow: { en: "Buy Now finds", ar: "منتجات الشراء الفوري" },

  // Sellers
  sellersTitle: { en: "Explore their shelves", ar: "تصفّح رفوفهم" },
  viewAllSellers: { en: "View all sellers", ar: "عرض كل البائعين" },
  browseShop: { en: "Browse shop", ar: "تصفّح المتجر" },
  browseNamed: { en: "Browse shop: {name}", ar: "تصفّح متجر {name}" },
  sellerLines: {
    RAWABI: { en: "Home essentials for modern living", ar: "أساسيات المنزل للحياة العصرية" },
    REDSEA: { en: "Electronics and more", ar: "إلكترونيات والمزيد" },
    KHAZNA: { en: "A wide range for every need.", ar: "تشكيلة واسعة لكل احتياج." },
    MAJD: { en: "Great deals in bulk.", ar: "صفقات رائعة بالجملة." },
    SAHEL: { en: "Everyday living made simple.", ar: "حياة يومية أبسط." },
  },

  // Bulk
  bulkTitle: { en: "Bulk & Pallets", ar: "الجملة والطبليات" },
  viewAllLots: { en: "View all lots", ar: "عرض كل الطبليات" },
  viewManifest: { en: "View manifest", ar: "عرض البيان" },
  manifestNamed: { en: "View manifest: {title}", ar: "عرض البيان: {title}" },

  // Clarity + how it works
  clarityTitle: { en: "A little clarity before you shop", ar: "قليل من الوضوح قبل أن تتسوّق" },
  gradesTitle: { en: "Condition grades", ar: "درجات الحالة" },
  gradesText: { en: "Read the grade and item details.", ar: "اطّلع على الدرجة وتفاصيل المنتج." },
  gradeGuide: { en: "View grade guide", ar: "عرض دليل الدرجات" },
  gradeGuideTitle: { en: "Grade guide", ar: "دليل الدرجات" },
  sellerTitle: { en: "Know your seller", ar: "اعرف البائع" },
  sellerText: { en: "Explore seller profiles and inventory.", ar: "تصفّح ملفات البائعين ومنتجاتهم." },
  deliveryTitle: { en: "Delivery or pickup", ar: "توصيل أو استلام" },
  deliveryText: { en: "Check available options on each listing.", ar: "تحقق من الخيارات المتاحة في كل منتج." },
  howTitle: { en: "How it works", ar: "كيف تعمل خزنة" },
  steps: [
    { title: { en: "Find your item", ar: "اعثر على منتجك" }, text: { en: "Search, browse or watch live auctions.", ar: "ابحث أو تصفّح أو شاهد المزادات المباشرة." } },
    { title: { en: "Bid or buy now", ar: "زايد أو اشترِ فوراً" }, text: { en: "Choose your item and place a bid or buy now.", ar: "اختر منتجك وقدّم مزايدة أو اشترِ فوراً." } },
    { title: { en: "Arrange delivery or pickup", ar: "رتّب التوصيل أو الاستلام" }, text: { en: "Check the listing for available options.", ar: "تحقق من المنتج لمعرفة الخيارات المتاحة." } },
  ],

  // Newsletter + footer
  newsTitleA: { en: "Fresh finds,", ar: "أحدث المنتجات" },
  newsTitleB: { en: "in your inbox.", ar: "في بريدك." },
  newsText: { en: "Be the first to know about new arrivals, auctions and more.", ar: "كن أول من يعرف عن المنتجات الجديدة والمزادات وغيرها." },
  emailLabel: { en: "Email address", ar: "البريد الإلكتروني" },
  emailPlaceholder: { en: "Your email address", ar: "بريدك الإلكتروني" },
  subscribe: { en: "Subscribe", ar: "اشترك" },
  footerTag: { en: "A marketplace for great finds across Saudi Arabia.", ar: "سوق للعثور على صفقات رائعة في أنحاء المملكة." },
  footerNav: { en: "Footer", ar: "تذييل الصفحة" },
  colMarketplace: { en: "Marketplace", ar: "السوق" },
  colHelp: { en: "Help", ar: "المساعدة" },
  colAbout: { en: "About", ar: "عن خزنة" },
  linkHowItWorks: { en: "How it works", ar: "كيف تعمل خزنة" },
  linkGrades: { en: "Condition grades", ar: "درجات الحالة" },
  linkDelivery: { en: "Delivery & pickup", ar: "التوصيل والاستلام" },
  linkContact: { en: "Contact", ar: "تواصل معنا" },
  linkAbout: { en: "About Khaznah", ar: "عن خزنة" },
  linkSell: { en: "Sell on Khaznah", ar: "البيع عبر خزنة" },
  social: { en: "Khaznah on social media", ar: "خزنة على وسائل التواصل" },
  terms: { en: "Terms", ar: "الشروط" },
  privacy: { en: "Privacy", ar: "الخصوصية" },
  legal: { en: "Legal", ar: "قانوني" },
  copyright: { en: "© 2026 Khaznah. All rights reserved.", ar: "© 2026 خزنة. جميع الحقوق محفوظة." },
};
