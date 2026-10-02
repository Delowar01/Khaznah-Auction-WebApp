// The four design directions presented to the client.
//
// Option 1 (Modern Commerce) is the direction the client kept from the first
// round and is unchanged. Options 2–4 are the approved ChatGPT work designs
// (Premium Modern Marketplace, Visual Discovery Marketplace, Contemporary
// Saudi Commerce), implemented from the homepage handoff. Only their home
// pages use the approved designs; their other screens are still the Round 2
// versions. The `id` is the internal route slot; `letter` is the
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
    name: { en: "Premium Modern Marketplace", ar: "السوق العصري الراقي" },
    oneLiner: {
      en: "A calm, premium storefront in warm ivory, charcoal and restrained brass.",
      ar: "واجهة متجر هادئة وراقية بألوان العاجي والفحمي ولمسات نحاسية هادئة.",
    },
    philosophy: {
      en: "A centred-logo masthead over a broad search row, then a panoramic room hero with an inset copy card and a pinned live lot. Eight photographic category cut-outs, an Ending soon stone band, a Featured Items shelf led by auction lots, a split live auction, four Buy Now cards with full-width charcoal buttons, two recommendation panels, pallet rows, five seller cards, a trust strip, grades beside How Khaznah works, a charcoal newsletter and a light footer. (Home page only.)",
      ar: "شريط علوي بشعار في المنتصف فوق صف بحث عريض، ثم واجهة غرفة بانورامية مع بطاقة نص داخلية ومنتج مزاد مباشر مثبّت. ثماني صور فئات مقصوصة، وشريط حجري لما ينتهي قريباً، ورف «منتجات مميزة» تتقدمه منتجات المزاد، ومزاد مباشر منقسم، وأربع بطاقات للشراء الفوري بأزرار فحمية بعرض كامل، ولوحتا توصيات، وصفوف للطبليات، وخمس بطاقات بائعين، وشريط ثقة، ودرجات الحالة بجانب «كيف تعمل خزنة»، ونشرة بريدية فحمية وتذييل فاتح. (الصفحة الرئيسية فقط.)",
    },
    traits: [
      { en: "Centred logo with a separate search row", ar: "شعار في المنتصف مع صف بحث مستقل" },
      { en: "Panoramic room hero with a pinned live lot", ar: "واجهة غرفة بانورامية مع منتج مزاد مباشر مثبّت" },
      { en: "Charcoal buttons with restrained brass accents", ar: "أزرار فحمية مع لمسات نحاسية هادئة" },
      { en: "Grades and How Khaznah works side by side", ar: "درجات الحالة و«كيف تعمل خزنة» جنباً إلى جنب" },
    ],
    swatches: ["#F8F7F3", "#302F2C", "#ECE8E1", "#B28A43"],
    defaultTheme: "light",
  },
  {
    id: "c",
    letter: "3",
    name: { en: "Visual Discovery Marketplace", ar: "سوق الاكتشاف المرئي" },
    oneLiner: {
      en: "A bright, image-first marketplace for browsing and discovering — white, indigo and navy with gold.",
      ar: "سوق مشرق تقوده الصور للتصفّح والاكتشاف — أبيض ونيلي وكحلي مع لمسات ذهبية.",
    },
    philosophy: {
      en: "A logo and pill-search masthead over a Discover row, then a mosaic hero: a copy tile with a handwritten line, a furniture scene with an overlapping product card, and stacked category photographs. Eight outlined category pills, a navy live banner, a Featured Items mosaic led by auction lots, Ending soon's image-first auction cards, a mixed-height product wall with circular cart buttons, photographic seller shelves, two tinted pallet panels, a compact clarity row, an ivory newsletter and a white footer. (Home page only.)",
      ar: "شريط علوي بشعار وبحث على شكل كبسولة فوق صف «اكتشف»، ثم واجهة فسيفسائية: بطاقة نص بسطر مكتوب بخط اليد، ومشهد أثاث مع بطاقة منتج متداخلة، وصور فئات متراصّة. ثماني كبسولات فئات، وشريط كحلي للمزاد المباشر، وفسيفساء «منتجات مميزة» تتقدمها منتجات المزاد، و«تنتهي قريباً» ببطاقات مزادات تتقدمها الصور، وجدار منتجات بارتفاعات مختلفة وأزرار سلة دائرية، ورفوف بائعين مصوّرة، ولوحتان ملونتان للطبليات، وصف توضيحي مختصر، ونشرة بريدية عاجية وتذييل أبيض. (الصفحة الرئيسية فقط.)",
    },
    traits: [
      { en: "Pill search in the masthead, Discover row below", ar: "بحث على شكل كبسولة في الشريط العلوي وصف «اكتشف» أسفله" },
      { en: "Mosaic hero with an overlapping product card", ar: "واجهة فسيفسائية مع بطاقة منتج متداخلة" },
      { en: "Mixed-height product wall with circular cart buttons", ar: "جدار منتجات بارتفاعات مختلفة وأزرار سلة دائرية" },
      { en: "Navy live banner before Ending soon", ar: "شريط كحلي للمزاد المباشر قبل «تنتهي قريباً»" },
    ],
    swatches: ["#FFFFFF", "#06213F", "#183997", "#E1A932"],
    defaultTheme: "light",
  },
  {
    id: "d",
    letter: "4",
    name: { en: "Contemporary Saudi Commerce", ar: "التجارة السعودية المعاصرة" },
    oneLiner: {
      en: "A green and cream storefront with a centred bilingual hero and the marketplace search at its heart.",
      ar: "واجهة متجر بالأخضر والكريمي مع واجهة ثنائية اللغة في المنتصف والبحث في قلبها.",
    },
    philosophy: {
      en: "A cream utility bar and a white navigation row, then a centred bilingual hero with a segmented category search. Trust points follow at once; Ending soon runs beside one integrated live-auction scene; Featured Items shows auction product cards on cream; a local category rail sits beside four horizontal Buy Now cards; five seller rows show each store's products; two sage pallet panels, large 01/02/03 steps, a seven-cell grade strip, and one green newsletter and footer band above a white brand base. (Home page only.)",
      ar: "شريط خدمات كريمي وصف تنقل أبيض، ثم واجهة ثنائية اللغة في المنتصف مع بحث مقسّم حسب الفئة. تليها نقاط الثقة مباشرة؛ و«تنتهي قريباً» بجانب مشهد واحد للمزاد المباشر؛ و«منتجات مميزة» ببطاقات مزاد على خلفية كريمية؛ وقائمة فئات محلية بجانب أربع بطاقات أفقية للشراء الفوري؛ وخمسة صفوف للبائعين تعرض منتجات كل متجر؛ ولوحتان بلون المريمية للطبليات، وخطوات كبيرة 01/02/03، وشريط درجات من سبع خانات، وشريط أخضر واحد للنشرة البريدية والتذييل فوق قاعدة بيضاء للعلامة. (الصفحة الرئيسية فقط.)",
    },
    traits: [
      { en: "Centred bilingual hero with a segmented search", ar: "واجهة ثنائية اللغة في المنتصف مع بحث مقسّم" },
      { en: "Category rail beside horizontal Buy Now cards", ar: "قائمة فئات بجانب بطاقات أفقية للشراء الفوري" },
      { en: "Ending soon beside one live-auction scene", ar: "«تنتهي قريباً» بجانب مشهد المزاد المباشر" },
      { en: "Seller directory rows with each store's products", ar: "صفوف دليل البائعين مع منتجات كل متجر" },
    ],
    swatches: ["#ECEBE2", "#174B38", "#EDF4F0", "#294C9B"],
    defaultTheme: "light",
  },
];

export const CONCEPT_BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
