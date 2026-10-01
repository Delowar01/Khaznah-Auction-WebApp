// Option 2 — Premium Modern Marketplace: interface copy (EN / AR).
// English follows the approved design's copy; Arabic is written for this
// design. Shared marketplace words (Buy Now, Current bid, grades …) come from
// data/ui.js and data/grades.js; products, sellers and prices from data/.
export const COPY = {
  // Header
  home: { en: "Khaznah home", ar: "الصفحة الرئيسية لخزنة" },
  mainNav: { en: "Shopping", ar: "التسوّق" },
  navBuyNow: { en: "Buy Now", ar: "الشراء الفوري" },
  navTimed: { en: "Timed Auctions", ar: "المزادات المحددة بوقت" },
  navLive: { en: "Live Auction", ar: "المزاد المباشر" },
  navSellers: { en: "Sellers", ar: "البائعون" },
  navBulk: { en: "Bulk & Pallets", ar: "الجملة والطبليات" },
  wishlist: { en: "Wishlist", ar: "المفضلة" },
  wishlistCount: { en: "Wishlist, {n} saved", ar: "المفضلة، {n} محفوظ" },
  wishlistEmpty: { en: "Save lots with the heart to find them here.", ar: "احفظ المنتجات بالقلب لتجدها هنا." },
  account: { en: "My account", ar: "حسابي" },
  hello: { en: "Hello, {name}", ar: "مرحباً، {name}" },
  walletBalance: { en: "Wallet balance", ar: "رصيد المحفظة" },
  myBids: { en: "My bids", ar: "مزايداتي" },
  myBidsText: { en: "Your bids appear here in the full site.", ar: "تظهر مزايداتك هنا في الموقع الكامل." },
  orders: { en: "Orders", ar: "الطلبات" },
  ordersText: { en: "Your orders appear here in the full site.", ar: "تظهر طلباتك هنا في الموقع الكامل." },
  cart: { en: "Cart", ar: "السلة" },
  cartCount: { en: "Cart, {n} items", ar: "السلة، {n} منتج" },
  allCategories: { en: "All categories", ar: "كل الفئات" },
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
  openMenu: { en: "Open menu", ar: "فتح القائمة" },
  menu: { en: "Menu", ar: "القائمة" },
  close: { en: "Close", ar: "إغلاق" },
  skip: { en: "Skip to content", ar: "انتقل إلى المحتوى" },

  // Hero
  heroEyebrow: { en: "Welcome to Khaznah", ar: "مرحباً بك في خزنة" },
  heroTitle: [
    { en: "Find your next", ar: "اعثر على" },
    { en: "great find.", ar: "صفقتك القادمة." },
  ],
  heroSub: { en: "Bid, buy now or discover something unexpected.", ar: "زايد أو اشترِ فوراً أو اكتشف ما لم تتوقعه." },
  shopBuyNow: { en: "Shop Buy Now", ar: "تسوّق الشراء الفوري" },
  exploreAuctions: { en: "Explore auctions", ar: "تصفّح المزادات" },
  pinLabel: { en: "Live lot in this room: {title}", ar: "منتج مباشر في هذه الغرفة: {title}" },

  // Categories
  categoriesLabel: { en: "Shop by category", ar: "تسوّق حسب الفئة" },

  // Buy Now
  buyNowTitle: { en: "Buy Now, ready to discover", ar: "الشراء الفوري، جاهز للاكتشاف" },
  buyNowSub: { en: "Explore products from our sellers.", ar: "تصفّح منتجات بائعينا." },
  addNamed: { en: "Add {title} to cart", ar: "أضف {title} إلى السلة" },
  addedToCart: { en: "Added to cart", ar: "أُضيف إلى السلة" },

  // Ending soon
  endingTitle: { en: "Ending soon", ar: "تنتهي قريباً" },
  endingSub: { en: "Bid before it’s gone. These auctions are ending soon.", ar: "زايد قبل فوات الأوان. هذه المزادات تنتهي قريباً." },
  viewAllAuctions: { en: "View all auctions", ar: "عرض كل المزادات" },
  timeLeft: { en: "Time left", ar: "الوقت المتبقي" },
  bidNamed: { en: "Bid now on {title}", ar: "زايد الآن على {title}" },

  // Featured Items: auction lots first, then a few Buy Now finds
  featuredTitle: { en: "Featured Items", ar: "منتجات مميزة" },
  featuredSub: { en: "A curated edit of auction lots, with a few Buy Now finds.", ar: "مختارات من منتجات المزاد، مع بعض منتجات الشراء الفوري." },
  featuredAllAuctions: { en: "All auctions", ar: "كل المزادات" },
  featuredAuction: { en: "Auction", ar: "مزاد" },
  featuredAlsoBuyNow: { en: "Also on Buy Now", ar: "متاح أيضاً للشراء الفوري" },

  // Recommendations
  selectedTitle: { en: "Selected for your everyday", ar: "مختارات لحياتك اليومية" },
  selectedSub: { en: "Handpicked items for your home and lifestyle.", ar: "منتجات منتقاة لمنزلك وأسلوب حياتك." },

  // Live
  liveTitle: { en: "Live auction", ar: "المزاد المباشر" },
  liveSub: { en: "Join our next live auction and bid in real time.", ar: "انضم إلى مزادنا المباشر وزايد في الوقت الفعلي." },
  liveNow: { en: "Live now", ar: "مباشر الآن" },
  featuredItem: { en: "Featured item", ar: "المنتج المعروض" },
  joinLive: { en: "Join live auction", ar: "انضم إلى المزاد المباشر" },
  playPreview: { en: "Watch the live auction", ar: "شاهد المزاد المباشر" },

  // Bulk & pallets
  bulkTitle: { en: "Bulk & Pallets", ar: "الجملة والطبليات" },
  bulkSub: { en: "Larger lots for bigger value. See the manifest for details.", ar: "كميات أكبر بقيمة أكبر. راجع البيان لمعرفة التفاصيل." },
  viewManifest: { en: "View manifest", ar: "عرض البيان" },
  manifestNamed: { en: "View manifest: {title}", ar: "عرض البيان: {title}" },

  // Sellers
  sellersTitle: { en: "Featured Sellers", ar: "بائعون مميزون" },
  sellersSub: { en: "Explore sellers and their inventory.", ar: "تعرّف على البائعين ومنتجاتهم." },
  viewAllSellers: { en: "View all sellers", ar: "عرض كل البائعين" },
  shopNow: { en: "Shop now", ar: "تسوّق الآن" },
  shopNamed: { en: "Shop now: {name}", ar: "تسوّق الآن: {name}" },

  // Trust
  trustLabel: { en: "Shopping on Khaznah", ar: "التسوّق في خزنة" },
  trustGradedTitle: { en: "Condition graded", ar: "حالة مصنّفة" },
  trustGradedText: { en: "Read the condition and photos before you buy.", ar: "اطّلع على الحالة والصور قبل الشراء." },
  trustSellerTitle: { en: "Know your seller", ar: "اعرف البائع" },
  trustSellerText: { en: "Explore seller profiles and inventory.", ar: "تصفّح ملفات البائعين ومنتجاتهم." },
  trustDeliveryTitle: { en: "Delivery or pickup", ar: "توصيل أو استلام" },
  trustDeliveryText: { en: "Check available options on each listing.", ar: "تحقق من الخيارات المتاحة في كل منتج." },

  // Grades + how it works
  gradesTitle: { en: "Condition grades", ar: "درجات الحالة" },
  gradesSub: { en: "Check the grade and item details before buying.", ar: "تحقق من الدرجة وتفاصيل المنتج قبل الشراء." },
  gradeGuide: { en: "View grade guide", ar: "عرض دليل الدرجات" },
  gradeGuideTitle: { en: "Grade guide", ar: "دليل الدرجات" },
  howTitle: { en: "How Khaznah works", ar: "كيف تعمل خزنة" },
  steps: [
    { title: { en: "Find your item", ar: "اعثر على منتجك" }, text: { en: "Browse categories, auctions or search for something specific.", ar: "تصفّح الفئات أو المزادات أو ابحث عن منتج بعينه." } },
    { title: { en: "Bid or buy now", ar: "زايد أو اشترِ فوراً" }, text: { en: "Place a bid in auctions or add Buy Now items to your cart.", ar: "قدّم مزايدة في المزادات أو أضف منتجات الشراء الفوري إلى السلة." } },
    { title: { en: "Arrange delivery or pickup", ar: "رتّب التوصيل أو الاستلام" }, text: { en: "Check the available options on each listing.", ar: "تحقق من الخيارات المتاحة في كل منتج." } },
  ],

  // Newsletter + footer
  newsTitle: { en: "Fresh finds, in your inbox.", ar: "أحدث المنتجات في بريدك." },
  newsText: { en: "Be the first to know about new arrivals, auctions and more.", ar: "كن أول من يعرف عن المنتجات الجديدة والمزادات وغيرها." },
  emailLabel: { en: "Email address", ar: "البريد الإلكتروني" },
  emailPlaceholder: { en: "Your email address", ar: "بريدك الإلكتروني" },
  subscribe: { en: "Subscribe", ar: "اشترك" },
  footerTag: { en: "Your marketplace for great finds.", ar: "سوقك للعثور على صفقات رائعة." },
  footerNav: { en: "Footer", ar: "تذييل الصفحة" },
  colMarketplace: { en: "Marketplace", ar: "السوق" },
  colHelp: { en: "Help", ar: "المساعدة" },
  colAbout: { en: "About", ar: "عن خزنة" },
  colLegal: { en: "Legal", ar: "قانوني" },
  linkHowItWorks: { en: "How it works", ar: "كيف تعمل خزنة" },
  linkGrades: { en: "Condition grades", ar: "درجات الحالة" },
  linkDelivery: { en: "Delivery & pickup", ar: "التوصيل والاستلام" },
  linkContact: { en: "Contact", ar: "تواصل معنا" },
  linkAbout: { en: "About Khaznah", ar: "عن خزنة" },
  linkSell: { en: "Sell on Khaznah", ar: "البيع عبر خزنة" },
  linkTerms: { en: "Terms & conditions", ar: "الشروط والأحكام" },
  linkPrivacy: { en: "Privacy policy", ar: "سياسة الخصوصية" },
  copyright: { en: "© 2026 Khaznah. All rights reserved.", ar: "© 2026 خزنة. جميع الحقوق محفوظة." },
};
