// Site-wide content shared by every concept. Changing a string here changes
// it in all four designs, which keeps the client comparison about design only.

export const BRAND = {
  name: { en: "Khazna", ar: "خزنة" },
  legalName: { en: "Khaznah Auction House", ar: "دار خزنة للمزادات" },
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
  title: { en: "Verified inventory. Honest auctions.", ar: "مخزون موثّق. مزادات نزيهة." },
  // Split form for designs that set the two sentences on separate lines.
  titleLines: [
    { en: "Verified inventory.", ar: "مخزون موثّق." },
    { en: "Honest auctions.", ar: "مزادات نزيهة." },
  ],
  body: {
    en: "Bid on graded surplus and returned stock from verified Saudi warehouses — or buy it now at a fixed price. Every lot is inspected, and every grade disclosed.",
    ar: "زايد على فائض المخزون والمرتجعات المصنّفة من مستودعات سعودية موثّقة، أو اشترِها فوراً بسعر ثابت. كل قطعة تُفحص، وكل درجة تُعلن.",
  },
  primaryCta: { en: "Explore auctions", ar: "تصفّح المزادات" },
  secondaryCta: { en: "Shop Buy Now", ar: "تسوّق الشراء الفوري" },
  featuredLot: "swivel-chair",
};

export const STATS = [
  { key: "lots", value: 2480, suffix: "+", label: { en: "Active lots", ar: "منتج معروض" } },
  { key: "warehouses", value: 38, label: { en: "Verified warehouses", ar: "مستودعاً موثّقاً" } },
  { key: "won", value: 14.2, prefix: "SAR ", suffixUnit: "M", label: { en: "Won at auction", ar: "قيمة المزادات الفائزة" }, money: true },
  { key: "graded", value: 100, suffix: "%", label: { en: "Lots inspected & graded", ar: "من المنتجات مفحوصة ومصنّفة" } },
];

export const TRUST_POINTS = [
  {
    key: "graded",
    icon: "badge-check",
    title: { en: "Inspected & graded", ar: "مفحوص ومصنّف" },
    text: { en: "Every lot carries a disclosed condition grade from New to F, with photos of any marks.", ar: "لكل منتج درجة حالة معلنة من «جديد» حتى F، مع صور لأي علامات." },
  },
  {
    key: "deposit",
    icon: "shield-check",
    title: { en: "Refundable deposits", ar: "تأمين مسترد" },
    text: { en: "A small refundable deposit keeps bidding serious. It is never charged unless you win.", ar: "تأمين بسيط مسترد يضمن جدية المزايدة، ولا يُخصم إلا عند الفوز." },
  },
  {
    key: "payments",
    icon: "credit-card",
    title: { en: "Secure payment", ar: "دفع آمن" },
    text: { en: "Pay by mada, Visa or Mastercard, or from your Khazna wallet.", ar: "ادفع عبر مدى أو فيزا أو ماستركارد، أو من محفظة خزنة." },
  },
  {
    key: "delivery",
    icon: "truck",
    title: { en: "Pickup or delivery", ar: "استلام أو توصيل" },
    text: { en: "Collect from the seller's warehouse or get it delivered anywhere in the Kingdom.", ar: "استلم من مستودع البائع أو اطلب التوصيل إلى أي مكان في المملكة." },
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
    title: { en: "Add a refundable deposit", ar: "أضف تأميناً مسترداً" },
    text: { en: "Top up your wallet once to unlock bidding on any auction.", ar: "اشحن محفظتك مرة واحدة لتفعيل المزايدة على أي مزاد." },
  },
  {
    step: 3,
    title: { en: "Bid, or buy it now", ar: "زايد أو اشترِ فوراً" },
    text: { en: "Place bids live, set a maximum bid, or check out fixed-price items instantly.", ar: "زايد مباشرة، أو حدّد حداً أقصى للمزايدة، أو اشترِ المنتجات ذات السعر الثابت فوراً." },
  },
  {
    step: 4,
    title: { en: "Pay and collect", ar: "ادفع واستلم" },
    text: { en: "Pay within 24 hours of winning, then collect or choose delivery.", ar: "ادفع خلال 24 ساعة من الفوز، ثم استلم أو اختر التوصيل." },
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
  en: "© 2026 Logic Gate · Khaznah Auction House · Riyadh, Kingdom of Saudi Arabia",
  ar: "© 2026 لوجك جيت · دار خزنة للمزادات · الرياض، المملكة العربية السعودية",
};

// The signed-in customer used across the interactive prototype.
export const DEMO_USER = {
  name: { en: "Faisal Al-Harbi", ar: "فيصل الحربي" },
  initials: { en: "FH", ar: "ف ح" },
  walletBalance: 1250,
  verified: true,
};

// Policy values mirrored from the backend defaults (deposit policy and
// anti-sniping window on SaleLot).
export const AUCTION_POLICY = {
  depositAmount: 200,
  antiSnipeWindowSeconds: 300,
  antiSnipeExtendSeconds: 300,
  paymentWindowHours: 24,
};

export const NEWSLETTER = {
  title: { en: "Closing-soon alerts, once a week", ar: "تنبيهات المزادات القريبة من الإغلاق، مرة أسبوعياً" },
  text: { en: "The best lots ending this week, graded and priced, in your inbox every Sunday.", ar: "أفضل المنتجات التي تنتهي هذا الأسبوع، مصنّفة ومسعّرة، في بريدك كل أحد." },
  placeholder: { en: "Your email address", ar: "بريدك الإلكتروني" },
  cta: { en: "Subscribe", ar: "اشترك" },
};
