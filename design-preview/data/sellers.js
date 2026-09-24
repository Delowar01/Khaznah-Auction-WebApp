// Public seller (warehouse) storefront data. Fields map onto the existing
// GET marketplace/sellers/<code>/ response — code, name, city, member_since,
// active_auction_count, buy_now_count, live_now, entitlements — plus
// presentation copy (tagline, description, pickup) that the storefront
// designs use. Listing counts are derived from the sample catalogue.
// Sellers other than Khazna Direct are fictional samples; production has no
// pickup-address or opening-hours fields on the public seller response.
import { photo, BRAND_PHOTOS } from "./media";

export const CITIES = {
  riyadh: { en: "Riyadh", ar: "الرياض" },
  jeddah: { en: "Jeddah", ar: "جدة" },
  dammam: { en: "Dammam", ar: "الدمام" },
  khobar: { en: "Al Khobar", ar: "الخبر" },
};

export const SELLERS = [
  {
    code: "KHAZNA",
    platform: true,
    name: { en: "Khazna Direct", ar: "خزنة مباشر" },
    monogram: "KD",
    tone: "#3D4D9B",
    city: "riyadh",
    memberSince: "2023-03-01",
    tagline: {
      en: "Platform-owned stock, listed with condition grades.",
      ar: "مخزون مملوك للمنصة، معروض بدرجات حالة.",
    },
    description: {
      en: "Khazna Direct lists stock that Khazna owns outright — customer returns, overstock and liquidation lots from the platform's own warehouse in Riyadh, each listed with a condition grade.",
      ar: "يعرض خزنة مباشر المخزون المملوك للمنصة بالكامل — مرتجعات العملاء وفائض المخزون ودفعات التصفية من مستودع المنصة في الرياض، ولكل منتج درجة حالة معلنة.",
    },
    pickup: {
      en: "Riyadh · Sun–Thu 9:00–18:00",
      ar: "الرياض · الأحد–الخميس 9:00–18:00",
    },
    cover: BRAND_PHOTOS.warehouseRiyadh,
    liveNow: false,
    entitlements: { auctions: true, buyNow: true, live: true },
  },
  {
    code: "RAWABI",
    name: { en: "Rawabi Home Outlet", ar: "روابي هوم أوتلت" },
    monogram: "RH",
    tone: "#8A5A36",
    city: "riyadh",
    memberSince: "2024-02-01",
    tagline: {
      en: "Showroom overstock in furniture, lighting and appliances.",
      ar: "فائض صالات العرض من الأثاث والإضاءة والأجهزة.",
    },
    description: {
      en: "Rawabi supplies ex-display and overstock pieces from furniture showrooms across Riyadh, sold from its warehouse in Al Sulay.",
      ar: "تقدّم روابي قطع العرض السابقة وفائض المخزون من صالات الأثاث في الرياض، وتبيعها من مستودعها في السلي.",
    },
    pickup: {
      en: "Al Sulay Industrial Area, Riyadh · Sat–Thu 10:00–20:00",
      ar: "المنطقة الصناعية بالسلي، الرياض · السبت–الخميس 10:00–20:00",
    },
    cover: photo("swivel-chair", 2),
    liveNow: false,
    entitlements: { auctions: true, buyNow: true, live: false },
  },
  {
    code: "REDSEA",
    name: { en: "Red Sea Trading Co.", ar: "شركة البحر الأحمر للتجارة" },
    monogram: "RS",
    tone: "#1F6F78",
    city: "jeddah",
    memberSince: "2023-08-01",
    tagline: {
      en: "Consumer electronics and appliance returns from the western region.",
      ar: "مرتجعات الإلكترونيات والأجهزة المنزلية من المنطقة الغربية.",
    },
    description: {
      en: "Red Sea Trading processes retail returns for electronics chains in Jeddah and Makkah, and hosts evening live sales on Khazna.",
      ar: "تعالج شركة البحر الأحمر للتجارة مرتجعات متاجر الإلكترونيات في جدة ومكة، وتقيم مزادات مباشرة مسائية على خزنة.",
    },
    pickup: {
      en: "Al Khumrah District, Jeddah · Sun–Thu 9:00–17:00",
      ar: "حي الخمرة، جدة · الأحد–الخميس 9:00–17:00",
    },
    cover: photo("headphones", 1),
    liveNow: true,
    entitlements: { auctions: true, buyNow: true, live: true },
  },
  {
    code: "MAJD",
    name: { en: "Dar Al Majd Wholesale", ar: "دار المجد للجملة" },
    monogram: "DM",
    tone: "#6B4E9B",
    city: "dammam",
    memberSince: "2024-05-01",
    tagline: {
      en: "Tools, automotive and travel goods in single units or cartons.",
      ar: "عدد وملحقات سيارات ومستلزمات سفر بالقطعة أو بالكرتونة.",
    },
    description: {
      en: "Dar Al Majd is a wholesale distributor in the Second Industrial City, Dammam, selling surplus trade stock to workshops, retailers and individual buyers.",
      ar: "دار المجد موزّع جملة في المدينة الصناعية الثانية بالدمام، يبيع فائض المخزون التجاري للورش والمتاجر والأفراد.",
    },
    pickup: {
      en: "2nd Industrial City, Dammam · Sun–Thu 8:00–16:00",
      ar: "المدينة الصناعية الثانية، الدمام · الأحد–الخميس 8:00–16:00",
    },
    cover: photo("wrench-set", 0),
    liveNow: false,
    entitlements: { auctions: true, buyNow: true, live: false },
  },
  {
    code: "SAHEL",
    name: { en: "Sahel Lifestyle", ar: "ساحل لايف ستايل" },
    monogram: "SL",
    tone: "#B0643B",
    city: "khobar",
    memberSince: "2025-01-01",
    tagline: {
      en: "Fashion and kitchen overstock from Eastern Province retailers.",
      ar: "فائض الأزياء وأدوات المطبخ من متاجر المنطقة الشرقية.",
    },
    description: {
      en: "Sahel Lifestyle clears end-of-season fashion and kitchenware from retailers in Al Khobar and Dhahran.",
      ar: "تصرّف ساحل لايف ستايل مخزون نهاية الموسم من الأزياء وأدوات المطبخ لمتاجر الخبر والظهران.",
    },
    pickup: {
      en: "King Fahd Road, Al Khobar · Sat–Thu 10:00–22:00",
      ar: "طريق الملك فهد، الخبر · السبت–الخميس 10:00–22:00",
    },
    cover: photo("capsule-coffee", 1),
    liveNow: false,
    entitlements: { auctions: true, buyNow: true, live: false },
  },
];

export const SELLER_BY_CODE = Object.fromEntries(SELLERS.map((s) => [s.code, s]));

export function getSeller(code) {
  return SELLER_BY_CODE[String(code || "").toUpperCase()] || null;
}

/** The storefront shown on each concept's /seller page. */
export const FEATURED_SELLER = "RAWABI";
