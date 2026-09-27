// The four design directions presented to the client (Round 3B).
//
// Option 1 (Modern Commerce) is the direction the client kept from the first
// round and is unchanged. Options 2–4 are the structurally different
// directions: after the Round 3A review, Option 2 kept its visual concept
// with Option 1's full section coverage, Option 3 became Premium Marketplace
// and Option 4 became Discovery Commerce. Only their home pages use the new
// structures; their other screens are still the Round 2 versions. The `id`
// is the internal route slot; `letter` is the client-facing option number.
// Order here is the order shown in the selector.

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
      en: "Product imagery leads. One bar with a centred logo; search sits in a centred discovery hero framed by product cut-outs, with four featured tiles over its edge. Every business section of Option 1 is here, told visually: a category photo mosaic, an immersive live-auction block, a wide closing-soon rail, a Buy Now deals mosaic, large seller photographs, mirrored bulk and pallet rows, and the trust points on photography. (Round 3B: home page only.)",
      ar: "الصور في المقدمة. شريط واحد بشعار في المنتصف، والبحث داخل واجهة اكتشاف مركزية تحيط بها صور المنتجات، وأربع بطاقات مميزة على حافتها. كل أقسام الخيار 1 موجودة هنا بأسلوب مرئي: فسيفساء صور للفئات، وكتلة غامرة للمزاد المباشر، وشريط عريض لما يُغلق قريباً، وفسيفساء لعروض الشراء الفوري، وصور كبيرة للبائعين، وصفوف متقابلة للجملة والطبليات، ونقاط الثقة على الصور. (الجولة 3ب: الصفحة الرئيسية فقط.)",
    },
    traits: [
      { en: "One-bar header with a centred logo", ar: "شريط علوي واحد بشعار في المنتصف" },
      { en: "Search inside a centred, image-framed hero", ar: "البحث داخل واجهة مركزية تحيط بها الصور" },
      { en: "Option 1's sections, told with large photography", ar: "أقسام الخيار 1 معروضة بصور كبيرة" },
      { en: "Floating live mini-player; no bottom tab bar on phones", ar: "مشغّل مباشر عائم؛ دون شريط تبويب سفلي على الجوال" },
    ],
    swatches: ["#FAF8F5", "#181614", "#EFEAE3", "#B0512A"],
    defaultTheme: "light",
  },
  {
    id: "c",
    letter: "3",
    name: { en: "Premium Marketplace", ar: "السوق الراقي" },
    oneLiner: {
      en: "A refined, high-end store — calm, elegant and product-focused.",
      ar: "متجر راقٍ ومصقول — هادئ وأنيق ويركّز على المنتج.",
    },
    philosophy: {
      en: "Feels like a premium online store: a solid, simplified header with search that expands in the bar, a split hero pairing a serif headline with large lifestyle photography and the featured lot, an editorial category grid, tall portrait product cards, a featured auction beside related lots, storefront previews, a live-sale salon and an elegant \u201cBuying on Khazna\u201d guide. Warm neutral surfaces, generous space and crisp corners. (Round 3B: home page only.)",
      ar: "يشبه متجراً إلكترونياً راقياً: شريط علوي بسيط وثابت مع بحث يتمدد داخله، وواجهة منقسمة تجمع عنواناً أنيقاً مع صور حياتية كبيرة والمنتج المميز، وشبكة فئات تحريرية، وبطاقات منتجات طولية، ومزاد مميز بجانب منتجات ذات صلة، ومعاينات لمتاجر البائعين، وصالة للمزاد المباشر، ودليل أنيق «الشراء عبر خزنة». أسطح محايدة دافئة، ومساحات سخية، وزوايا حادة. (الجولة 3ب: الصفحة الرئيسية فقط.)",
    },
    traits: [
      { en: "Simplified header with search that expands in the bar", ar: "شريط علوي بسيط مع بحث يتمدد داخله" },
      { en: "Split hero with large lifestyle photography", ar: "واجهة منقسمة بصور حياتية كبيرة" },
      { en: "Editorial category grid and portrait product cards", ar: "شبكة فئات تحريرية وبطاقات منتجات طولية" },
      { en: "Drawer menu and accordions on phones", ar: "قائمة جانبية وأقسام قابلة للطي على الجوال" },
    ],
    swatches: ["#F7F5F1", "#1C1A17", "#EFEBE4", "#83633A"],
    defaultTheme: "light",
  },
  {
    id: "d",
    letter: "4",
    name: { en: "Discovery Commerce", ar: "تجارة الاكتشاف" },
    oneLiner: {
      en: "Built for exploring — categories, collections and rails that make browsing easy.",
      ar: "مصمّم للاستكشاف — فئات ومجموعات وشرائط تجعل التصفّح سهلاً.",
    },
    philosophy: {
      en: "Discovery comes first: a compact header with a wide search, a Discover menu and shortcut chips; a discovery board pairing a collection with a deal, new arrivals, the live sale and a closing lot; colourful category cards; price-drop, auction and seller rails; themed collections and a mixed-size \u201cNew in\u201d feed. Buy Now and auctions sit side by side. (Round 3B: home page only.)",
      ar: "الاكتشاف أولاً: شريط علوي مدمج مع بحث واسع وقائمة «اكتشف» واختصارات سريعة؛ ولوحة اكتشاف تجمع مجموعة مع عرض اليوم والوافد حديثاً والمزاد المباشر ومنتج يقترب إغلاقه؛ وبطاقات فئات ملوّنة؛ وشرائط لانخفاض الأسعار والمزادات والبائعين؛ ومجموعات موضوعية وتغذية «وصل حديثاً» بأحجام مختلفة. الشراء الفوري والمزادات جنباً إلى جنب. (الجولة 3ب: الصفحة الرئيسية فقط.)",
    },
    traits: [
      { en: "Wide search, Discover menu and shortcut chips", ar: "بحث واسع وقائمة اكتشاف واختصارات سريعة" },
      { en: "Discovery board and colourful category cards", ar: "لوحة اكتشاف وبطاقات فئات ملوّنة" },
      { en: "Rails, themed collections and a mixed-size feed", ar: "شرائط ومجموعات موضوعية وتغذية بأحجام مختلفة" },
      { en: "Pinned search and shortcuts on phones", ar: "بحث واختصارات مثبّتة على الجوال" },
    ],
    swatches: ["#FFFFFF", "#14161C", "#FFE6DA", "#D13D17"],
    defaultTheme: "light",
  },
];

export const CONCEPT_BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
