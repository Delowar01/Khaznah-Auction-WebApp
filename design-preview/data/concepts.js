// The four design directions presented to the client (Round 2).
//
// All four are serious, commercially credible marketplace directions in the
// same family. Option 1 (Modern Commerce) is the direction the client kept
// from the first round; Options 2–4 are new alternatives created in response
// to that review. The `id` is the internal route slot; `letter` is the
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
    name: { en: "Premium Commerce", ar: "التجارة الفاخرة" },
    oneLiner: {
      en: "The same practical marketplace, elevated — a refined, high-end shopping experience.",
      ar: "السوق العملي نفسه، بلمسة أرقى — تجربة تسوّق راقية ومصقولة.",
    },
    philosophy: {
      en: "Keeps Modern Commerce's strong search, filtering and browsing, then raises the finish: elegant serif headlines, generous space, softer surfaces and larger, more polished product cards. It should feel like a premium department store online, without losing everyday marketplace usability.",
      ar: "يحافظ على قوة البحث والتصفية والتصفّح في التجارة الحديثة، ثم يرتقي بالإخراج: عناوين أنيقة بحروف مذيّلة، ومساحات سخيّة، وأسطح أنعم، وبطاقات منتجات أكبر وأكثر صقلاً. يُفترض أن يشعرك بمتجر راقٍ على الإنترنت دون التفريط في سهولة استخدام السوق اليومية.",
    },
    traits: [
      { en: "Elegant serif headlines with a clean, modern body", ar: "عناوين أنيقة بحروف مذيّلة مع نص حديث واضح" },
      { en: "Warm, soft surfaces with gentle elevation", ar: "أسطح دافئة ناعمة مع ارتفاعات هادئة" },
      { en: "Larger, refined product and lot cards", ar: "بطاقات منتجات ومنتجات مزاد أكبر وأكثر رقياً" },
      { en: "Calmer spacing with strong product imagery", ar: "تباعد أهدأ مع صور منتجات قوية" },
    ],
    swatches: ["#F6F3EC", "#1E1B17", "#8A6D3B", "#2E3A66"],
    defaultTheme: "light",
  },
  {
    id: "c",
    letter: "3",
    name: { en: "Saudi Modern Commerce", ar: "التجارة السعودية الحديثة" },
    oneLiner: {
      en: "A confident, Arabic-first take on the same marketplace, built for the Saudi market.",
      ar: "رؤية واثقة تبدأ بالعربية للسوق نفسه، مصمّمة للسوق السعودي.",
    },
    philosophy: {
      en: "Designed in Arabic first and mirrored into English, with a modern local character: clear bilingual headings, a contemporary Saudi palette and strong seller-credibility cues. It keeps Modern Commerce's browsing and search while feeling distinctly local and current — modern, not traditional or decorative.",
      ar: "صُمّم بالعربية أولاً ثم عُكس إلى الإنجليزية، بطابع محلي معاصر: عناوين ثنائية اللغة واضحة، ولوحة ألوان سعودية معاصرة، وإشارات قوية لمصداقية البائع. يحافظ على تصفّح وبحث التجارة الحديثة مع حضور محلي واضح ومعاصر — حديث لا تقليدي ولا زخرفي.",
    },
    traits: [
      { en: "Arabic-first layouts with clear bilingual headings", ar: "تصاميم تبدأ بالعربية مع عناوين ثنائية اللغة واضحة" },
      { en: "A contemporary local palette and tone", ar: "لوحة ألوان ونبرة محلية معاصرة" },
      { en: "Strong seller and warehouse credibility", ar: "مصداقية قوية للبائع والمستودع" },
      { en: "Modern, non-decorative visual character", ar: "طابع بصري حديث بعيد عن الزخرفة" },
    ],
    swatches: ["#F3F1EA", "#0E3B2E", "#1F6F5C", "#C79A3B"],
    defaultTheme: "light",
  },
  {
    id: "d",
    letter: "4",
    name: { en: "Auction-Forward Commerce", ar: "تجارة المزادات" },
    oneLiner: {
      en: "The same marketplace, tuned for bidding — auctions, live sales and countdowns take the lead.",
      ar: "السوق نفسه مهيّأ للمزايدة — المزادات والبث المباشر والعد التنازلي في المقدمة.",
    },
    philosophy: {
      en: "Keeps Modern Commerce's clarity and conversion focus, then puts auctions front and centre: countdown-forward cards, prominent live and ending-soon rails, clear bid activity and strong status for live, ending soon, sold and upcoming. Energetic and time-aware, but still calm and commercially trustworthy — never flashy.",
      ar: "يحافظ على وضوح التجارة الحديثة وتركيزها على إتمام الشراء، ثم يضع المزادات في الصدارة: بطاقات يتصدّرها العد التنازلي، وأشرطة بارزة للمزادات المباشرة والقريبة من الإغلاق، ونشاط مزايدة واضح، وحالات قوية للمباشر والقريب من الإغلاق والمُباع والقادم. حيويّ وواعٍ بالوقت، لكنه هادئ وموثوق تجارياً — دون مبالغة.",
    },
    traits: [
      { en: "Countdown-forward auction cards", ar: "بطاقات مزاد يتصدّرها العد التنازلي" },
      { en: "Prominent live and ending-soon emphasis", ar: "إبراز واضح للمزادات المباشرة والقريبة من الإغلاق" },
      { en: "Clear bid activity and urgency cues", ar: "نشاط مزايدة واضح وإشارات إلحاح" },
      { en: "Confident display type with tabular figures", ar: "خط عناوين واثق مع أرقام متساوية العرض" },
    ],
    swatches: ["#F5F6F8", "#12141A", "#2E3A66", "#E4562A"],
    defaultTheme: "light",
  },
];

export const CONCEPT_BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
