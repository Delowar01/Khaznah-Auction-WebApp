// The four design directions presented to the client (Round 3A).
//
// Option 1 (Modern Commerce) is the direction the client kept from the first
// round and is unchanged. Options 2–4 are the structurally different
// directions approved in the Round 3 plan: in Round 3A only their home pages
// use the new structures; their other screens are still the Round 2 versions
// until Round 3B. The `id` is the internal route slot; `letter` is the
// client-facing option number. Order here is the order shown in the selector.

export const CONCEPTS = [
  {
    id: "b",
    letter: "1",
    name: { en: "Modern Commerce", ar: "التجارة الحديثة" },
    oneLiner: {
      en: "Search-led, practical and focused on conversion. Designed for customers who want to find products, categories and auctions quickly.",
      ar: "يقوده البحث، عملي ويركّز على إتمام الشراء. صُمّم للعملاء الذين يريدون الوصول إلى المنتجات والفئات والمزادات بسرعة.",
    },
    philosophy: {
      en: "Search first, then filter, then decide. A clear product grid, visible filters and highlighted deals make a large, mixed catalogue easy to scan — the way people expect a modern online marketplace to work.",
      ar: "ابحث أولاً، ثم صفِّ النتائج، ثم قرر. شبكة منتجات واضحة وعوامل تصفية ظاهرة وعروض بارزة تجعل الكتالوج الكبير والمتنوع سهل التصفّح — كما يتوقع الناس من سوق إلكتروني حديث.",
    },
    traits: [
      { en: "Prominent search with category shortcuts", ar: "بحث بارز مع اختصارات للفئات" },
      { en: "More products per screen, with visible filters", ar: "منتجات أكثر في كل شاشة مع عوامل تصفية ظاهرة" },
      { en: "Brand indigo for actions, gold for value", ar: "النيلي للإجراءات والذهبي للقيمة" },
      { en: "Bottom navigation and fixed buttons on mobile", ar: "تنقل سفلي وأزرار ثابتة على الجوال" },
    ],
    swatches: ["#F4F5F7", "#101828", "#3D4D9B", "#D8A535"],
    defaultTheme: "light",
  },
  {
    id: "a",
    letter: "2",
    name: { en: "Visual Marketplace", ar: "السوق المرئي" },
    oneLiner: {
      en: "Image-led discovery — the marketplace browsed like a well-merchandised store.",
      ar: "اكتشاف تقوده الصور — تصفّح السوق كما تتصفّح متجراً حسن العرض.",
    },
    philosophy: {
      en: "Product imagery leads. One bar with a centred logo; search sits in a centred discovery hero framed by product cut-outs, with four featured tiles over its edge. Categories and sellers form a photo mosaic, auctions appear as wide showcases and Buy Now as a mosaic, and live sales run in a floating mini-player. Search, the bag and the watchlist stay one step away. (Round 3A: home page only.)",
      ar: "الصور في المقدمة. شريط واحد بشعار في المنتصف، والبحث داخل واجهة اكتشاف مركزية تحيط بها صور المنتجات، وأربع بطاقات مميزة على حافتها. الفئات والبائعون في فسيفساء من الصور، والمزادات في عروض عريضة، والشراء الفوري في فسيفساء، والمزاد المباشر في مشغّل عائم صغير. البحث والحقيبة وقائمة المتابعة على بعد خطوة. (الجولة 3أ: الصفحة الرئيسية فقط.)",
    },
    traits: [
      { en: "One-bar header with a centred logo", ar: "شريط علوي واحد بشعار في المنتصف" },
      { en: "Full-screen visual Categories and Search", ar: "فئات وبحث مرئيان بملء الشاشة" },
      { en: "Square image tiles with in-image price bands", ar: "بطاقات صور مربعة مع شريط السعر داخل الصورة" },
      { en: "Floating live mini-player; no bottom tab bar on phones", ar: "مشغّل مباشر عائم؛ دون شريط تبويب سفلي على الجوال" },
    ],
    swatches: ["#FAF8F5", "#181614", "#EFEAE3", "#B0512A"],
    defaultTheme: "light",
  },
  {
    id: "c",
    letter: "3",
    name: { en: "Marketplace Hub", ar: "مركز السوق" },
    oneLiner: {
      en: "A search- and discovery-first hub — any lot, auction, seller or deal in one or two actions.",
      ar: "مركز يقوده البحث والاكتشاف — أي منتج أو مزاد أو بائع أو عرض بخطوة أو خطوتين.",
    },
    philosophy: {
      en: "Works like a marketplace application: a navigation rail holds the full category tree, a search deck with scopes is the first thing you use, and dense modules — counters, mini-tables, sellers and live — take the place of a hero. Fast, practical and commercial, without looking like an admin dashboard. (Round 3A: home page only.)",
      ar: "يعمل كتطبيق سوق: شريط تنقل جانبي يضم شجرة الفئات كاملة، ولوحة بحث بنطاقات هي أول ما تستخدمه، ووحدات كثيفة — عدّادات وجداول مصغّرة وبائعون ومباشر — بدلاً من الواجهة الكبيرة. سريع وعملي وتجاري، دون أن يبدو كلوحة إدارة. (الجولة 3أ: الصفحة الرئيسية فقط.)",
    },
    traits: [
      { en: "Navigation rail with the category tree", ar: "شريط تنقل جانبي مع شجرة الفئات" },
      { en: "Search deck with scopes, suggestions and a / shortcut", ar: "لوحة بحث بنطاقات واقتراحات واختصار /" },
      { en: "Mini-tables with a quick view", ar: "جداول مصغّرة مع عرض سريع" },
      { en: "Bottom command bar on phones: Menu · Search · Cart", ar: "شريط أوامر سفلي على الجوال: القائمة · البحث · السلة" },
    ],
    swatches: ["#F2F3F0", "#111814", "#13684F", "#B1441A"],
    defaultTheme: "light",
  },
  {
    id: "d",
    letter: "4",
    name: { en: "Auction Commerce", ar: "تجارة المزادات" },
    oneLiner: {
      en: "Auction status leads — live, ending, upcoming, then Buy Now.",
      ar: "حالة المزاد في المقدمة — المباشر، ثم ما ينتهي، ثم القادم، ثم الشراء الفوري.",
    },
    philosophy: {
      en: "Organised around time: a floor switcher (Live · Ending · Upcoming · Buy Now) leads navigation, the live auction stage is the hero, an ending-soon timeline pins each lot at its closing time, and data-first bid tickets put time and the current bid ahead of the photo. Calm and professional — one urgency colour, plain-language times, nothing that moves on its own. (Round 3A: home page only.)",
      ar: "منظّم حول الوقت: مبدّل القاعة (مباشر · تنتهي · القادمة · شراء فوري) يقود التنقل، ومنصة المزاد المباشر هي الواجهة، وخط زمني يثبّت كل منتج عند موعد إغلاقه، وتذاكر مزايدة تقدّم الوقت والمزايدة الحالية على الصورة. هادئ ومهني — لون إلحاح واحد، وأوقات بلغة بسيطة، ولا شيء يتحرك من تلقاء نفسه. (الجولة 3أ: الصفحة الرئيسية فقط.)",
    },
    traits: [
      { en: "Floor switcher: Live · Ending · Upcoming · Buy Now", ar: "مبدّل القاعة: مباشر · تنتهي · القادمة · شراء فوري" },
      { en: "Live stage: previous · now · next", ar: "منصة مباشرة: السابق · الآن · التالي" },
      { en: "Ending-soon timeline and data-first bid tickets", ar: "خط زمني لما ينتهي قريباً وتذاكر مزايدة تبدأ بالبيانات" },
      { en: "My bids drawer, with a pill on phones", ar: "لوحة «مزايداتي» مع زر عائم على الجوال" },
    ],
    swatches: ["#F5F5F2", "#0E1118", "#16213A", "#C2410C"],
    defaultTheme: "light",
  },
];

export const CONCEPT_BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
