// Site-wide content shared by every concept. Changing a string here changes
// it in all four designs, which keeps the client comparison about design only.

export const BRAND = {
  name: { en: "Khazna", ar: "خزنة" },
  legalName: { en: "Khaznah — Direct Auction House", ar: "خزنة — دار المزادات المباشرة" },
  tagline: { en: "Safe deals, smart choices", ar: "صفقات آمنة، خيارات ذكية" },
  // The seven values behind the K-H-A-Z-N-A-H name (2026 brand guideline).
  values: [
    { letter: "K", title: { en: "Knowledge", ar: "المعرفة" }, text: { en: "Smart understanding of value, pricing and bidding opportunities.", ar: "فهم ذكي للقيمة والتسعير وفرص المزايدة." } },
    { letter: "H", title: { en: "Haven", ar: "الملاذ" }, text: { en: "A safe and trusted space for secure auctions and transactions.", ar: "مساحة آمنة وموثوقة للمزادات والمعاملات." } },
    { letter: "A", title: { en: "Assurance", ar: "الطمأنينة" }, text: { en: "Confidence, transparency and reliability in every bid.", ar: "ثقة وشفافية وموثوقية في كل مزايدة." } },
    { letter: "Z", title: { en: "Zero risk", ar: "مخاطر أقل" }, text: { en: "Minimising fraud and ensuring secure user experiences.", ar: "الحد من الاحتيال وضمان تجربة آمنة للمستخدم." } },
    { letter: "N", title: { en: "Neutrality", ar: "الحياد" }, text: { en: "Fair and unbiased auction processes for all participants.", ar: "إجراءات مزاد عادلة وغير منحازة لجميع المشاركين." } },
    { letter: "A", title: { en: "Accessibility", ar: "سهولة الوصول" }, text: { en: "Easy access to auctions anytime and anywhere.", ar: "وصول سهل إلى المزادات في أي وقت ومن أي مكان." } },
    { letter: "H", title: { en: "Heritage", ar: "الإرث" }, text: { en: "Preserving the value and legacy of valuable assets.", ar: "الحفاظ على قيمة الأصول الثمينة وإرثها." } },
  ],
};

export const HERO = {
  eyebrow: { en: "Safe deals, smart choices", ar: "صفقات آمنة، خيارات ذكية" },
  title: { en: "Graded stock. Transparent auctions.", ar: "مخزون مصنّف. مزادات شفافة." },
  // Split form for designs that set the two sentences on separate lines.
  titleLines: [
    { en: "Graded stock.", ar: "مخزون مصنّف." },
    { en: "Transparent auctions.", ar: "مزادات شفافة." },
  ],
  body: {
    en: "Bid on graded surplus and returned stock from Saudi warehouses — or buy it now at a fixed price. Every lot shows its condition grade.",
    ar: "زايد على فائض المخزون والمرتجعات المصنّفة من مستودعات سعودية، أو اشترِها فوراً بسعر ثابت. لكل منتج درجة حالة معلنة.",
  },
  primaryCta: { en: "Explore auctions", ar: "تصفّح المزادات" },
  secondaryCta: { en: "Shop Buy Now", ar: "تسوّق الشراء الفوري" },
  featuredLot: "swivel-chair",
};

// Figures as published on the current Khazna About page (no live source
// exists yet); confirm before any launch.
export const STATS = [
  { key: "sold", value: 10000, suffix: "+", label: { en: "Lots sold", ar: "منتج مُباع" } },
  { key: "buyers", value: 25000, suffix: "+", label: { en: "Active buyers", ar: "مشترٍ نشط" } },
  { key: "warehouses", value: 3, label: { en: "Warehouses", ar: "مستودعات" } },
  { key: "grades", value: 7, label: { en: "Condition grades", ar: "درجات حالة" } },
];

export const TRUST_POINTS = [
  {
    key: "graded",
    icon: "badge-check",
    title: { en: "Condition graded", ar: "درجة حالة معلنة" },
    text: { en: "Lots are listed with a condition grade from New to F, and a guide explains what each grade means.", ar: "تُعرض المنتجات بدرجة حالة من «جديد» حتى F، مع دليل يوضّح معنى كل درجة." },
  },
  {
    key: "deposit",
    icon: "shield-check",
    title: { en: "Bidding deposit", ar: "تأمين المزايدة" },
    text: { en: "To bid, your Khazna wallet needs to cover a small deposit. On timed auctions it isn't deducted — it just needs to be available.", ar: "للمزايدة، يجب أن يغطي رصيد محفظتك في خزنة تأميناً بسيطاً. في المزادات المحددة بوقت لا يُخصم، بل يكفي أن يكون متاحاً." },
  },
  {
    key: "payments",
    icon: "credit-card",
    title: { en: "Secure payment", ar: "دفع آمن" },
    text: { en: "Pay by card on a secure payment page, or use your Khazna wallet balance.", ar: "ادفع بالبطاقة عبر صفحة دفع آمنة، أو استخدم رصيد محفظتك في خزنة." },
  },
  {
    key: "delivery",
    icon: "truck",
    title: { en: "Delivery or pickup", ar: "توصيل أو استلام" },
    text: { en: "Delivery is priced for your address at checkout, and warehouse pickup is offered where available.", ar: "تُحسب تكلفة التوصيل لعنوانك عند إتمام الشراء، ويتاح الاستلام من المستودع حيثما أمكن." },
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: { en: "Create your account", ar: "أنشئ حسابك" },
    text: { en: "Create your account with your email and confirm it with a one-time code.", ar: "أنشئ حسابك ببريدك الإلكتروني وأكّده برمز لمرة واحدة." },
  },
  {
    step: 2,
    title: { en: "Top up your wallet", ar: "اشحن محفظتك" },
    text: { en: "Your wallet balance covers the small deposit needed to bid.", ar: "يغطي رصيد محفظتك التأمين البسيط المطلوب للمزايدة." },
  },
  {
    step: 3,
    title: { en: "Bid, or buy it now", ar: "زايد أو اشترِ فوراً" },
    text: { en: "Place bids live, set a maximum bid, or check out fixed-price items instantly.", ar: "زايد مباشرة، أو حدّد حداً أقصى للمزايدة، أو اشترِ المنتجات ذات السعر الثابت فوراً." },
  },
  {
    step: 4,
    title: { en: "Pay and receive", ar: "ادفع واستلم" },
    text: { en: "Pay for a timed-auction win within 24 hours, then choose how you receive it.", ar: "ادفع قيمة فوزك في المزاد المحدد بوقت خلال 24 ساعة، ثم اختر طريقة الاستلام." },
  },
];

