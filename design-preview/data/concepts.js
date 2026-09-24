// The four design directions presented to the client.

export const CONCEPTS = [
  {
    id: "a",
    letter: "A",
    name: { en: "Premium Marketplace", ar: "السوق الفاخر" },
    oneLiner: {
      en: "Refined, spacious and editorial. Designed to give Khazna the character of a premium marketplace and a modern auction house.",
      ar: "راقٍ وفسيح بطابع تحريري. صُمّم ليمنح خزنة طابع السوق الراقي ودار المزادات العصرية.",
    },
    philosophy: {
      en: "Every lot is presented like an entry in an auction catalogue: generous space, elegant headlines and clear lot details, so buyers feel confident about what they are bidding on.",
      ar: "يُعرض كل منتج كأنه مدخل في كتالوج مزادات: مساحات واسعة وعناوين أنيقة وتفاصيل واضحة، ليشعر المشتري بالثقة فيما يزايد عليه.",
    },
    traits: [
      { en: "Elegant headlines with clean, easy-to-read details", ar: "عناوين أنيقة وتفاصيل واضحة سهلة القراءة" },
      { en: "Warm ivory, deep navy and antique brass", ar: "عاجي دافئ وكحلي عميق ونحاسي عتيق" },
      { en: "Catalogue-style lot cards and placards", ar: "بطاقات منتجات بأسلوب كتالوجات المزادات" },
      { en: "A calm pace, with fewer and larger items per screen", ar: "إيقاع هادئ مع منتجات أقل وأكبر في كل شاشة" },
    ],
    swatches: ["#F6F2EA", "#16192A", "#2B377A", "#B08A3E"],
    defaultTheme: "light",
  },
  {
    id: "b",
    letter: "B",
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
    id: "c",
    letter: "C",
    name: { en: "Saudi Contemporary", ar: "سعودي معاصر" },
    oneLiner: {
      en: "A modern Saudi visual direction with strong bilingual presentation and a distinctive local identity.",
      ar: "اتجاه بصري سعودي معاصر بحضور قوي للغتين وهوية محلية مميزة.",
    },
    philosophy: {
      en: "Designed in Arabic first and carefully mirrored into English. Architectural lines, warm limestone tones and the diamond from the Khazna logo give a local character that feels contemporary rather than decorative.",
      ar: "صُمّم بالعربية أولاً ثم عُكس إلى الإنجليزية بعناية. خطوط معمارية ودرجات حجرية دافئة والمعيّن المستوحى من شعار خزنة تصنع طابعاً محلياً معاصراً بعيداً عن الزخرفة.",
    },
    traits: [
      { en: "Arabic-first layouts in the Khazna brand fonts", ar: "تصاميم تبدأ بالعربية بخطوط هوية خزنة" },
      { en: "Limestone, night indigo and saffron gold", ar: "حجر جيري ونيلي ليلي وذهبي زعفراني" },
      { en: "Diamond and diagonal details from the logo", ar: "تفاصيل المعيّن والخط المائل المستوحاة من الشعار" },
      { en: "Headings in both languages, and Hijri dates", ar: "عناوين باللغتين وتواريخ هجرية" },
    ],
    swatches: ["#F3EEE6", "#1B2150", "#3D4D9B", "#D8A535"],
    defaultTheme: "light",
  },
  {
    id: "d",
    letter: "D",
    name: { en: "Digital / Auction Marketplace", ar: "سوق المزادات الرقمي" },
    oneLiner: {
      en: "A dynamic, technology-led direction with a stronger emphasis on auctions, live activity and bidding.",
      ar: "اتجاه ديناميكي بطابع تقني يركّز أكثر على المزادات والنشاط المباشر والمزايدة.",
    },
    philosophy: {
      en: "Auctions are about time and movement. Price charts, countdown rings and a live activity feed put buyers in the middle of the action, with the calm, polished finish of a modern technology product.",
      ar: "المزاد وقت وحركة. رسوم بيانية للأسعار وحلقات عدّ تنازلي وسجل نشاط مباشر تضع المشتري في قلب الحدث، بلمسة هادئة ومصقولة لمنتج تقني حديث.",
    },
    traits: [
      { en: "Dark appearance by default, with a light option", ar: "مظهر داكن افتراضياً مع خيار فاتح" },
      { en: "Price charts, countdowns and live bid activity", ar: "رسوم للأسعار وعدّ تنازلي ونشاط مزايدات مباشر" },
      { en: "Clear, evenly spaced figures for prices and times", ar: "أرقام واضحة ومتساوية العرض للأسعار والأوقات" },
      { en: "A board view of auctions closing soon", ar: "لوحة للمزادات القريبة من الإغلاق" },
    ],
    swatches: ["#080C1A", "#141A30", "#5B6CE0", "#E0B04A"],
    defaultTheme: "dark",
  },
];

export const CONCEPT_BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));