export const NAV = [
  { key: "auctions", href: "/browse?tab=auction", label: { en: "Auctions", ar: "المزادات" } },
  { key: "buy-now", href: "/browse?tab=buy_now", label: { en: "Buy Now", ar: "الشراء الفوري" } },
  { key: "live", href: "/live-auction", label: { en: "Live", ar: "مباشر" } },
  { key: "sellers", href: "/seller", label: { en: "Sellers", ar: "البائعون" } },
  { key: "how", href: "#how-it-works", label: { en: "How it works", ar: "كيف تعمل خزنة" } },
];

export const FOOTER_COLUMNS = [
  {
    title: { en: "Marketplace", ar: "السوق" },
    links: [
      { label: { en: "Live auctions", ar: "المزادات المباشرة" }, href: "/live-auction" },
      { label: { en: "All auctions", ar: "كل المزادات" }, href: "/browse?tab=auction" },
      { label: { en: "Buy Now", ar: "الشراء الفوري" }, href: "/browse?tab=buy_now" },
      { label: { en: "Bulk pallets", ar: "طبليات بالجملة" }, href: "/browse?category=bulk-pallets" },
    ],
  },
  {
    title: { en: "Company", ar: "الشركة" },
    links: [
      { label: { en: "About Khazna", ar: "عن خزنة" }, href: "#" },
      { label: { en: "How it works", ar: "كيف تعمل خزنة" }, href: "#how-it-works" },
      { label: { en: "Sell with Khazna", ar: "بِع عبر خزنة" }, href: "#" },
      { label: { en: "Contact", ar: "تواصل معنا" }, href: "#" },
    ],
  },
  {
    title: { en: "Help", ar: "المساعدة" },
    links: [
      { label: { en: "FAQ", ar: "الأسئلة الشائعة" }, href: "#" },
      { label: { en: "Condition grades", ar: "درجات الحالة" }, href: "#grades" },
      { label: { en: "Shipping & pickup", ar: "الشحن والاستلام" }, href: "#" },
      { label: { en: "Returns & disputes", ar: "الإرجاع والنزاعات" }, href: "#" },
    ],
  },
  {
    title: { en: "Legal", ar: "قانوني" },
    links: [
      { label: { en: "Terms & conditions", ar: "الشروط والأحكام" }, href: "#" },
      { label: { en: "Privacy policy", ar: "سياسة الخصوصية" }, href: "#" },
      { label: { en: "VAT information", ar: "معلومات ضريبة القيمة المضافة" }, href: "#" },
    ],
  },
];

export const PAYMENT_METHODS = ["mada", "VISA", "Mastercard"];

export const COMPANY_LINE = {
  en: "© 2026 Logic Gate · Khaznah — Direct Auction House",
  ar: "© 2026 Logic Gate · خزنة — دار المزادات المباشرة",
};

// The signed-in customer used across the interactive prototype.
export const DEMO_USER = {
  name: { en: "Faisal Al-Harbi", ar: "فيصل الحربي" },
  initials: { en: "FH", ar: "ف ح" },
  walletBalance: 1250,
};

// Policy values mirrored from the backend defaults (deposit_policy fallback
// SAR 50, SaleLot anti-sniping window, AUCTION_WIN_PAYMENT_WINDOW_HOURS).
// Operators can change the deposit and payment window in production.
export const AUCTION_POLICY = {
  depositAmount: 50,
  antiSnipeWindowSeconds: 300,
  antiSnipeExtendSeconds: 300,
  paymentWindowHours: 24,
};

export const NEWSLETTER = {
  title: { en: "Closing-soon alerts by email", ar: "تنبيهات المزادات القريبة من الإغلاق عبر البريد" },
  text: { en: "A round-up of graded lots that are closing soon.", ar: "ملخص للمنتجات المصنّفة التي تقترب مزاداتها من الإغلاق." },
  placeholder: { en: "Your email address", ar: "بريدك الإلكتروني" },
  cta: { en: "Subscribe", ar: "اشترك" },
};
